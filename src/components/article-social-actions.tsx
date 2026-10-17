"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Heart, MessageCircle, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/language-provider";
import type { MessageKey } from "@/lib/i18n";

type MockReply = {
  author: string;
  timeKey: MessageKey;
  textKey: MessageKey;
};

type UserReply = {
  author: "You";
  timeKey: "article.justNow";
  text: string;
};

const mockComments = [
  {
    author: "Mina",
    initials: "M",
    timeKey: "article.commentTimeFirst",
    textKey: "article.commentFirst",
  },
  {
    author: "Alex",
    initials: "A",
    timeKey: "article.commentTimeSecond",
    textKey: "article.commentSecond",
  },
  {
    author: "Evan",
    initials: "E",
    timeKey: "article.commentTimeThird",
    textKey: "article.commentThird",
  },
] as const;

const mockReplies: Record<string, MockReply[]> = {
  Mina: [
    {
      author: "Alex",
      timeKey: "article.commentTimeFirst",
      textKey: "article.mockReplyFirst",
    },
    {
      author: "Mina",
      timeKey: "article.commentTimeFirst",
      textKey: "article.mockReplySecond",
    },
    {
      author: "Evan",
      timeKey: "article.commentTimeSecond",
      textKey: "article.mockReplyThird",
    },
  ],
  Alex: [
    {
      author: "Evan",
      timeKey: "article.commentTimeSecond",
      textKey: "article.mockReplyFourth",
    },
    {
      author: "Mina",
      timeKey: "article.commentTimeSecond",
      textKey: "article.mockReplyFifth",
    },
  ],
};

export function ArticleSocialActions() {
  const { t } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replies, setReplies] = useState<Record<string, UserReply[]>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>(
    {},
  );
  const likeCount = liked ? 25 : 24;
  const commentCount =
    mockComments.length +
    Object.values(mockReplies).reduce(
      (total, commentReplies) => total + commentReplies.length,
      0,
    ) +
    Object.values(replies).reduce(
      (total, commentReplies) => total + commentReplies.length,
      0,
    );

  function submitReply(event: FormEvent<HTMLFormElement>, commentAuthor: string) {
    event.preventDefault();
    const text = replyDraft.trim();
    if (!text) return;

    setReplies((current) => ({
      ...current,
      [commentAuthor]: [
        ...(current[commentAuthor] ?? []),
        { author: "You", timeKey: "article.justNow", text },
      ],
    }));
    setExpandedReplies((current) => ({ ...current, [commentAuthor]: true }));
    setReplyDraft("");
    setReplyingTo(null);
  }

  return (
    <Dialog.Root>
      <div
        className="fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
        style={{ left: "max(1rem, calc((100vw - 48rem) / 2 - 4rem))" }}
      >
        <button
          type="button"
          aria-label={`${liked ? t("article.unlike") : t("article.like")} (${likeCount})`}
          aria-pressed={liked}
          title={liked ? t("article.unlike") : t("article.like")}
          onClick={() => setLiked((current) => !current)}
          className="flex size-12 flex-col items-center justify-center gap-0.5 rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart
            aria-hidden="true"
            className={`size-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
          />
          <span className="text-[10px] leading-none">{likeCount}</span>
        </button>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`${t("article.comments")} (${commentCount})`}
            title={t("article.comments")}
            className="flex size-12 flex-col items-center justify-center gap-0.5 rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            <span className="text-[10px] leading-none">{commentCount}</span>
          </button>
        </Dialog.Trigger>
      </div>

      <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/90 p-1 shadow-lg backdrop-blur xl:hidden">
        <button
          type="button"
          aria-label={`${liked ? t("article.unlike") : t("article.like")} (${likeCount})`}
          aria-pressed={liked}
          onClick={() => setLiked((current) => !current)}
          className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart
            aria-hidden="true"
            className={`size-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
          />
          <span>{likeCount}</span>
        </button>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`${t("article.comments")} (${commentCount})`}
            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            <span>{commentCount}</span>
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-100 flex w-[min(24rem,calc(100vw-2rem))] flex-col border-r border-border bg-background text-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5">
            <div>
              <Dialog.Title className="text-lg font-semibold">
                {t("article.comments")}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {commentCount}
                </span>
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {t("article.mockComments")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("article.closeComments")}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </Dialog.Close>
          </header>

          <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {mockComments.map((comment) => {
              const commentReplies = [
                ...(mockReplies[comment.author] ?? []),
                ...(replies[comment.author] ?? []),
              ];
              const isExpanded = expandedReplies[comment.author] ?? false;
              const visibleReplies = isExpanded
                ? commentReplies
                : commentReplies.slice(0, 1);

              return (
                <li key={comment.author} className="flex gap-3">
                  <div
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                  >
                    {comment.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {t(comment.timeKey)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {t(comment.textKey)}
                    </p>

                    <div className="mt-2">
                      <button
                        type="button"
                        aria-expanded={replyingTo === comment.author}
                        onClick={() => {
                          setReplyingTo((current) =>
                            current === comment.author ? null : comment.author,
                          );
                          setReplyDraft("");
                        }}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {t("article.reply")}
                      </button>

                      {visibleReplies.map((reply, index) => (
                        <div
                          key={`${comment.author}-${index}`}
                          className="mt-3 border-l-2 border-border pl-3"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium">
                              {reply.author === "You"
                                ? t("article.you")
                                : reply.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {t(reply.timeKey)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {"textKey" in reply ? t(reply.textKey) : reply.text}
                          </p>
                        </div>
                      ))}

                      {commentReplies.length > 1 && (
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedReplies((current) => ({
                              ...current,
                              [comment.author]: !isExpanded,
                            }))
                          }
                          className="mt-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {isExpanded
                            ? t("article.collapseReplies")
                          : t("article.expandReplies")}
                        </button>
                      )}

                      {replyingTo === comment.author && (
                        <form
                          onSubmit={(event) => submitReply(event, comment.author)}
                          className="mt-3 flex items-center gap-2"
                        >
                          <input
                            autoFocus
                            value={replyDraft}
                            onChange={(event) => setReplyDraft(event.target.value)}
                            placeholder={t("article.replyPlaceholder")}
                            aria-label={`${t("article.reply")} ${comment.author}`}
                            className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          />
                          <button
                            type="submit"
                            disabled={!replyDraft.trim()}
                            className="h-9 shrink-0 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {t("article.submitReply")}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
