import type { Locale } from "@/i18n/config";

const enUSMessages = {
  "nav.skip": "Skip to content",
  "controls.language": "Language",
  "controls.theme": "Theme",
  "controls.light": "Light",
  "controls.dark": "Dark",
  "layout.site": "Site",
  "downloads.aylon.group": "Aylon downloads",
  "downloads.aylon.windows": "Download Aylon for Windows",
  "downloads.aylon.macos": "Download Aylon for macOS",
  "downloads.aylon.linux": "Download Aylon for Linux",
  "downloads.aylon.macosTitle": "Aylon for macOS",
  "downloads.repository": "Open GitHub repository",
  "downloads.project": "Download project",
  "downloads.simpleRpg.comingSoon": "Download coming soon",
  "downloads.macos.noticeTitle": "macOS security notice",
  "downloads.macos.noticeBody":
    "This macOS version is not digitally signed. To run it, you may need to allow the app in macOS Privacy & Security settings and confirm that you trust the app.",
  "downloads.macos.appleGuide":
    "Apple guide: open an app from an unknown developer",
  "downloads.macos.cancel": "Cancel",
  "downloads.macos.continue": "Continue download",
} as const;

export type MessageKey = keyof typeof enUSMessages;

export const messages: Record<Locale, Record<MessageKey, string>> = {
  "en-US": enUSMessages,
  "pt-BR": {
    "nav.skip": "Ir para o conteúdo",
    "controls.language": "Idioma",
    "controls.theme": "Tema",
    "controls.light": "Claro",
    "controls.dark": "Escuro",
    "layout.site": "Site",
    "downloads.aylon.group": "Downloads do Aylon",
    "downloads.aylon.windows": "Baixar o Aylon para Windows",
    "downloads.aylon.macos": "Baixar o Aylon para macOS",
    "downloads.aylon.linux": "Baixar o Aylon para Linux",
    "downloads.aylon.macosTitle": "Aylon para macOS",
    "downloads.repository": "Abrir repositório no GitHub",
    "downloads.project": "Baixar projeto",
    "downloads.simpleRpg.comingSoon": "Download disponível em breve",
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
    "layout.site": "Sitio",
    "downloads.aylon.group": "Descargas de Aylon",
    "downloads.aylon.windows": "Descargar Aylon para Windows",
    "downloads.aylon.macos": "Descargar Aylon para macOS",
    "downloads.aylon.linux": "Descargar Aylon para Linux",
    "downloads.aylon.macosTitle": "Aylon para macOS",
    "downloads.repository": "Abrir repositorio de GitHub",
    "downloads.project": "Descargar proyecto",
    "downloads.simpleRpg.comingSoon": "Descarga disponible próximamente",
    "downloads.macos.noticeTitle": "Aviso de seguridad de macOS",
    "downloads.macos.noticeBody":
      "Esta versión para macOS no está firmada digitalmente. Para ejecutarla, puede que tengas que permitir la app en la configuración de Privacidad y Seguridad de macOS y confirmar que confías en ella.",
    "downloads.macos.appleGuide":
      "Guía de Apple: abrir una app de un desarrollador no identificado",
    "downloads.macos.cancel": "Cancelar",
    "downloads.macos.continue": "Continuar descarga",
  },
};
