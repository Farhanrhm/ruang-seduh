import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Mengembalikan tipe data asli dari Session, lalu 
   * menambahkan properti 'id' ke dalam objek 'user'.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}