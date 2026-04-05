import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({
  name = "Penikmat Kopi",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Selamat datang di Ruang Seduh, {name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Bagian Header Cokelat Tua */}
          <Section style={header}>
            <Text style={headerTitle}>Ruang Seduh</Text>
            <Text style={headerSubtitle}>SELAMAT DATANG</Text>
          </Section>

          {/* Isi Email */}
          <Section style={content}>
            <Heading style={greeting}>Halo, {name}! ☕</Heading>
            <Text style={text}>
              Selamat datang di komunitas Ruang Seduh! Kami sangat senang Anda bergabung bersama kami.
            </Text>
            <Text style={text}>
              Di sini, Anda tidak hanya menemukan biji kopi Nusantara pilihan, tetapi juga panduan teknik seduh manual, dan fitur Jurnal personal untuk mencatat setiap eksperimen rasio seduhan Anda.
            </Text>

            {/* Tombol Aksi */}
            <Section style={buttonContainer}>
              <Button style={button} href="https://ruang-seduh-nu.vercel.app/">
                Mulai Eksplorasi
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              Mari buat secangkir kopi yang hangat hari ini. Jika butuh bantuan atau memiliki pertanyaan, jangan ragu untuk membalas email ini!
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

// Styling Object untuk React Email (Inline CSS agar aman di semua klien email)
const main = { backgroundColor: "#f4f4f4", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "40px auto", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", maxWidth: "600px" };
const header = { backgroundColor: "#4B2E1C", padding: "40px 20px", textAlign: "center" as const };
const headerTitle = { color: "#D4956A", fontSize: "28px", fontWeight: "bold", margin: "0", letterSpacing: "-1px" };
const headerSubtitle = { color: "#FDF6EE", fontSize: "12px", letterSpacing: "3px", margin: "10px 0 0 0" };
const content = { padding: "40px 30px" };
const greeting = { color: "#4B2E1C", fontSize: "22px", fontWeight: "bold", margin: "0 0 15px" };
const text = { color: "#8B5E3C", fontSize: "15px", lineHeight: "24px", margin: "0 0 20px" };
const buttonContainer = { textAlign: "center" as const, margin: "35px 0" };
const button = { backgroundColor: "#D4956A", color: "#FDF6EE", padding: "14px 28px", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", textDecoration: "none", display: "inline-block", border: "1px solid #b57a52" };
const divider = { borderColor: "#eaddd3", margin: "30px 0" };
const footerText = { color: "#8B5E3C", fontSize: "14px", lineHeight: "22px", margin: "0", textAlign: "center" as const, fontStyle: "italic" };
const footer = { backgroundColor: "#FDF6EE", padding: "20px", textAlign: "center" as const, borderTop: "1px solid #eaddd3" };
const footerCopyright = { color: "#8B5E3C", fontSize: "12px", margin: "0" };

export default WelcomeEmail;