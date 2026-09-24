import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

const secret = process.env.SANITY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const body = await req.text();

    if (!secret) {
      console.error("SANITY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    if (!isValidSignature(body, signature || "", secret)) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Assuming the webhook is configured in Sanity with this projection:
    // {
    //   "_id": _id,
    //   "_type": _type,
    //   "name": name,
    //   "slug": slug.current,
    //   "price": price,
    //   "stock": stock,
    //   "weight": weight,
    //   "grindOptions": grindOptions,
    //   "imageUrl": image.asset->url,
    //   "category": category,
    //   "description": description,
    //   "isDeleted": _deleted // fake property, sanity has specific ways to handle deletes
    // }
    // Or we can rely on Sanity's predefined event payload if not customized.
    // For this example, we expect the standard document or a customized projection.

    const { _id, _type, name, slug, price, stock, weight, grindOptions, imageUrl, category, description } = payload;

    if (_type !== "product") {
      return NextResponse.json({ success: true, message: "Ignored, not a product" });
    }

    // Handle Delete / Unpublish (soft delete in Prisma)
    // If name is missing, it's likely a delete event projection (if configured correctly)
    // Or you can configure Sanity webhook to send a specific flag for deletes.
    // We'll use a pragmatic approach: if essential data is missing, we consider it soft-deleted.
    if (!name || !slug) {
      await prisma.product.updateMany({
        where: { sanityId: _id },
        data: { isActive: false },
      });
      revalidatePath("/toko");
      revalidatePath(`/toko/${slug}`);
      revalidatePath("/");
      return NextResponse.json({ success: true, message: "Product deactivated" });
    }

    // Upsert Product
    await prisma.product.upsert({
      where: {
        sanityId: _id,
      },
      update: {
        name: name,
        slug: slug,
        price: price || 0,
        stock: stock || 0,
        weight: weight || 1,
        grindOptions: grindOptions || [],
        imageUrl: imageUrl || null,
        category: (category as Category) || "BEANS",
        description: description || "",
        isActive: true,
      },
      create: {
        sanityId: _id,
        name: name,
        slug: slug,
        price: price || 0,
        stock: stock || 0,
        weight: weight || 1,
        grindOptions: grindOptions || [],
        imageUrl: imageUrl || null,
        category: (category as Category) || "BEANS",
        description: description || "",
        isActive: true,
      },
    });

    revalidatePath("/toko");
    revalidatePath(`/toko/${slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Product synced" });
  } catch (error) {
    console.error("Sanity Webhook Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
