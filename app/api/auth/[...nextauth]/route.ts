import { ENV } from "@/config/env";
import { authService } from "@/services/auth.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";
import { headers } from "next/headers";

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
        //add header to extract user agent
        const reqHeaders = await headers()
        const userAgent = reqHeaders.get('user-agent') || ""
        const clientIp = reqHeaders.get('x-forwarded-for')?.split(",")[0].trim() || reqHeaders.get("x-real-ip") || "";

        const requestConfig = {
          headers: {
            "user-agent": userAgent,
            "x-forwarded-for": clientIp,
          }
        }


        if (account?.provider === "google" && account?.id_token) {
          const res = await authService.googleAuth({
            idToken: account?.id_token,
          }, requestConfig);
          account.access_token = res.data.data.accessToken;
          account.refresh_token = res.data.data.refreshToken;
          account.hasWorkspace = Boolean(res.data.data.workspace);
          account.workspaceSlug = String(res.data.data.workspace?.slug) || "";
        }

        if (account?.provider === "github" && account?.access_token) {
          const res = await authService.githubAuth({
            access_token: account.access_token,
            githubId: user.id,
            githubUsername: profile.login,
            name: user.name,
            email: user.email,
            image: user.image,
          }, requestConfig);
          account.access_token = res.data.data.accessToken;
          account.refresh_token = res.data.data.refreshToken;
          account.hasWorkspace = Boolean(res.data.data.workspace);
          account.workspaceSlug = String(res.data.data.workspace?.slug) || "";
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
        token.hasWorkspace = Boolean(account.hasWorkspace);
        token.workspaceSlug = account.workspaceSlug;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.accessToken && token.refreshToken) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.hasWorkspace = Boolean(token.hasWorkspace);
        session.workspaceSlug = String(token.workspaceSlug);
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
