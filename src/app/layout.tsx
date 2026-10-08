import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { auth, authProviders } from "@/auth";
import { getRequestLocale } from "@/lib/server-locale";

// Geist（无衬线）和 Geist_Mono（等宽）
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // 仅加载拉丁字符子集
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 配置页面标题和描述，SEO
 */
export const metadata: Metadata = {
  title: "Json",
  description:
    "A high-quality minimalist blog built with Next.js, Tiptap, and shadcn.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = process.env.AUTH_SECRET ? await auth() : null;
  const locale = await getRequestLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-zinc-200 dark:selection:bg-zinc-800`}
      >
        <ThemeProvider>
          <LanguageProvider initialLocale={locale}>
            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6">
              <SiteHeader
                userName={session?.user?.name ?? session?.user?.email ?? null}
                authProviders={authProviders}
              />
              <main className="flex-1 py-10">{children}</main>
              <SiteFooter />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
