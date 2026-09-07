export const supportedLocales = ["en-US", "pt-BR", "es-AR"] as const;

export type Locale = (typeof supportedLocales)[number];

export const fallbackLocale: Locale = "en-US";

export const localeLabels: Record<Locale, string> = {
  "en-US": "EN",
  "pt-BR": "PT",
  "es-AR": "ES",
};
