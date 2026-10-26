import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "./Icons";
import { cn } from "@/utils/cn";

type Theme = "light" | "dark";

const STORAGE_KEY = "quill-ui-theme";
const listeners = new Set<() => void>();

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initialTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = theme === "dark" ? "#0F1620" : "#EAF6FF";
  });
}

let currentTheme: Theme = initialTheme();
applyTheme(currentTheme);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setTheme(theme: Theme, persist: boolean) {
  currentTheme = theme;
  applyTheme(theme);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still applies for this session.
    }
  }
  listeners.forEach((listener) => listener());
}

/**
 * Light/dark switch. The initial class is applied by an inline script in
 * index.html; this store keeps every toggle on the page in sync.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, () => currentTheme, () => "light" as Theme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      if (!storedTheme()) setTheme(event.matches ? "dark" : "light", false);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setTheme(event.newValue === "dark" ? "dark" : "light", false);
      }
    };
    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} theme`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next, true)}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink/80 transition-colors hover:bg-mist hover:text-link",
        className,
      )}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
