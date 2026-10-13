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
                {
                  "data-select-contact": "",
                  onClick: () => emit("select", "contact-email"),
                },
                "Select email",
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
  let observerCallback: IntersectionObserverCallback;
  let observerOptions: IntersectionObserverInit | undefined;
  let observed: Element[];
  const scrollIntoView = vi.fn();
  const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

  beforeEach(async () => {
    observed = [];
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    scrollIntoView.mockClear();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(
          callback: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          observerCallback = callback;
          observerOptions = options;
        }
        observe(target: Element) {
          observed.push(target);
        }
        disconnect() {}
        unobserve() {}
      },
    );
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
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    vi.useRealTimers();
    vi.restoreAllMocks();
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
    if (section === "home") {
      window.history.pushState(null, "", "#home");
      window.dispatchEvent(new Event("hashchange"));
      await nextTick();
      return;
    }
    if (!container.querySelector(".explorer-nav")) {
      await click(
        container.querySelector(".cube-fallback")
          ? ".cube-fallback"
          : "[data-open]",
      );
    }
    await click(`.explorer-nav a[href="#${section}"]`);
  };

  it("keeps all sections in continuous document order with unique IDs after opening", async () => {
    expect(container.querySelector(".explorer-content")).toBeNull();
    await click("[data-open]");
    expect(
      Array.from(
        container.querySelectorAll(".explorer-content [data-section]"),
      ).map((node) => (node as HTMLElement).dataset.section),
    ).toEqual([
      "about",
      "programming",
      "reverse",
      "modeling",
      "electronics",
      "projects",
      "contact",
    ]);
    const ids = Array.from(container.querySelectorAll("[id]")).map(
      (node) => node.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(observed).toHaveLength(7);
    expect(observerOptions?.rootMargin).toBe(
      `-${Math.round(window.innerHeight * 0.45 + 32)}px 0px -${Math.round(window.innerHeight * 0.45 - 32)}px 0px`,
    );
    for (const item of container.querySelectorAll<HTMLElement>(
      ".explorer-content [data-section]",
    ))
      expect(item.style.display).not.toBe("none");
    expect(element(".explorer-content").hasAttribute("tabindex")).toBe(false);
  });

  function wheel(
    deltaY: number,
    target: EventTarget = window,
    options: WheelEventInit = {},
  ) {
    const event = new WheelEvent("wheel", {
      deltaY,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    target.dispatchEvent(event);
    return event;
  }

  function documentGeometry(top: number, height = 1000, previousTail = 40) {
    let position = 0;
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(
        ".explorer-content [data-section]",
      ),
    );
    for (const [index, item] of items.entries()) {
      vi.spyOn(item, "getBoundingClientRect").mockImplementation(
        () =>
          new DOMRect(
            0,
            (index === 1 ? top : 4000 + index * 2000) - position,
            600,
            index === 1 ? height : 800,
          ),
      );
    }
    const tail = document.createElement("div");
    tail.textContent = "Previous section content";
    element('.explorer-content [data-section="about"]').append(tail);
    vi.spyOn(tail, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, previousTail - position - 20, 600, 20),
    );
    const scroll = vi
      .spyOn(window, "scrollBy")
      .mockImplementation((options: ScrollToOptions | number) => {
        if (typeof options === "object") position += options.top ?? 0;
      });
    const snap = vi.spyOn(items[1], "scrollIntoView").mockImplementation(() => {
      position += items[1].getBoundingClientRect().top - 64;
    });
    return {
      scroll,
      snap,
      get position() {
        return position;
      },
      target: element('.explorer-content [data-section="programming"]'),
    };
  }

  it.each([
    50, 100,
  ])("corrects trackpad inertia overshooting a section initially %i px away", async (offset) => {
    expect(wheel(120).defaultPrevented).toBe(false);
    await click("[data-open]");
    vi.useFakeTimers();
    const geometry = documentGeometry(64 + offset);
    for (const delta of [120, 110, 95, 80, 65, 50, 38, 28, 20, 12, 7, 3, 1]) {
      expect(wheel(delta, geometry.target).defaultPrevented).toBe(true);
      vi.advanceTimersByTime(16);
    }
    expect(geometry.target.getBoundingClientRect().top).toBeLessThan(64);
    expect(
      geometry.scroll.mock.calls.some(
        ([options]) => (options as ScrollToOptions).behavior === "smooth",
      ),
    ).toBe(false);
    wheel(0);
    vi.advanceTimersByTime(220);
    expect(geometry.target.getBoundingClientRect().top).toBeCloseTo(64);
  });

  it.each([
    {
      name: "aligns an approaching section once previous content is read",
      direction: 1,
      top: 184,
      height: 1000,
      tail: 40,
      align: "top",
    },
    {
      name: "does not skip the previous unread tail",
      direction: 1,
      top: 184,
      height: 1000,
      tail: 100,
      align: null,
    },
    {
      name: "does not return to the heading when reading the start of a long section",
      direction: 120,
      top: 64,
      height: 3000,
      tail: -100,
      align: null,
    },
    {
      name: "does not return to the end when reading upward within a long section",
      direction: -80,
      top: -1232,
      height: 2000,
      tail: -1400,
      align: null,
    },
    {
      name: "leaves the middle of long content freely scrollable",
      direction: 1,
      top: -600,
      height: 3000,
      tail: -700,
      align: null,
    },
    {
      name: "aligns the heading like menu navigation when returning upward",
      direction: -1,
      top: -1332,
      height: 2000,
      tail: -1400,
      align: "top",
    },
    {
      name: "corrects upward inertia and aligns the previous heading",
      direction: -140,
      top: -1332,
      height: 2000,
      tail: -1200,
      align: "top",
    },
  ])("$name", async ({ direction, top, height, tail, align }) => {
    await click("[data-open]");
    vi.useFakeTimers();
    const geometry = documentGeometry(top, height, tail);
    wheel(direction, geometry.target);
    const position = geometry.position;
    vi.advanceTimersByTime(220);
    const bounds = geometry.target.getBoundingClientRect();
    if (align === "top") expect(bounds.top).toBeCloseTo(64);
    else expect(geometry.position).toBe(position);
    if (align)
      expect(geometry.snap).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
  });

  it.each([
    "navigation",
    "keyboard",
    "pointer",
    "reduced motion",
  ])("cancels pending alignment on %s", async (action) => {
    await click("[data-open]");
    vi.useFakeTimers();
    const geometry = documentGeometry(184);
    wheel(1, geometry.target);
    const position = geometry.position;
    if (action === "navigation") await navigate("projects");
    else if (action === "keyboard")
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }));
    else if (action === "pointer")
      window.dispatchEvent(new Event("pointerdown"));
    else {
      motion.matches = true;
      motionChange();
      await nextTick();
    }
    vi.advanceTimersByTime(220);
    expect(geometry.position).toBe(position);
  });

  it("lets the visitor reach the footer without pulling Contact back into alignment", async () => {
    await navigate("contact");
    vi.useFakeTimers();
    const geometry = documentGeometry(-2000);
    const contact = element('.explorer-content [data-section="contact"]');
    vi.mocked(contact.getBoundingClientRect).mockImplementation(
      () => new DOMRect(0, -60 - geometry.position, 600, 704),
    );
    wheel(120, contact);
    const position = geometry.position;
    expect(contact.getBoundingClientRect().bottom).toBeLessThan(
      window.innerHeight,
    );
    vi.advanceTimersByTime(220);
    expect(geometry.position).toBe(position);
  });

  it("activates observed sections without pushing history and clears selection", async () => {
    await navigate("programming");
    expect(scrollIntoView).toHaveBeenCalled();
    await click("[data-select]");
    const push = vi.spyOn(window.history, "pushState");
    const target = element('.explorer-content [data-section="about"]');
    observerCallback(
      [
        {
          target,
          isIntersecting: true,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
    await nextTick();
    expect(element("[data-scene]").dataset.section).toBe("about");
    expect(element("[data-scene]").dataset.selected).toBe("");
    expect(window.location.hash).toBe("#about");
    expect(push).not.toHaveBeenCalled();
    await navigate("projects");
    expect(element("[data-scene]").dataset.paused).toBe("true");
  });

  it("observes the mobile reading area below the sticky scene", async () => {
    await click("[data-open]");
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("innerHeight", 800);
    vi.spyOn(element("#model-stage"), "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 116, 390, 220),
    );
    window.dispatchEvent(new Event("resize"));
    expect(observerOptions?.rootMargin).toBe("-528px 0px -192px 0px");
  });

  it("preserves zoom, horizontal scrolling, dialogs, nested scrolling and reduced motion", async () => {
    await navigate("about");
    const scroll = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    expect(wheel(120, window, { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(wheel(120, window, { shiftKey: true }).defaultPrevented).toBe(false);
    expect(wheel(120, window, { deltaX: 240 }).defaultPrevented).toBe(false);
    expect(wheel(120, window, { cancelable: false }).defaultPrevented).toBe(
      false,
    );
    const about = element('.explorer-content [data-section="about"]');
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    about.append(dialog);
    expect(wheel(120, dialog).defaultPrevented).toBe(false);
    dialog.remove();
    const nested = document.createElement("div");
    nested.style.overflowY = "auto";
    Object.defineProperties(nested, {
      scrollHeight: { value: 800 },
      clientHeight: { value: 200 },
    });
    about.append(nested);
    expect(wheel(120, nested).defaultPrevented).toBe(false);
    nested.remove();
    motion.matches = true;
    motionChange();
    await nextTick();
    expect(wheel(120).defaultPrevented).toBe(false);
    expect(scroll).not.toHaveBeenCalled();
  });

  it("removes gesture handlers and pending alignment when unmounted", async () => {
    await click("[data-open]");
    vi.useFakeTimers();
    documentGeometry(184);
    wheel(1);
    app.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(wheel(120).defaultPrevented).toBe(false);
    app = createApp(defineComponent(() => () => h("div")));
    app.mount(container);
  });

  it("selects contact channels through the scene and accessible buttons", async () => {
    await navigate("contact");
    await click("[data-select-contact]");
    expect(
      element('[data-contact-channel="contact-email"]').getAttribute(
        "aria-pressed",
      ),
    ).toBe("true");
    expect(
      element('#contact a[href^="mailto:"]').classList.contains("active"),
    ).toBe(true);
    await click('[data-contact-channel="contact-github"]');
    expect(element("[data-scene]").dataset.selected).toBe("contact-github");
  });

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
    window.dispatchEvent(new PopStateEvent("popstate"));
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

  it("hides the header and footer on startup and reveals them when the cube opens", async () => {
    app.unmount();
    app = createApp(PortfolioApp);
    app.mount(container);
    await vi.waitFor(() =>
      expect(container.querySelector("[data-open]")).not.toBeNull(),
    );
    expect(container.querySelector(".site-header")).toBeNull();
    expect(container.querySelector(".site-footer")).toBeNull();
    await click("[data-open]");
    expect(container.querySelector(".site-header")).not.toBeNull();
    expect(container.querySelector(".site-footer")).not.toBeNull();
    await navigate("programming");
    await navigate("home");
    expect(container.querySelector(".site-header")).toBeNull();
    expect(container.querySelector(".site-footer")).toBeNull();
  });

  it("keeps the side menu hidden until the cube is clicked", async () => {
    expect(container.querySelector(".explorer-nav")).toBeNull();
    await click("[data-open]");
    expect(container.querySelector(".explorer-nav")).not.toBeNull();
    expect(element("[data-scene]").dataset.section).toBe("about");
    expect(container.querySelector('.explorer-nav a[href="#home"]')).toBeNull();
    expect(container.querySelector('[data-section="home"]')).toBeNull();
  });

  it("shows the close arrow outside home and restores the initial screen", async () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    app.unmount();
    app = createApp(PortfolioApp);
    app.mount(container);
    await vi.waitFor(() =>
      expect(container.querySelector("[data-open]")).not.toBeNull(),
    );
    expect(container.querySelector(".menu-toggle")).toBeNull();
    await click("[data-open]");
    expect(container.querySelector(".menu-toggle")).not.toBeNull();
    await navigate("programming");
    await click("[data-select]");
    expect(container.querySelector(".menu-toggle")).not.toBeNull();
    await navigate("home");
    expect(container.querySelector(".menu-toggle")).toBeNull();
    await navigate("programming");
    await click(".menu-toggle");
    expect(container.querySelector(".explorer-nav")).toBeNull();
    expect(container.querySelector(".explorer-content")).toBeNull();
    expect(container.querySelector(".site-header")).toBeNull();
    expect(container.querySelector(".site-footer")).toBeNull();
    expect(element("[data-scene]").dataset.section).toBe("home");
    expect(element("[data-scene]").dataset.selected).toBe("");
    expect(window.location.hash).toBe("#home");
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    await click("[data-open]");
    await navigate("contact");
    expect(window.location.hash).toBe("#contact");
    expect(container.querySelector(".site-header")).not.toBeNull();
  });

  it("opens each area and exposes every scene detail through HTML buttons", async () => {
    for (const area of areaIds) {
      await navigate(area);
      const content = explorerContent["en-US"].areas[area];
      expect(
        element(`.explorer-content [data-section="${area}"]`).getAttribute(
          "aria-label",
        ),
      ).toBe(explorerContent["en-US"].navigation[area]);
      expect(
        element(`[data-section="${area}"] .area-summary`).textContent,
      ).toBe(content.summary);
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
        await click(
          `[data-section="${area}"] .part-buttons button:nth-child(${index + 1})`,
        );
        expect(
          element(`[data-section="${area}"] .part-detail h3`).textContent,
        ).toBe(part.label);
        expect(
          element(`[data-section="${area}"] .part-detail p`).textContent,
        ).toBe(part.description);
        expect(element("[data-scene]").dataset.selected).toBe(part.id);
        expect(
          element(
            `[data-section="${area}"] .part-buttons button:nth-child(${index + 1})`,
          ).getAttribute("aria-pressed"),
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
    expect(container.querySelector(".explorer-content")).toBeNull();
    expect(element("[data-scene]").dataset.section).toBe("home");
    expect(element("[data-scene]").dataset.selected).toBe("");
    expect(container.querySelector(".explorer-nav")).toBeNull();
  });

  it("updates navigation and selected detail when the locale changes", async () => {
    await navigate("modeling");
    await click('[data-section="modeling"] .part-buttons button:nth-child(2)');
    for (const locale of ["pt-BR", "es-AR", "en-US"] as const) {
      setLocale(locale);
      await nextTick();
      const text = explorerContent[locale];
      expect(element('[data-section="modeling"] h2').textContent).toBe(
        text.navigation.modeling,
      );
      expect(
        element('[data-section="modeling"] .part-detail p').textContent,
      ).toBe(text.areas.modeling.parts[1]?.description);
      expect(
        element('.explorer-content [data-section="modeling"]').getAttribute(
          "aria-label",
        ),
      ).toBe(text.navigation.modeling);
    }
  });

  it("keeps content and navigation available after the renderer fails", async () => {
    await navigate("electronics");
    await click("[data-fail]");
    expect(element(".cube-fallback").getAttribute("aria-label")).toBe(
      explorerContent["en-US"].openCube,
    );
    expect(container.querySelector("[data-scene]")).toBeNull();
    await click(
      '[data-section="electronics"] .part-buttons button:first-child',
    );
    expect(
      element('[data-section="electronics"] .part-detail p').textContent,
    ).toBe(explorerContent["en-US"].areas.electronics.parts[0]?.description);
    await navigate("contact");
    expect(
      element('.explorer-content [data-section="contact"]').getAttribute(
        "aria-label",
      ),
    ).toBe("Contact");
    expect(element('#contact a[href^="mailto:"]')).toBeTruthy();
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

  it("opens the compact selector, navigates by hash and resets model expansion", async () => {
    expect(container.querySelector("#mobile-section")).toBeNull();
    await click("[data-open]");
    const selector = element("#mobile-section") as HTMLSelectElement;
    expect(selector.options).toHaveLength(7);
    selector.value = "reverse";
    selector.dispatchEvent(new Event("change", { bubbles: true }));
    window.dispatchEvent(new Event("hashchange"));
    await nextTick();
    expect(window.location.hash).toBe("#reverse");
    expect(element("[data-scene]").dataset.section).toBe("reverse");
    await click(".mobile-model-toggle");
    expect(
      element(".portfolio-explorer").classList.contains("model-expanded"),
    ).toBe(true);
    expect(element(".mobile-model-toggle").getAttribute("aria-expanded")).toBe(
      "true",
    );
    await click(".mobile-model-toggle");
    expect(
      element(".portfolio-explorer").classList.contains("model-expanded"),
    ).toBe(false);
    await click(".mobile-model-toggle");
    selector.value = "electronics";
    selector.dispatchEvent(new Event("change", { bubbles: true }));
    await nextTick();
    expect(
      element(".portfolio-explorer").classList.contains("model-expanded"),
    ).toBe(false);
    setLocale("pt-BR");
    await nextTick();
    expect(selector.selectedOptions[0]?.textContent).toBe("Eletrônica");
    await click("[data-fail]");
    expect(container.querySelector(".cube-fallback")).not.toBeNull();
    selector.value = "contact";
    selector.dispatchEvent(new Event("change", { bubbles: true }));
    await nextTick();
    expect(
      element('.explorer-content [data-section="contact"]').getAttribute(
        "aria-label",
      ),
    ).toBe("Contato");
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
          container.querySelectorAll<HTMLAnchorElement>("#projects a"),
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
