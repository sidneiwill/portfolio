import { ref, watch } from "vue";

export type Theme = "light" | "dark";

const storageKey = "sidnei.theme";

const readTheme = (): Theme => {
  if (typeof localStorage === "undefined") return "dark";
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

const theme = ref<Theme>(readTheme());

export const useTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  watch(
    theme,
    (nextTheme) => {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(storageKey, nextTheme);
    },
    { immediate: true },
  );

  return { theme, toggleTheme };
};
