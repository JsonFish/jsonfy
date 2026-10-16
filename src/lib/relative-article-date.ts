import type { Locale } from "@/lib/i18n";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_RELATIVE_DAYS = 7;

/** Returns a localized relative label for dates from today through six days ago. */
export function formatRelativeArticleDate(
  value: string,
  locale: Locale,
  now = new Date(),
): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const startOfLocalDay = (day: Date) =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const daysAgo = Math.round(
    (startOfLocalDay(now) - startOfLocalDay(date)) / DAY_IN_MS,
  );

  if (daysAgo < 0 || daysAgo > MAX_RELATIVE_DAYS) return null;

  const formatter = new Intl.RelativeTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { numeric: "auto" },
  );
  return formatter.format(-daysAgo, "day");
}
