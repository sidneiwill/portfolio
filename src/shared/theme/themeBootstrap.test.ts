import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const script =
  html.match(/<script id="theme-bootstrap">([\s\S]*?)<\/script>/)?.[1] ?? "";

const run = () => new Function(script)();
const preferLight = (matches: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches })),
  );

describe("theme bootstrap script", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    preferLight(false);
  });

  it("applies the stored theme", () => {
    localStorage.setItem("sidnei.theme", "light");
    run();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("follows the system preference when nothing valid is stored", () => {
    localStorage.setItem("sidnei.theme", "sepia");
    preferLight(true);
    run();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("does not throw when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(run).not.toThrow();
    vi.restoreAllMocks();
  });
});
