import { Html, Body, Container, Text, Heading, Button, Img, Section } from '@react-email/components';

export const WelcomeEmail = ({ name }: { name: string }) => (
  <Html>
    <Body style={{ backgroundColor: '#FDF6EE', padding: '40px 0' }}>
      <Container style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #8B5E3C10' }}>
        <Heading style={{ fontFamily: 'serif', color: '#4B2E1C', fontSize: '28px' }}>Selamat Datang di Ruang Seduh, {name}! ☕</Heading>
        <Text style={{ color: '#8B5E3C', fontSize: '16px', lineHeight: '24px' }}>
          Kami sangat senang kamu bergabung. Sekarang kamu bisa mulai mencatat resep seduhanmu, menjelajahi direktori kopi nusantara, dan berbelanja biji kopi terbaik.
        </Text>
        <Section style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button href="https://localhost:3000/jurnal/baru" style={{ backgroundColor: '#D4956A', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
            Mulai Catat Seduhan
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);
