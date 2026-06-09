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
    "downloads.macos.noticeTitle": "macOS security notice",
    "downloads.macos.noticeBody":
      "This macOS version is not digitally signed. To run it, you may need to allow the app in macOS Privacy & Security settings and confirm that you trust the app.",
    "downloads.macos.appleGuide":
      "Apple guide: open an app from an unknown developer",
    "downloads.macos.cancel": "Cancel",
    "downloads.macos.continue": "Continue download",
  },
  "pt-BR": {
    "nav.skip": "Ir para o conteúdo",
    "controls.language": "Idioma",
    "controls.theme": "Tema",
    "controls.light": "Claro",
    "controls.dark": "Escuro",
    "downloads.macos.noticeTitle": "Aviso de segurança do macOS",
    "downloads.macos.noticeBody":
      "Esta versão para macOS não é assinada digitalmente. Para executá-la, talvez seja necessário permitir o app nos ajustes de Privacidade e Segurança do macOS e confirmar que você confia no app.",
    "downloads.macos.appleGuide":
      "Guia da Apple: abrir um app de desenvolvedor não identificado",
    "downloads.macos.cancel": "Cancelar",
    "downloads.macos.continue": "Continuar download",
  },
  "es-AR": {
    "nav.skip": "Ir al contenido",
    "controls.language": "Idioma",
    "controls.theme": "Tema",
    "controls.light": "Claro",
    "controls.dark": "Oscuro",
    "downloads.macos.noticeTitle": "Aviso de seguridad de macOS",
    "downloads.macos.noticeBody":
      "Esta versión para macOS no está firmada digitalmente. Para ejecutarla, puede que tengas que permitir la app en la configuración de Privacidad y Seguridad de macOS y confirmar que confías en ella.",
    "downloads.macos.appleGuide":
      "Guía de Apple: abrir una app de un desarrollador no identificado",
    "downloads.macos.cancel": "Cancelar",
    "downloads.macos.continue": "Continuar descarga",
  },
};
