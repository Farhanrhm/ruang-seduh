import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { kirimEmailInvoice } from "@/app/actions/email";

interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
}

export async function POST(req: Request) {
  try {
    const payload: MidtransNotificationPayload = await req.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY is not configured.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    // Midtrans signs notifications using SHA512(order_id + status_code + gross_amount + serverKey)
    const rawSignatureString = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(rawSignatureString)
      .digest("hex");

    if (expectedSignature !== payload.signature_key) {
      return NextResponse.json(
        { success: false, message: "Invalid signature." },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: payload.order_id },
      include: {
        items: true,
        user: { select: { email: true, name: true } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    let nextOrderStatus: "PAID" | "PENDING" | "CANCELLED" | null = null;

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        nextOrderStatus = "PENDING";
      } else if (fraudStatus === "accept") {
        nextOrderStatus = "PAID";
      }
    } else if (transactionStatus === "settlement") {
      nextOrderStatus = "PAID";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      nextOrderStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      nextOrderStatus = "PENDING";
    }

    // Return 200 immediately if webhook status is unhandled or unchanged (idempotent)
    if (!nextOrderStatus || order.status === nextOrderStatus) {
      return NextResponse.json({ success: true, message: "Order status unchanged." });
    }

    // Prevent reverting an already paid or shipped order to pending
    if (
      (order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED") &&
      nextOrderStatus === "PENDING"
    ) {
      return NextResponse.json({ success: true, message: "Order already finalized." });
    }

    if (nextOrderStatus === "PAID") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            midtransId: payload.transaction_id || order.midtransId,
            paymentType: payload.payment_type || order.paymentType,
          },
        });

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      });

      // Send invoice email asynchronously without blocking the webhook response
      if (order.user?.email) {
        const emailItems = order.items.map((item) => ({
          name: `${item.productName}${item.grindSize ? ` (${item.grindSize})` : ""}`,
          price: item.price,
          quantity: item.quantity,
        }));

        kirimEmailInvoice(
          order.user.email,
          order.recipientName || order.user.name || "Pelanggan",
          emailItems,
          order.totalAmount,
          order.id
        ).catch((err) => {
          console.error("Failed to send invoice email:", err);
        });
      }
    } else if (nextOrderStatus === "CANCELLED") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            midtransId: payload.transaction_id || order.midtransId,
          },
        });

        // Restore stock only if the order was previously marked as PAID
        if (order.status === "PAID") {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }
        }
      });
    } else if (nextOrderStatus === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          midtransId: payload.transaction_id || order.midtransId,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Notification handled." });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
