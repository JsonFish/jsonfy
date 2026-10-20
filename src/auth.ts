import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authProviders = {
  github: Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GITHUB_ID &&
      process.env.AUTH_GITHUB_SECRET
  ),
  google: Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET
  ),
};

export const { handlers, auth } = NextAuth({
  // Self-hosted production runs behind a reverse proxy. Set AUTH_TRUST_HOST=true
  // only when that proxy overwrites the forwarded host/protocol headers.
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  providers: [
    ...(authProviders.github ? [GitHub] : []),
    ...(authProviders.google ? [Google] : []),
  ],
});
