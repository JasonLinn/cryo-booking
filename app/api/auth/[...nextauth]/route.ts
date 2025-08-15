import NextAuth from 'next-auth'
// import { authOptions } from '@/lib/auth'

const handler = NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }
