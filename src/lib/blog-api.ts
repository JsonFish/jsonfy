import { defaultLocale, type Locale } from "@/lib/i18n";

export type BlogType = "post" | "note";

export type BlogArticle = {
  id: number;
  title: string;
  slug: string;
  type: BlogType;
  description: string;
  content: string;
  views: number;
  createTime: string;
  updateTime: string;
  tags: { id: number; tagName: string }[];
};

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type BlogList = {
  articleList: BlogArticle[];
  total: number;
  page: number;
  pageSize: number;
};

export const BLOG_LIST_PAGE_SIZE = 10;

/** 首页「最新文章」区块的展示条数 */
export const HOME_LATEST_COUNT = 3;

class BlogApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const apiBaseUrl = (
  process.env.NEST_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");

async function fetchBlog<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const body = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !body || body.code !== 200) {
    throw new BlogApiError(
      body?.message ?? `请求博客服务失败（${response.status}）`,
      response.status,
    );
  }
  return body.data;
}

export async function getBlogArticles(
  type: BlogType,
  pageSize: number,
  locale: Locale = defaultLocale,
): Promise<BlogArticle[]> {
  const data = await getBlogArticlesPage(type, 1, pageSize, locale);
  return data.articleList;
}

export function getBlogArticlesPage(
  type: BlogType,
  page = 1,
  pageSize = BLOG_LIST_PAGE_SIZE,
  locale: Locale = defaultLocale,
): Promise<BlogList> {
  return fetchBlog<BlogList>(
    `/blog/${type}s?page=${page}&pageSize=${pageSize}&lang=${locale}`,
  );
}

/** 解码失败不应把 404 变成 500；非法转义本会被路由层拦掉（实测为 400） */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function getBlogArticle(
  type: BlogType,
  slug: string,
  locale: Locale = defaultLocale,
): Promise<BlogArticle | null> {
  try {
    // Next.js supplies dynamic route params in URL-encoded form. Decode first
    // so the path below is encoded exactly once for the Nest API.
    const decodedSlug = decodeSlug(slug);
    return await fetchBlog<BlogArticle>(
      `/blog/${type}s/${encodeURIComponent(decodedSlug)}?lang=${locale}`,
    );
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function formatArticleDate(value: string, locale: Locale = defaultLocale) {
  const date = new Date(value);
  const includeYear = date.getFullYear() !== new Date().getFullYear();

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    ...(includeYear ? { year: "numeric" as const } : {}),
    month: "short",
    day: "2-digit",
  }).format(date);
}

/** 列表与首页卡片共用的展示模型：压平接口字段并预格式化日期 */
export type ArticleListItem = {
  title: string;
  date: string;
  createdAt: string;
  description: string;
  slug: string;
};

export function toArticleListItem(
  article: BlogArticle,
  locale: Locale = defaultLocale,
): ArticleListItem {
  return {
    title: article.title,
    date: formatArticleDate(article.createTime, locale),
    createdAt: article.createTime,
    description: article.description,
    slug: article.slug,
  };
}

/** /api/articles 的响应契约：客户端与服务端共用这一份定义 */
export type ArticleListPage = {
  items: ArticleListItem[];
  total: number;
};
