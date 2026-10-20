This is a [Next.js](https://nextjs.org) project bootstrapped with `[create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Connect to the Nest API

Copy `.env.example` to `.env.local` and set `NEST_API_URL` to the running
`json-server` address (the default is `http://localhost:3001`). The home page,
posts, notes, and their detail pages then read the public blog API directly.

## GitHub and Google login

Copy `.env.example` to `.env.local`, generate `AUTH_SECRET` with `npx auth secret`,
and create OAuth applications for GitHub and Google. Set their client IDs and
secrets in `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_ID`, and
`AUTH_GOOGLE_SECRET`. For local development, register these callback URLs:

- GitHub: `http://localhost:3000/api/auth/callback/github`
- Google: `http://localhost:3000/api/auth/callback/google`

Register the corresponding HTTPS callback URLs for production. The header
shows a setup hint when a login option is clicked before its credentials and
`AUTH_SECRET` are configured.
This login creates a session for the Next.js website; it does not issue a token
for the separate Nest API.

For a self-hosted deployment behind a reverse proxy, set `AUTH_URL` to the
public origin users visit, such as `https://example.com`. Set the GitHub OAuth
app's **Authorization callback URL** to that exact origin followed by
`/api/auth/callback/github` (for example,
`https://example.com/api/auth/callback/github`). The protocol, hostname,
optional `www`, port, and path must match the `redirect_uri` sent by the app.
Restart the Next.js process after changing its environment variables.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `[next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)` to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
