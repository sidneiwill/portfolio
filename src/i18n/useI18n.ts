import { computed, ref, watch } from "vue";
import {
  fallbackLocale,
  type Locale,
  localeLabels,
  supportedLocales,
} from "@/i18n/config";
import { type MessageKey, messages } from "@/i18n/messages";
import { resumeContent } from "@/i18n/resumeContent";

const storageKey = "sidnei.locale";
const locales: Locale[] = [...supportedLocales];

const normalizeLanguage = (language: string) =>
  language.trim().replace("_", "-").toLowerCase();

const localeMatchesLanguage = (locale: Locale, language: string) =>
  normalizeLanguage(locale) === normalizeLanguage(language);

const localeMatchesBaseLanguage = (locale: Locale, language: string) =>
  normalizeLanguage(locale).split("-")[0] ===
  normalizeLanguage(language).split("-")[0];

const isLocale = (value: string | null): value is Locale =>
  locales.includes(value as Locale);

export const resolveLocale = (languages: readonly string[]): Locale => {
  for (const language of languages) {
    const exactMatch = locales.find((candidate) =>
      localeMatchesLanguage(candidate, language),
    );

    if (exactMatch) return exactMatch;

    const baseLanguageMatch = locales.find((candidate) =>
      localeMatchesBaseLanguage(candidate, language),
    );

    if (baseLanguageMatch) return baseLanguageMatch;
  }

  return fallbackLocale;
};

export const resolveInitialLocale = (
  storedLocale: string | null,
  browserLanguages: readonly string[],
): Locale =>
  isLocale(storedLocale) ? storedLocale : resolveLocale(browserLanguages);

const readBrowserLanguages = (): readonly string[] =>
  typeof navigator === "undefined"
    ? [fallbackLocale]
    : navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

const readStoredLocale = (): Locale => {
  if (typeof localStorage === "undefined")
    return resolveLocale(readBrowserLanguages());
  return resolveInitialLocale(
    localStorage.getItem(storageKey),
    readBrowserLanguages(),
  );
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
    t: (key: MessageKey) => messages[locale.value][key],
  };
};
