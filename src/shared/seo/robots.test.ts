import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(resolve(process.cwd(), "public", file), "utf8");

describe("robots.txt", () => {
  const lines = read("robots.txt")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  it("uses only RFC 9309 directives plus Sitemap", () => {
    for (const line of lines)
      expect(line).toMatch(/^(User-agent|Allow|Disallow|Sitemap):\s*\S+$/);
  });

  it("allows search and blocks AI training crawlers", () => {
    const text = lines.join("\n");
    expect(text).toContain("User-agent: *\nAllow: /");
    for (const bot of ["GPTBot", "CCBot", "ClaudeBot", "Google-Extended"])
      expect(text).toContain(`User-agent: ${bot}\nDisallow: /`);
  });

  it("points to a sitemap listing the canonical URL", () => {
    expect(lines).toContain("Sitemap: https://www.sidneiwill.dev/sitemap.xml");
    expect(read("sitemap.xml")).toContain(
      "<loc>https://www.sidneiwill.dev/</loc>",
    );
  });
});
