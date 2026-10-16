"use client";

import { useRelativeArticleDate } from "@/hooks/use-relative-article-date";

export function ArticleDate({
  dateTime,
  fallback,
  className,
}: {
  dateTime: string;
  fallback: string;
  className?: string;
}) {
  const label = useRelativeArticleDate(dateTime, fallback);

  return (
    <time dateTime={dateTime} className={className}>
      {label}
    </time>
  );
}
