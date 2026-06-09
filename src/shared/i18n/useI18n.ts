import { computed, ref, watch } from "vue";
import {
  localeLabels,
  resumeContent,
} from "@/features/resume/data/resumeContent";
import type { Locale } from "@/features/resume/types";

const storageKey = "sidnei.locale";
const fallbackLocale: Locale = "en-US";
const locales = Object.keys(resumeContent) as Locale[];

const readStoredLocale = (): Locale => {
  if (typeof localStorage === "undefined") return fallbackLocale;
  const stored = localStorage.getItem(storageKey);
  return locales.includes(stored as Locale)
    ? (stored as Locale)
    : fallbackLocale;
};

const locale = ref<Locale>(readStoredLocale());

export const useI18n = () => {
  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale;
  };

  watch(
    locale,
    (nextLocale) => {
      document.documentElement.lang = nextLocale;
      localStorage.setItem(storageKey, nextLocale);
    },
    { immediate: true },
  );

  return {
    locale,
    locales,
    localeLabels,
    resume: computed(() => resumeContent[locale.value]),
    setLocale,
    t: (key: string) => dictionary[locale.value][key] ?? key,
  };
};

const dictionary: Record<Locale, Record<string, string>> = {
  "en-US": {
    "nav.skip": "Skip to content",
    "controls.language": "Language",
    "controls.theme": "Theme",
    "controls.light": "Light",
    "controls.dark": "Dark",
  },
  "pt-BR": {
    "nav.skip": "Ir para o conteúdo",
    "controls.language": "Idioma",
    "controls.theme": "Tema",
    "controls.light": "Claro",
    "controls.dark": "Escuro",
  },
  "es-AR": {
    "nav.skip": "Ir al contenido",
    "controls.language": "Idioma",
    "controls.theme": "Tema",
    "controls.light": "Claro",
    "controls.dark": "Oscuro",
  },
};
