export type Locale = "en" | "zh";

export const defaultLocale: Locale = "en";

export const LOCALE_STORAGE_KEY = "locale";

const en = {
  "nav.home": "Home",
  "nav.posts": "Posts",
  "nav.notes": "Notes",
  "theme.toggle": "Toggle theme",
  "auth.login": "Log in",
  "auth.title": "Log in to Json",
  "auth.github": "Continue with GitHub",
  "auth.google": "Continue with Google",
  "auth.setup": "Configure OAuth credentials to enable sign-in.",
  "auth.signedInAs": "Signed in as",
  "auth.logout": "Log out",
  "lang.switch": "Language",
  "footer.rightsReserved": "All rights reserved.",
  "home.titlePrefix": "Hi! I'm",
  "home.role": "A Full-Stack Engineer.",
  "home.interestedIntro": "I'm interested in",
  "home.interestedOutro": ".",
  "home.and": "and",
  "home.moreAboutMe": "More about me",
  "home.latestWriting": "Latest Writing",
  "home.viewAllPosts": "View all posts →",
  "posts.title": "All Posts",
  "posts.subtitle":
    "A complete collection of my writing on design, technology, and more.",
  "notes.title": "All Notes",
  "notes.subtitle": "Casual thoughts, daily reflections, and quick musings.",
  "list.loading": "Loading more…",
  "list.loadError": "Could not load more items.",
  "list.retry": "Retry",
  "list.end": "You've reached the end.",
  "list.empty": "Nothing here yet.",
  "article.loading": "Loading content…",
  "article.toc": "On this page",
  "editor.title": "Post Editor",
  "editor.subtitle": "Create and edit your content using the Tiptap editor.",
  "editor.save": "Save Post",
  "editor.markdownPreview": "Markdown Preview",
  "editor.saveAlert": "Markdown content has been logged to the console.",
  "info.back": "← Back",
} as const;

export type MessageKey = keyof typeof en;

const zh: Record<MessageKey, string> = {
  "nav.home": "首页",
  "nav.posts": "文章",
  "nav.notes": "随笔",
  "theme.toggle": "切换主题",
  "auth.login": "登录",
  "auth.title": "登录到 Json",
  "auth.github": "使用 GitHub 登录",
  "auth.google": "使用 Google 登录",
  "auth.setup": "请先配置 OAuth 凭据以启用登录。",
  "auth.signedInAs": "当前登录账号",
  "auth.logout": "退出登录",
  "lang.switch": "语言",
  "footer.rightsReserved": "版权所有",
  "home.titlePrefix": "Hi! I'm",
  "home.role": "一名全栈工程师。",
  "home.interestedIntro": "我对",
  "home.interestedOutro": " 很感兴趣。",
  "home.and": "以及",
  "home.moreAboutMe": "更多关于我",
  "home.latestWriting": "最新文章",
  "home.viewAllPosts": "查看全部文章 →",
  "posts.title": "全部文章",
  "posts.subtitle": "关于设计、技术等的完整文章列表。",
  "notes.title": "全部随笔",
  "notes.subtitle": "随随笔录的日常随想与灵感片段。",
  "list.loading": "正在加载更多…",
  "list.loadError": "加载失败，请重试。",
  "list.retry": "重试",
  "list.end": "已经到底了。",
  "list.empty": "暂无内容。",
  "article.loading": "正在加载内容…",
  "article.toc": "目录",
  "editor.title": "文章编辑器",
  "editor.subtitle": "使用 Tiptap 编辑器创建与编辑内容。",
  "editor.save": "保存文章",
  "editor.markdownPreview": "Markdown 预览",
  "editor.saveAlert": "Markdown 内容已输出到控制台，请打开开发者工具查看。",
  "info.back": "← 返回",
};

export function translate(locale: Locale, key: MessageKey): string {
  return locale === "zh" ? zh[key] : en[key];
}
