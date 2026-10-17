"use client";

import * as React from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => Promise<void>;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const transitioning = React.useRef(false);

  const toggleTheme = async (origin?: { x: number; y: number }) => {
    if (transitioning.current) return;

    const root = document.documentElement;
    const isDark = !root.classList.contains("dark");
    const newTheme = isDark ? "dark" : "light";
    const applyTheme = () => {
      root.classList.toggle("dark", isDark);
      // Notify React after the DOM has the new class so both update together.
      flushSync(notifyThemeChange);
      try {
        localStorage.setItem("theme", newTheme);
      } catch {
        // Theme switching still works if browser storage is unavailable.
      }
    };

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${radius}px at ${x}px ${y}px)`,
    ];

    transitioning.current = true;
    root.classList.add("theme-transition");
    let transition: ViewTransition | undefined;
    let animation: Animation | undefined;
    try {
      transition = document.startViewTransition(applyTheme);
      await transition.ready;
      animation = root.animate(
        { clipPath: isDark ? [...clipPath].reverse() : clipPath },
        {
          duration: 600,
          easing: "linear",
          // Keep the old light snapshot clipped until its layer is removed.
          fill: "forwards",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        },
      );
      await animation.finished;
    } catch {
      // A skipped/interrupted transition must not prevent the theme update.
      transition?.skipTransition();
      applyTheme();
    } finally {
      await transition?.finished.catch(() => {});
      animation?.cancel();
      root.classList.remove("theme-transition");
      transitioning.current = false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
