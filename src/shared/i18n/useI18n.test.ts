import { describe, expect, it } from "vitest";
import { resumeContent } from "@/features/resume/data/resumeContent";

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
});
