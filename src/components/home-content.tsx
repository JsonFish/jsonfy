"use client";

import Link from "next/link";
import { ArticleLink } from "@/components/article-scroll-reset";
import Image from "next/image";
import { Github, Mail } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ArticleDate } from "@/components/article-date";
import type { ArticleListItem } from "@/lib/blog-api";

export function HomeContent({ posts }: { posts: ArticleListItem[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-24">
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t("home.titlePrefix")}
              <span className="text-cyan-500 dark:text-cyan-400"> Json</span>.
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium">
              {t("home.role")}
            </p>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400">
            {t("home.interestedIntro")}{" "}
            <span className="text-[#59C4DC] font-semibold">React</span>,{" "}
            <span className="text-[#000000] dark:text-[#ffffff] font-semibold">
              NextJs
            </span>{" "}
            {t("home.and")}{" "}
            <span className="text-[#e0234e] font-semibold">NestJs</span>
            {t("home.interestedOutro")}
          </p>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
              {t("home.moreAboutMe")}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a
                target="_blank"
                href="https://github.com/JsonFish"
                className="p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Yu4094937774922"
                target="_blank"
                className="p-2 rounded-full hover:scale-110 transition-transform "
              >
                <Image
                  src="/x.svg"
                  alt="X"
                  width={20}
                  height={20}
                  className="w-5 h-5 dark:invert"
                />
              </a>
              <a
                href="mailto:jsonfishyu@gmail.com"
                target="_blank"
                className="p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <div className="absolute inset-0 bg-linear-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-full animate-pulse" />
          <Image
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Json"
            alt="Json"
            fill
            sizes="(min-width: 768px) 16rem, 12rem"
            priority
            className="rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-2xl relative z-10"
          />
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("home.latestWriting")}
          </h2>
          <Link href="/posts" className="text-sm text-zinc-500 hover:underline">
            {t("home.viewAllPosts")}
          </Link>
        </div>
        <div className="grid gap-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col items-start"
            >
              <ArticleDate
                dateTime={post.createdAt}
                fallback={post.date}
                className="mb-2 text-sm text-zinc-400"
              />
              <h2 className="text-xl font-semibold mb-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                <ArticleLink href={`/posts/${post.slug}`}>
                  {post.title}
                </ArticleLink>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
