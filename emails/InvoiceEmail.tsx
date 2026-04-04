import { Html, Body, Container, Text, Heading, Section, Row, Column, Hr } from '@react-email/components';

// Tipe Data untuk Email
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceEmailProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
}

export const InvoiceEmail = ({ 
  customerName = "Pelanggan", 
  orderId = "INV-0000", 
  items = [], 
  totalAmount = 0, 
  shippingCost = 0 
}: InvoiceEmailProps) => {
  
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const subtotal = totalAmount - shippingCost;

  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          {/* Header Nota */}
          <Section style={header}>
            <Heading style={logoText}>Ruang Seduh.</Heading>
            <Text style={headerSubText}>Terima kasih atas pesananmu!</Text>
          </Section>

          {/* Info Pelanggan & Pesanan */}
          <Section style={infoSection}>
            <Row>
              <Column>
                <Text style={infoTitle}>Ditagihkan Kepada:</Text>
                <Text style={infoText}><b>{customerName}</b></Text>
              </Column>
              <Column align="right">
                <Text style={infoTitle}>Nomor Pesanan:</Text>
                <Text style={infoText}><b>{orderId}</b></Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Rincian Barang */}
          <Section style={itemSection}>
            <Text style={sectionTitle}>Rincian Belanja</Text>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{ width: '70%' }}>
                  <Text style={itemName}>{item.quantity}x {item.name}</Text>
                </Column>
                <Column style={{ width: '30%' }} align="right">
                  <Text style={itemPrice}>{formatRupiah(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Kalkulasi Total */}
          <Section style={totalSection}>
            <Row style={totalRow}>
              <Column><Text style={totalText}>Subtotal</Text></Column>
              <Column align="right"><Text style={totalText}>{formatRupiah(subtotal)}</Text></Column>
            </Row>
            <Row style={totalRow}>
              <Column><Text style={totalText}>Ongkos Kirim</Text></Column>
              <Column align="right"><Text style={totalText}>{formatRupiah(shippingCost)}</Text></Column>
            </Row>
            <Row style={{ marginTop: '12px' }}>
              <Column><Text style={grandTotalText}>Total Bayar</Text></Column>
              <Column align="right"><Text style={grandTotalAmount}>{formatRupiah(totalAmount)}</Text></Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Pesananmu sedang kami siapkan dan akan segera dikirim. Jika ada pertanyaan, balas email ini.
            </Text>
            <Text style={footerText}>© 2026 Ruang Seduh. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- CSS Styles Objects ---
const main = { backgroundColor: '#FDF6EE', fontFamily: 'sans-serif', padding: '40px 0' };
const container = { backgroundColor: '#ffffff', border: '1px solid #e6d9cc', borderRadius: '16px', margin: '0 auto', maxWidth: '600px', overflow: 'hidden' };
const header = { backgroundColor: '#4B2E1C', padding: '32px 40px', textAlign: 'center' as const };
const logoText = { color: '#FDF6EE', fontSize: '32px', fontWeight: 'bold', margin: '0', letterSpacing: '-1px' };
const headerSubText = { color: '#D4956A', fontSize: '16px', margin: '8px 0 0 0' };
const infoSection = { padding: '32px 40px 20px 40px' };
const infoTitle = { color: '#8B5E3C', fontSize: '12px', textTransform: 'uppercase' as const, fontWeight: 'bold', margin: '0 0 4px 0' };
const infoText = { color: '#4B2E1C', fontSize: '16px', margin: '0' };
const divider = { borderColor: '#e6d9cc', margin: '0 40px' };
const itemSection = { padding: '24px 40px' };
const sectionTitle = { color: '#4B2E1C', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' };
const itemRow = { marginBottom: '12px' };
const itemName = { color: '#4B2E1C', fontSize: '15px', margin: '0' };
const itemPrice = { color: '#8B5E3C', fontSize: '15px', margin: '0', fontWeight: 'bold' };
const totalSection = { padding: '24px 40px', backgroundColor: '#faf6f0' };
const totalRow = { marginBottom: '8px' };
const totalText = { color: '#8B5E3C', fontSize: '15px', margin: '0' };
const grandTotalText = { color: '#4B2E1C', fontSize: '18px', fontWeight: 'bold', margin: '0' };
const grandTotalAmount = { color: '#D4956A', fontSize: '24px', fontWeight: 'bold', margin: '0' };
const footer = { padding: '32px 40px', textAlign: 'center' as const };
const footerText = { color: '#8B5E3C', fontSize: '13px', lineHeight: '20px', margin: '0 0 8px 0' };