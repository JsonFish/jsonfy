"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

type BackLinkProps = {
  href: string;
  className?: string;
};

export function BackLink({
  href,
  className = "my-8 xl:mt-0 xl:mb-6",
}: BackLinkProps) {
  const { t } = useLanguage();
  return (
    <Link
      href={href}
      className={`inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${className}`}
    >
      {t("info.back")}
    </Link>
  );
}
