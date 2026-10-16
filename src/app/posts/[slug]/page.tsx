import Tiptap from "@/components/tiptap";
import { BackLink } from "@/components/back-link";
import { ArticleScrollReset } from "@/components/article-scroll-reset";
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
      <header>
        <div className="space-y-4">
          <time className="text-sm text-zinc-400">
            {formatArticleDate(post.createTime, locale)}
          </time>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </header>
      <BackLink href="/posts" />
      <Tiptap
        key={`${post.slug}-${locale}`}
        content={post.content}
        editable={false}
        showTableOfContents
      />
    </article>
  );
}
