/* eslint-disable new-cap */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { createUser } from "@/features/user/api";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET as string,
  jwt: {
    maxAge: 5 * 60 * 1000,
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "name email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      token.role = "user";

      if (account && user) {
        await createUser(
          "user",
          account.id_token,
          profile.given_name || "",
          profile.family_name || "",
          user.email,
          account.providerAccountId || "",
          account.provider || ""
        );

        token.provider = account.provider;
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.tokenExpiresAt = account.expires_at * 1000;
        token.refresh_token = account.refresh_token;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.tokenExpiresAt) {
        return token;
      }

      if (token.provider === "google") {
        // Access token has expired, try to update it
        return googleRefreshAccessToken(token);
      }
    },

    session({ session, token, user }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.id_token = token.id_token;
      session.provider = token.provider;
      session.role = token.role;

      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
  cookies: {
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  // cookies: {
  //   callbackUrl: {
  //     name: `next-auth.callback-url`,
  //     options: {
  //       sameSite: "lax",
  //       path: "/",
  //       secure: false,
  //     },
  //   },
  // },
});

async function googleRefreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_ID as string,
        client_secret: process.env.GOOGLE_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      });

    // console.log("refresh url", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    // console.log("Refresh calisti ***");
    // console.log(refreshedTokens);
    // console.log("Refresh calisti ---");

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      id_token: refreshedTokens.id_token,
      access_token: refreshedTokens.access_token,
      tokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
