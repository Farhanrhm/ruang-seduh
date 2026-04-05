import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  orderId: string;
  name: string;
  items: any[];
  total: number;
}

export const InvoiceEmail = ({
  orderId = "INV-20260405-1024",
  name = "Penikmat Kopi",
  items = [
    { name: "Kopi Gayo Washed", quantity: 1, price: 85000 },
    { name: "Hario V60 Dripper", quantity: 1, price: 120000 }
  ],
  total = 205000,
}: InvoiceEmailProps) => {
  const formatRupiah = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <Html>
      <Head />
      <Preview>Invoice {orderId} dari Ruang Seduh</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Bagian Header Cokelat Tua */}
          <Section style={header}>
            <Text style={headerTitle}>Ruang Seduh</Text>
            <Text style={headerSubtitle}>INVOICE PEMBELIAN</Text>
          </Section>

          {/* Isi Email */}
          <Section style={content}>
            <Heading style={greeting}>Halo, {name}!</Heading>
            <Text style={text}>
              Terima kasih telah berbelanja di Ruang Seduh. Pesanan Anda dengan rincian di bawah ini sedang kami proses dan akan segera dikirim.
            </Text>

            {/* Kotak Nomor Invoice */}
            <Section style={invoiceBox}>
              <Text style={invoiceLabel}>NO. INVOICE</Text>
              <Text style={invoiceNumber}>{orderId}</Text>
            </Section>

            <Hr style={divider} />

            {/* Rincian Pesanan */}
            <Section>
              <Text style={sectionTitle}>Rincian Pesanan:</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemColName}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQty}>{item.quantity}x</Text>
                  </Column>
                  <Column style={itemColPrice}>
                    <Text style={itemPrice}>{formatRupiah(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Total Pembayaran */}
            <Section>
              <Row>
                <Column style={itemColName}>
                  <Text style={totalLabel}>Total Pembayaran</Text>
                </Column>
                <Column style={itemColPrice}>
                  <Text style={totalValue}>{formatRupiah(total)}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={footerText}>
              Silakan selesaikan pembayaran sesuai instruksi. Jika ada pertanyaan, balas email ini ke halo@ruangseduh.id.
            </Text>
          </Section>

          {/* Footer Terang */}
          <Section style={footer}>
            <Text style={footerCopyright}>© {new Date().getFullYear()} Ruang Seduh. Dirancang dengan sepenuh hati.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styling Object untuk React Email (Inline CSS)
const main = { backgroundColor: "#f4f4f4", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "40px auto", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", maxWidth: "600px" };
const header = { backgroundColor: "#4B2E1C", padding: "40px 20px", textAlign: "center" as const };
const headerTitle = { color: "#D4956A", fontSize: "28px", fontWeight: "bold", margin: "0", letterSpacing: "-1px" };
const headerSubtitle = { color: "#FDF6EE", fontSize: "12px", letterSpacing: "3px", margin: "10px 0 0 0" };
const content = { padding: "40px 30px" };
const greeting = { color: "#4B2E1C", fontSize: "22px", fontWeight: "bold", margin: "0 0 15px" };
const text = { color: "#8B5E3C", fontSize: "15px", lineHeight: "24px", margin: "0 0 25px" };
const invoiceBox = { backgroundColor: "#FDF6EE", padding: "20px", borderRadius: "12px", textAlign: "center" as const, marginBottom: "30px", border: "1px solid #eaddd3" };
const invoiceLabel = { color: "#8B5E3C", fontSize: "10px", fontWeight: "bold", letterSpacing: "2px", margin: "0 0 5px" };
const invoiceNumber = { color: "#4B2E1C", fontSize: "24px", fontWeight: "bold", margin: "0" };
const divider = { borderColor: "#eaddd3", margin: "20px 0" };
const sectionTitle = { color: "#4B2E1C", fontSize: "16px", fontWeight: "bold", marginBottom: "15px" };
const itemRow = { marginBottom: "15px" };
const itemColName = { width: "70%" };
const itemColPrice = { width: "30%", textAlign: "right" as const };
const itemName = { color: "#4B2E1C", fontSize: "15px", margin: "0 0 4px 0", fontWeight: "500" };
const itemQty = { color: "#8B5E3C", fontSize: "13px", margin: "0" };
const itemPrice = { color: "#4B2E1C", fontSize: "15px", margin: "0", fontWeight: "500" };
const totalLabel = { color: "#4B2E1C", fontSize: "18px", fontWeight: "bold", margin: "0" };
const totalValue = { color: "#D4956A", fontSize: "22px", fontWeight: "bold", margin: "0" };
const footerText = { color: "#8B5E3C", fontSize: "14px", lineHeight: "22px", margin: "40px 0 0 0", textAlign: "center" as const, fontStyle: "italic" };
const footer = { backgroundColor: "#FDF6EE", padding: "20px", textAlign: "center" as const, borderTop: "1px solid #eaddd3" };
const footerCopyright = { color: "#8B5E3C", fontSize: "12px", margin: "0" };