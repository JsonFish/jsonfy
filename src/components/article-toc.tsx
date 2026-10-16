"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { BackLink } from "@/components/back-link";
import { getArticleHeadings } from "@/components/tiptap/heading-anchors";
import { cn } from "@/lib/utils";

export function ArticleToc({
  editor,
  backHref,
}: {
  editor: Editor;
  backHref?: string;
}) {
  const { t } = useLanguage();
  const headings = useEditorState({
    editor,
    selector: ({ editor }) => getArticleHeadings(editor.state.doc),
  });
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (!headings.length) return;
    let frame = 0;

    const updateActiveHeading = () => {
      let current = headings[0].id;
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 128) current = id;
      });
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveHeading);
    };
    const scrollToHash = () => {
      const heading = headings.find(
        ({ id }) => `#${encodeURIComponent(id)}` === window.location.hash,
      );
      if (heading) {
        document.getElementById(heading.id)?.scrollIntoView({ block: "start" });
      }
      onScroll();
    };

    // The editor mounts on the client, after the browser's initial anchor lookup.
    frame = requestAnimationFrame(scrollToHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [editor, headings]);

  if (!headings.length) {
    if (!backHref) return null;
    return (
      <>
        <div className="xl:hidden">
          <BackLink href={backHref} />
        </div>
        <aside className="absolute top-0 left-full ml-6 hidden h-full w-60 xl:block">
          <div className="sticky top-28 flex max-h-[calc(100dvh-9rem)] flex-col">
            <BackLink
              href={backHref}
              className="my-8 xl:mt-0 xl:mb-6"
            />
          </div>
        </aside>
      </>
    );
  }
  const minLevel = Math.min(...headings.map(({ level }) => level));

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const hash = `#${encodeURIComponent(id)}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const links = (
    <nav aria-label={t("article.toc")}>
      <ol className="space-y-1 border-l border-border">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${encodeURIComponent(id)}`}
              onClick={(event) => navigate(event, id)}
              aria-current={activeId === id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 border-transparent py-1.5 pr-2 text-sm leading-5 break-words transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring",
                activeId === id
                  ? "border-foreground font-medium text-foreground"
                  : "text-muted-foreground",
              )}
              style={{ paddingLeft: `${12 + (level - minLevel) * 12}px` }}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <>
      <div className="xl:hidden">
        {backHref && <BackLink href={backHref} />}
        <details className="group mb-8 rounded-xl border border-border px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
            {t("article.toc")}
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 max-h-72 overflow-y-auto">{links}</div>
        </details>
      </div>
      <aside className="absolute top-0 left-full ml-6 hidden h-full w-60 xl:block">
        <div className="sticky top-28 flex max-h-[calc(100dvh-9rem)] flex-col">
          {backHref && (
            <BackLink
              href={backHref}
              className="my-8 xl:mt-0 xl:mb-6"
            />
          )}
          <p className="mb-4 shrink-0 text-sm font-semibold">{t("article.toc")}</p>
          <div className="min-h-0 flex-1 overflow-y-auto">{links}</div>
        </div>
      </aside>
    </>
  );
}
