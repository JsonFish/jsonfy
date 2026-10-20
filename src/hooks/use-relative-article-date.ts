"use client";

import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/language-provider";
import { formatRelativeArticleDate } from "@/lib/relative-article-date";

const subscribe = () => () => {};

export function useRelativeArticleDate(value: string, fallback: string) {
  const { locale } = useLanguage();

  return useSyncExternalStore(
    subscribe,
    () =>
      locale === "zh"
        ? fallback
        : formatRelativeArticleDate(value, locale) ?? fallback,
    () => fallback,
  );
}
