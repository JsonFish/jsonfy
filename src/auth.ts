import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const nestApiBaseUrl = (
  process.env.NEST_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");

type BackendGithubLogin = {
  id: string;
  username: string;
  avatar: string;
  role: number;
  accessToken: string;
  refreshToken: string;
};

type BackendApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

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
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider !== "github") return token;

      if (!account.access_token) {
        throw new Error("GitHub did not return an access token");
      }

      const response = await fetch(`${nestApiBaseUrl}/auth/github/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: account.access_token }),
        cache: "no-store",
      });
      const result = (await response
        .json()
        .catch(() => null)) as BackendApiResponse<BackendGithubLogin> | null;

      if (!response.ok || result?.code !== 200 || !result.data) {
        // Do not include provider tokens or response bodies in the error.
        throw new Error("GitHub login could not be saved by the API");
      }

      // Auth.js stores JWT sessions in an encrypted, HTTP-only cookie. Keep
      // backend credentials out of the public session object and browser JS.
      token.backendUserId = result.data.id;
      token.backendUsername = result.data.username;
      token.backendAvatar = result.data.avatar;
      token.backendRole = result.data.role;
      token.backendAccessToken = result.data.accessToken;
      token.backendRefreshToken = result.data.refreshToken;
      token.sub = result.data.id;
      token.name = result.data.username;
      token.picture = result.data.avatar;

      return token;
    },
  },
});
