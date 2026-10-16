"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ArticleLink } from "@/components/article-scroll-reset";
import { ArticleDate } from "@/components/article-date";
import { Button } from "@/components/ui/button";
import type {
  ArticleListItem,
  ArticleListPage,
  BlogType,
} from "@/lib/blog-api";
import type { Locale } from "@/lib/i18n";

type ListState = {
  items: ArticleListItem[];
  page: number;
  hasMore: boolean;
};

type ListAction = {
  type: "append";
  page: number;
  items: ArticleListItem[];
  total: number;
};

/**
 * 后端在 offset 分页下会跨页重复返回同一条（实测第 1–9 页共 87 条、去重后 86 条），
 * 所以首屏与后续分页都要按 slug 去重，否则会出现重复 key 与重复链接。
 */
function mergeUnique(current: ArticleListItem[], incoming: ArticleListItem[]) {
  const seen = new Set(current.map((item) => item.slug));
  const unique = incoming.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
  return [...current, ...unique];
}

function initListState({
  items,
  total,
}: {
  items: ArticleListItem[];
  total: number;
}): ListState {
  const unique = mergeUnique([], items);
  return { items: unique, page: 1, hasMore: unique.length < total };
}

function listReducer(state: ListState, action: ListAction): ListState {
  const items = mergeUnique(state.items, action.items);
  return {
    items,
    page: action.page,
    // 以累计「唯一」条数判断是否还有更多：若用 页数 × pageSize 比较 total，
    // 后端一旦返回重复条目就会提前结束，末尾文章永远刷不出来。
    hasMore: action.items.length > 0 && items.length < action.total,
  };
}

export function InfiniteArticleList({
  type,
  locale,
  initialItems,
  initialTotal,
}: {
  type: BlogType;
  locale: Locale;
  initialItems: ArticleListItem[];
  initialTotal: number;
}) {
  const { t, locale: selectedLocale } = useLanguage();
  const [state, dispatch] = useReducer(
    listReducer,
    { items: initialItems, total: initialTotal },
    initListState,
  );
  const { items, page, hasMore } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current || selectedLocale !== locale) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    abortRef.current = controller;
    const nextPage = page + 1;

    try {
      const response = await fetch(
        `/api/articles?type=${type}&page=${nextPage}&lang=${locale}`,
        {
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error("Failed to load articles");

      const data = (await response.json()) as ArticleListPage;
      if (controller.signal.aborted) return;
      dispatch({
        type: "append",
        page: nextPage,
        items: data.items,
        total: data.total,
      });
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      // Also reset on abort: a quick language switch back may keep this list
      // mounted, and leaving it loading would prevent pagination from resuming.
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, type, locale, selectedLocale]);

  useEffect(() => () => abortRef.current?.abort(), [selectedLocale]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore || loading || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [error, hasMore, loading, loadMore]);

  if (selectedLocale !== locale) {
    return <p role="status">{t("list.loading")}</p>;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-12">
        {items.map((item) => (
          <article key={item.slug} className="group flex flex-col items-start">
            <ArticleDate
              dateTime={item.createdAt}
              fallback={item.date}
              className="mb-2 text-sm text-zinc-400"
            />
            <h2 className="mb-3 text-xl font-semibold transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              <ArticleLink href={`/${type}s/${item.slug}`}>
                {item.title}
              </ArticleLink>
            </h2>
            <p className="line-clamp-2 text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {hasMore && !error && (
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      )}
      {/* 每种状态各自声明语义，避免 role="status" 嵌在 aria-live 里被重复播报 */}
      <div className="flex justify-center text-sm text-zinc-500 dark:text-zinc-400">
        {loading && (
          <span className="flex items-center gap-2" role="status">
            <LoaderCircle className="size-4 motion-safe:animate-spin" />
            {t("list.loading")}
          </span>
        )}
        {error && (
          <div className="flex items-center gap-3" role="alert">
            <span>{t("list.loadError")}</span>
            <Button variant="outline" size="sm" onClick={() => void loadMore()}>
              {t("list.retry")}
            </Button>
          </div>
        )}
        {!loading && !error && !hasMore && (
          <span role="status">
            {t(items.length ? "list.end" : "list.empty")}
          </span>
        )}
      </div>
    </div>
  );
}
