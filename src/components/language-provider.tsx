"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  type Locale,
  LOCALE_STORAGE_KEY,
  translate,
  type MessageKey,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = React.createContext<LanguageContextValue | undefined>(
  undefined
);

const localeListeners = new Set<() => void>();

function getStoredLocale(fallback: Locale): Locale {
  if (typeof document === "undefined") return fallback;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${LOCALE_STORAGE_KEY}=`))
    ?.split("=")[1];
  if (cookie === "zh" || cookie === "en") return cookie;

  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    // Use the server locale when storage is unavailable.
  }

  return fallback;
}

function subscribeToLocale(listener: () => void) {
  localeListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyLocaleListeners() {
  localeListeners.forEach((listener) => listener());
}

function applyDocumentLang(locale: Locale) {
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
}

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // The cookie still allows server-rendered content to follow this choice.
  }
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const locale = React.useSyncExternalStore(
    subscribeToLocale,
    () => getStoredLocale(initialLocale),
    () => initialLocale,
  );

  React.useEffect(() => {
    // Migrate the old localStorage-only preference once. Cookies are the source
    // of truth afterwards so the server and browser agree on the first render.
    const next = getStoredLocale(initialLocale);
    persistLocale(next);
    applyDocumentLang(next);
    if (next !== initialLocale) router.refresh();
  }, [initialLocale, router]);

  const setLocale = React.useCallback((next: Locale) => {
    persistLocale(next);
    applyDocumentLang(next);
    notifyLocaleListeners();
    router.refresh();
  }, [router]);

  const t = React.useCallback(
    (key: MessageKey) => translate(locale, key),
    [locale]
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
