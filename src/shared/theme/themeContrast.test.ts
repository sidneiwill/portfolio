import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles/main.css"), "utf8");

const tokensIn = (selector: string) => {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(
      ([, name, value]) => [name, value],
    ),
  ) as Record<string, string>;
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

const dark = tokensIn(":root");
const themes = {
  dark,
  light: { ...dark, ...tokensIn(':root[data-theme="light"]') },
};

describe.each(Object.entries(themes))("%s theme tokens", (_, tokens) => {
  it.each(["text", "muted", "accent", "accent-2"])(
    "keeps --%s readable on --bg (WCAG AA 4.5:1)",
    (name) => {
      expect(contrast(tokens[name], tokens.bg)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("keeps --bg readable on --accent for the skip link", () => {
    expect(contrast(tokens.bg, tokens.accent)).toBeGreaterThanOrEqual(4.5);
  });
});
