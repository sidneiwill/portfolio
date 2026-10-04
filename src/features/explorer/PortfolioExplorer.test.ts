import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type App, createApp, defineComponent, h, nextTick } from "vue";
import PortfolioApp from "@/App.vue";
import type { Locale } from "@/i18n/config";
import { resumeContent } from "@/i18n/resumeContent";
import { useI18n } from "@/i18n/useI18n";
import { areaIds, explorerContent, type SectionId } from "./content";
import PortfolioExplorer from "./PortfolioExplorer.vue";

vi.mock("./CubeScene.vue", async () => {
  const { defineComponent, h } = await import("vue");
  return {
    __esModule: true,
    default: defineComponent({
      props: [
        "section",
        "selected",
        "paused",
        "reset",
        "reducedMotion",
        "interactive",
      ],
      emits: ["select", "failed", "open"],
      setup(props, { emit }) {
        return () =>
          h(
            "div",
            {
              "data-scene": "",
              "data-section": props.section,
              "data-selected": props.selected ?? "",
              "data-paused": String(props.paused),
              "data-reset": String(props.reset),
              "data-reduced-motion": String(props.reducedMotion),
            },
            [
              h(
                "button",
                { "data-select": "", onClick: () => emit("select", "stack-0") },
                "Select scene part",
              ),
              h(
                "button",
                { "data-open": "", onClick: () => emit("open") },
                "Open cube",
              ),
              h(
                "button",
                { "data-fail": "", onClick: () => emit("failed") },
                "Fail scene",
              ),
            ],
          );
      },
    }),
  };
});

describe("PortfolioExplorer", () => {
  let app: App;
  let container: HTMLDivElement;
  let setLocale: (locale: Locale) => void;
  let motion: { matches: boolean };
  let motionChange: () => void;

  beforeEach(async () => {
    window.history.replaceState(null, "", window.location.pathname);
    motion = { matches: false };
    vi.stubGlobal("matchMedia", () => ({
      get matches() {
        return motion.matches;
      },
      addEventListener: (_event: string, callback: () => void) => {
        motionChange = callback;
      },
      removeEventListener: vi.fn(),
    }));
    container = document.createElement("div");
    document.body.append(container);
    app = createApp(
      defineComponent({
        setup() {
          const i18n = useI18n();
          setLocale = i18n.setLocale;
          setLocale("en-US");
          return () => h(PortfolioExplorer, { theme: "dark" });
        },
      }),
    );
    app.mount(container);
    await vi.waitFor(() =>
      expect(container.querySelector("[data-scene]")).not.toBeNull(),
    );
  });

  afterEach(() => {
    app.unmount();
    container.remove();
    window.history.replaceState(null, "", window.location.pathname);
    vi.unstubAllGlobals();
  });

  function element(selector: string): HTMLElement {
    const result = container.querySelector<HTMLElement>(selector);
    if (!result) throw new Error(`Missing element: ${selector}`);
    return result;
  }

  async function click(selector: string) {
    const target = element(selector);
    target.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    target.click();
    await nextTick();
  }

  const navigate = async (section: SectionId) => {
    if (!container.querySelector(".explorer-nav")) {
      await click(
        container.querySelector(".cube-fallback")
          ? ".cube-fallback"
          : "[data-open]",
      );
    }
    await click(`.explorer-nav a[href="#${section}"]`);
  };

  it("honors initial URLs, hash navigation, and live reduced-motion preferences", async () => {
    app.unmount();
    window.history.replaceState(null, "", "#electronics");
    app = createApp(PortfolioExplorer, { theme: "dark" });
    app.mount(container);
    await vi.waitFor(() =>
      expect(container.querySelector("[data-scene]")).not.toBeNull(),
    );
    expect(element("[data-scene]").dataset.section).toBe("electronics");
    window.history.replaceState(null, "", "#reverse");
    window.dispatchEvent(new Event("hashchange"));
    await nextTick();
    expect(element("[data-scene]").dataset.section).toBe("reverse");
    window.history.replaceState(null, "", "#unknown");
    window.dispatchEvent(new Event("hashchange"));
    await nextTick();
    expect(element("[data-scene]").dataset.section).toBe("reverse");
    motion.matches = true;
    motionChange();
    await nextTick();
    expect(element("[data-scene]").dataset.reducedMotion).toBe("true");
    window.history.replaceState(null, "", "#main");
    window.dispatchEvent(new Event("hashchange"));
    await nextTick();
    expect(element("[data-scene]").dataset.section).toBe("home");
  });

  it("hides the page header on startup and reveals it when the cube opens", async () => {
    app.unmount();
    app = createApp(PortfolioApp);
    app.mount(container);
    await vi.waitFor(() =>
      expect(container.querySelector("[data-open]")).not.toBeNull(),
    );
    expect(container.querySelector(".site-header")).toBeNull();
    await click("[data-open]");
    expect(container.querySelector(".site-header")).not.toBeNull();
    await navigate("programming");
    await navigate("home");
    expect(container.querySelector(".site-header")).not.toBeNull();
  });

  it("keeps the side menu hidden until the cube is clicked", async () => {
    expect(container.querySelector(".explorer-nav")).toBeNull();
    await click("[data-open]");
    expect(container.querySelector(".explorer-nav")).not.toBeNull();
    expect(element("[data-scene]").dataset.section).toBe("home");
  });

  it("opens each area and exposes every scene detail through HTML buttons", async () => {
    for (const area of areaIds) {
      await navigate(area);
      const content = explorerContent["en-US"].areas[area];
      expect(element("#explorer-panel").getAttribute("aria-label")).toBe(
        explorerContent["en-US"].navigation[area],
      );
      expect(element(".area-summary").textContent).toBe(content.summary);
      expect(element("[data-scene]").dataset.section).toBe(area);
      if (area === "programming") {
        const buttons =
          container.querySelectorAll<HTMLButtonElement>(".stack-topic");
        expect(buttons).toHaveLength(7);
        for (const [index, button] of buttons.entries()) {
          button.click();
          await nextTick();
          expect(element("[data-scene]").dataset.selected).toBe(
            `stack-${index}`,
          );
          expect(button.getAttribute("aria-pressed")).toBe("true");
        }
        continue;
      }
      for (const [index, part] of content.parts.entries()) {
        await click(`.part-buttons button:nth-child(${index + 1})`);
        expect(element(".part-detail h3").textContent).toBe(part.label);
        expect(element(".part-detail p").textContent).toBe(part.description);
        expect(element("[data-scene]").dataset.selected).toBe(part.id);
        expect(
          element(`.part-buttons button:nth-child(${index + 1})`).getAttribute(
            "aria-pressed",
          ),
        ).toBe("true");
      }
    }
  });

  it("receives scene selections, applies the latest rapid navigation, and clears details on home", async () => {
    await navigate("programming");
    await click("[data-select]");
    expect(element(".stack-topic").getAttribute("aria-pressed")).toBe("true");
    for (const section of ["reverse", "electronics", "modeling"] as const) {
      const target = element(`.explorer-nav a[href="#${section}"]`);
      target.addEventListener("click", (event) => event.preventDefault(), {
        once: true,
      });
      target.click();
    }
    await nextTick();
    expect(element("[data-scene]").dataset.section).toBe("modeling");
    expect(element(".part-detail").textContent).toBe("");
    await navigate("home");
    expect(container.querySelector("#explorer-panel")).toBeNull();
    expect(element("[data-scene]").dataset.section).toBe("home");
    expect(element("[data-scene]").dataset.selected).toBe("");
    expect(
      element('.explorer-nav a[href="#home"]').getAttribute("aria-current"),
    ).toBe("page");
  });

  it("updates navigation and selected detail when the locale changes", async () => {
    await navigate("modeling");
    await click(".part-buttons button:nth-child(2)");
    for (const locale of ["pt-BR", "es-AR", "en-US"] as const) {
      setLocale(locale);
      await nextTick();
      const text = explorerContent[locale];
      expect(element("#explorer-panel h1").textContent).toBe(
        text.navigation.modeling,
      );
      expect(element(".part-detail p").textContent).toBe(
        text.areas.modeling.parts[1]?.description,
      );
      expect(element("#explorer-panel").getAttribute("aria-label")).toBe(
        text.navigation.modeling,
      );
    }
  });

  it("keeps content and navigation available after the renderer fails", async () => {
    await navigate("electronics");
    await click("[data-fail]");
    expect(element(".cube-fallback").getAttribute("aria-label")).toBe(
      explorerContent["en-US"].openCube,
    );
    expect(container.querySelector("[data-scene]")).toBeNull();
    await click(".part-buttons button:first-child");
    expect(element(".part-detail p").textContent).toBe(
      explorerContent["en-US"].areas.electronics.parts[0]?.description,
    );
    await navigate("contact");
    expect(element("#explorer-panel").getAttribute("aria-label")).toBe(
      "Contact",
    );
    expect(element('#explorer-panel a[href^="mailto:"]')).toBeTruthy();
  });

  it("identifies programming models on keyboard focus and selection", async () => {
    await navigate("programming");
    const topic = element(".stack-topic");
    topic.focus();
    await nextTick();
    expect(element(".model-label").textContent).toBe(
      resumeContent["en-US"].skillGroups[0]?.title,
    );
    topic.blur();
    await nextTick();
    expect(container.querySelector(".model-label")).toBeNull();
    await click(".stack-topic");
    expect(element(".model-label").textContent).toBe(
      resumeContent["en-US"].skillGroups[0]?.title,
    );
    await navigate("electronics");
    expect(container.querySelector(".model-label")).toBeNull();
  });

  it("shows no motion controls and keeps scene motion enabled", () => {
    expect(container.querySelector(".scene-controls")).toBeNull();
    expect(element("[data-scene]").dataset.paused).toBe("false");
    expect(element("[data-scene]").dataset.reset).toBe("0");
  });

  it("preserves project repository and download actions", async () => {
    await navigate("projects");
    for (const project of resumeContent["en-US"].projects) {
      for (const url of [project.repositoryUrl, project.downloadUrl].filter(
        Boolean,
      )) {
        const links = Array.from(
          container.querySelectorAll<HTMLAnchorElement>("#explorer-panel a"),
        );
        expect(links.some((link) => link.getAttribute("href") === url)).toBe(
          true,
        );
      }
    }
    expect(
      element('a[aria-label="Download Aylon for Windows"]').getAttribute(
        "href",
      ),
    ).toContain("drive.google.com");
    expect(
      element('a[aria-label="Download Aylon for Linux"]').getAttribute("href"),
    ).toContain("drive.google.com");
    await click('button[aria-label="Download Aylon for macOS"]');
    const download = document.querySelector<HTMLAnchorElement>(
      ".macos-warning .modal-actions a",
    );
    expect(download?.href).toContain("drive.google.com");
  });
});
