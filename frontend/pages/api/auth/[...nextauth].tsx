import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Simpan role di token
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const response = await fetch(`http://localhost:5000/api/user?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        const userData = await response.json();

        if (userData) {
          session.user.id = userData.id;
          session.user.role = userData.role; // Simpan role di session
          session.user.name = userData.name;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      // Jika URL sudah valid, kembalikan URL tersebut
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Jika pengguna sudah login, arahkan ke halaman yang sesuai berdasarkan role
      if (token?.role) {
        if (token.role === "Admin") {
          return `${baseUrl}/data-peminjaman`;
        } else {
          return `${baseUrl}/peminjaman`;
        }
      }

      // Jika pengguna belum login, arahkan ke halaman login
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
