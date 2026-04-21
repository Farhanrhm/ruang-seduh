import type { Session } from "next-auth";

/**
 * Memeriksa apakah session valid untuk mengakses halaman yang dilindungi.
 * Session dianggap valid jika memiliki user.id (string).
 */
export function checkGate(session: Session | null | undefined): "allowed" | "blocked" {
  if (session?.user?.id && typeof session.user.id === "string") {
    return "allowed";
  }
  return "blocked";
}

/**
 * Memvalidasi callbackUrl agar tidak ada redirect ke URL eksternal.
 * Mengembalikan "/" untuk URL tidak valid (null, undefined, string kosong, atau tidak diawali "/").
 */
export function validateCallbackUrl(url: string | null | undefined): string {
  if (!url || !url.startsWith("/")) {
    return "/";
  }
  return url;
}

/**
 * Membangun callbackUrl dari path halaman yang dilindungi.
 * Identity function — mengembalikan path itu sendiri.
 */
export function buildCallbackUrl(path: string): string {
  return path;
}
