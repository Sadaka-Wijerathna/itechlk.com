import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    // ─── Email / Password ───────────────────────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        if (!user.emailVerified) {
          throw new Error("Please verify your email address before logging in.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordMatch) return null;

        return user;
      },
    }),

    // ─── Google ─────────────────────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // ─── GitHub ─────────────────────────────────────────────────────────────────
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (account) {
        token.provider = account.provider;
        token.email = user?.email || token.email;
      }
      if (user || trigger === "update") {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        const emailToQuery = token.email;
        if (emailToQuery) {
          const dbUser = await prisma.user.findUnique({
            where: { email: emailToQuery },
          });
          if (dbUser) {
            token.role = (dbUser as any).role ?? "customer";
            token.firstName = (dbUser as any).firstName || "";
            token.lastName = (dbUser as any).lastName || "";
            token.country = (dbUser as any).country || "";
            token.phoneCode = (dbUser as any).phoneCode || "";
            token.phone = (dbUser as any).phone || "";
            token.name = (dbUser as any).name || dbUser.name || "";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "customer";
        session.user.provider = token.provider as string;
        (session.user as any).firstName = token.firstName as string;
        (session.user as any).lastName = token.lastName as string;
        (session.user as any).country = token.country as string;
        (session.user as any).phoneCode = token.phoneCode as string;
        (session.user as any).phone = token.phone as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  events: {
    async createUser({ user }) {
      if (
        user.email === process.env.ADMIN_EMAIL ||
        user.email === "sadakaparamiwijerathna1@gmail.com" ||
        user.email === "itechlkstore@gmail.com"
      ) {
        await prisma.user.update({
          where: { email: user.email! },
          data: { role: "admin" },
        });
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
