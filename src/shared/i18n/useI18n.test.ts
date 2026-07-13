import { describe, expect, it } from "vitest";
import { resumeContent } from "@/features/resume/data/resumeContent";
import { resolveInitialLocale, resolveLocale } from "@/shared/i18n/useI18n";

describe("resumeContent", () => {
  it("ships three complete locales", () => {
    expect(Object.keys(resumeContent).sort()).toEqual([
      "en-US",
      "es-AR",
      "pt-BR",
    ]);
    expect(resumeContent["en-US"].projects).toHaveLength(2);
    expect(resumeContent["pt-BR"].skillGroups).toHaveLength(6);
    expect(resumeContent["es-AR"].experience).toHaveLength(2);
  });

  it("keeps core identity consistent across locales", () => {
    const names = Object.values(resumeContent).map(
      (content) => content.meta.name,
    );
    expect(new Set(names).size).toBe(1);
  });

  it("resolves the default locale from exact browser language", () => {
    expect(resolveLocale(["pt-BR", "en-US"])).toBe("pt-BR");
  });

  it("resolves the default locale from base browser language", () => {
    expect(resolveLocale(["pt-PT", "en-US"])).toBe("pt-BR");
  });

  it("falls back to English for unsupported browser languages", () => {
    expect(resolveLocale(["fr-FR"])).toBe("pt-BR");
  });

  it("keeps a valid stored locale over browser language", () => {
    expect(resolveInitialLocale("en-US", ["pt-BR"])).toBe("en-US");
  });

  it("ignores an invalid stored locale and uses browser language", () => {
    expect(resolveInitialLocale("fr-FR", ["pt-BR"])).toBe("pt-BR");
  });
});
