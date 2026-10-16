"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { formatRelativeArticleDate } from "@/lib/relative-article-date";

export function useRelativeArticleDate(value: string, fallback: string) {
  const { locale } = useLanguage();
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    setLabel(formatRelativeArticleDate(value, locale) ?? fallback);
  }, [fallback, locale, value]);

  return label;
}
