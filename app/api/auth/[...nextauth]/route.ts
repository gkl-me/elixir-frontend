import { ENV } from "@/config/env";
import { authService } from "@/services/auth.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),

    GithubProvider({
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  debug: true,

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && account?.id_token) {
          const res = await authService.googleAuth({
            idToken: account?.id_token,
          });
          account.access_token = res.data.data.accessToken;
          account.refresh_token = res.data.data.refreshToken;
        }

        if (account?.provider === "github" && account?.access_token) {
          const res = await authService.githubAuth({
            access_token: account.access_token,
            githubId: user.id,
            githubUsername: profile.login,
            name: user.name,
            email: user.email,
            image: user.image,
          });
          account.access_token = res.data.data.accessToken;
          account.refresh_token = res.data.data.refreshToken;
        }
        return true;
      } catch (error) {
        const err = AxiosErrorHandler(error);
        if (err.errorCode) {
          return `/login?reason=${err.errorCode}`;
        }
        return `/login?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`;
      }
    },

    async jwt({ token, account }) {
      if (account?.access_token && account?.refresh_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.accessToken && token.refreshToken) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/login",
  },

  secret: ENV.NEXT_AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
