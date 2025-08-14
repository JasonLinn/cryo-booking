import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 查找用戶
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        // 檢查密碼
        if (user.password) {
          // 如果用戶有密碼，使用 bcrypt 驗證
          const bcrypt = await import('bcryptjs')
          const isValid = await bcrypt.default.compare(credentials.password, user.password)
          if (!isValid) return null
        } else {
          // 舊版本相容性：檢查硬編碼密碼
          if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
            // 允許通過
          } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
            // 允許通過
          } else {
            return null
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}
