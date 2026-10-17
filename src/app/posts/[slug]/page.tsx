import Tiptap from "@/components/tiptap";
import { ArticleScrollReset } from "@/components/article-scroll-reset";
import { ArticleDate } from "@/components/article-date";
import { ArticleSocialActions } from "@/components/article-social-actions";
import { formatArticleDate, getBlogArticle } from "@/lib/blog-api";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/server-locale";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getBlogArticle("post", slug, locale);

  if (!post) notFound();

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ArticleScrollReset />
      <ArticleSocialActions />
      <header className="mb-0 xl:mb-12">
        <div className="space-y-4">
          <ArticleDate
            dateTime={post.createTime}
            fallback={formatArticleDate(post.createTime, locale)}
            className="text-sm text-zinc-400"
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </header>
      <Tiptap
        key={`${post.slug}-${locale}`}
        content={post.content}
        editable={false}
        showTableOfContents
        backHref="/posts"
      />
    </article>
  );
}
