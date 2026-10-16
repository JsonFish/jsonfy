"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/components/language-provider";

export function ArticleDetailLoading({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <article aria-busy="true">
      <p role="status" className="sr-only">
        {t("article.loading")}
      </p>
      <header>
        <div aria-hidden="true" className="space-y-4 motion-safe:animate-pulse">
          <div className="h-4 w-28 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 w-4/5 rounded-lg bg-zinc-100 sm:h-12 dark:bg-zinc-800" />
          <div className="h-10 w-1/2 rounded-lg bg-zinc-100 sm:h-12 dark:bg-zinc-800" />
        </div>
      </header>
      {children}
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        {[0, 1, 2].map((paragraph) => (
          <div key={paragraph} className="space-y-3">
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-11/12 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </article>
  );
}
