import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, h } from "vue";
import { useSectionReveal } from "./useSectionReveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSectionReveal", () => {
  it("reveals a section when it enters the viewport", () => {
    let callback: IntersectionObserverCallback = () => {};
    const unobserve = vi.fn();
    const disconnect = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(nextCallback: IntersectionObserverCallback) {
          callback = nextCallback;
        }
        observe() {}
        unobserve = unobserve;
        disconnect = disconnect;
      },
    );
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const container = document.createElement("div");
    document.body.append(container);
    const app = createApp({
      setup() {
        useSectionReveal();
        return () =>
          h("main", [
            h("section", { class: "hero-section" }),
            h("section", { id: "later" }),
          ]);
      },
    });

    try {
      app.mount(container);
      const section = container.querySelector<HTMLElement>("#later");
      if (!section) throw new Error("test section is missing");
      expect(section.dataset.reveal).toBe("pending");

      const bounds = section.getBoundingClientRect();
      callback(
        [
          {
            time: 0,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: bounds,
            intersectionRect: bounds,
            rootBounds: null,
            target: section,
          },
        ],
        {} as IntersectionObserver,
      );
      expect(section.dataset.reveal).toBe("visible");
      expect(unobserve).toHaveBeenCalledWith(section);
    } finally {
      app.unmount();
      container.remove();
    }
    expect(disconnect).toHaveBeenCalled();
  });
});
