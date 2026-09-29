import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/masuk",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Jika mencoba mengakses halaman admin, periksa role ADMIN
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      // Untuk route lain (checkout, profil), cukup pastikan login
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/jurnal/:path*", "/checkout/:path*", "/profil/:path*", "/admin/:path*"],
};
