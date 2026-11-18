import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/shared/theme/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    document.head.innerHTML =
      '<link id="favicon" rel="icon" href="/favicon-dark.svg" />';
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
  });

  it("toggles and persists theme", async () => {
    const theme = useTheme();
    expect(theme.theme.value).toBe("dark");

    theme.toggleTheme();
    await Promise.resolve();

    expect(theme.theme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("sidnei.theme")).toBe("light");
    expect(document.getElementById("favicon")?.getAttribute("href")).toBe(
      "/favicon-light.svg",
    );
  });
});
