import midtransClient from 'midtrans-client';

const isProduction = process.env.NODE_ENV === 'production';
const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

if (isProduction && (!serverKey || !clientKey)) {
  throw new Error("Missing MIDTRANS_SERVER_KEY or NEXT_PUBLIC_MIDTRANS_CLIENT_KEY in production.");
}

// Initialize Snap client
export const snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: serverKey || 'SB-Mid-server-DUMMY',
  clientKey: clientKey || 'SB-Mid-client-DUMMY'
});

// Initialize CoreApi client (optional, for advanced usage)
export const coreApi = new midtransClient.CoreApi({
  isProduction: isProduction,
  serverKey: serverKey || 'SB-Mid-server-DUMMY',
  clientKey: clientKey || 'SB-Mid-client-DUMMY'
});
