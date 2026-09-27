export function formatOrderId(id: string): string {
  if (!id) return id;
  // Jika ID sudah ada awalan RS-, tidak perlu diformat lagi.
  if (id.startsWith("RS-")) return id;
  
  // Memotong UUID dan mengambil 8 karakter awal untuk dijadikan referensi order
  return `RS-${id.substring(0, 8).toUpperCase()}`;
}
