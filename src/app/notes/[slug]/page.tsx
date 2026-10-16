import Tiptap from "@/components/tiptap";
import { ArticleScrollReset } from "@/components/article-scroll-reset";
import { ArticleDate } from "@/components/article-date";
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
      <header className="mb-0 xl:mb-12">
        <div className="space-y-4">
          <ArticleDate
            dateTime={note.createTime}
            fallback={formatArticleDate(note.createTime, locale)}
            className="text-sm text-zinc-400"
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {note.title}
          </h1>
        </div>
      </header>
      <Tiptap
        key={`${note.slug}-${locale}`}
        content={note.content}
        editable={false}
        showTableOfContents
        backHref="/notes"
      />
    </article>
  );
}
