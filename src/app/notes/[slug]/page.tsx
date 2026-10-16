import Tiptap from "@/components/tiptap";
import { BackLink } from "@/components/back-link";
import { ArticleScrollReset } from "@/components/article-scroll-reset";
import { formatArticleDate, getBlogArticle } from "@/lib/blog-api";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/server-locale";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const note = await getBlogArticle("note", slug, locale);

  if (!note) notFound();

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ArticleScrollReset />
      <header>
        <div className="space-y-4">
          <time className="text-sm text-zinc-400">
            {formatArticleDate(note.createTime, locale)}
          </time>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {note.title}
          </h1>
        </div>
      </header>
      <BackLink href="/notes" />
      <Tiptap
        key={`${note.slug}-${locale}`}
        content={note.content}
        editable={false}
        showTableOfContents
      />
    </article>
  );
}
