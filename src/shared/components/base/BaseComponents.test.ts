import { describe, expect, it } from "vitest";
import { type Component, createApp, h } from "vue";
import BaseAction from "./BaseAction.vue";
import BaseSectionHeading from "./BaseSectionHeading.vue";

const mount = (
  component: Component,
  props: Record<string, unknown>,
  slot: string,
) => {
  const container = document.createElement("div");
  const app = createApp({
    render: () => h(component, props, { default: () => slot }),
  });

  app.mount(container);

  return {
    element: container.firstElementChild as HTMLElement,
    unmount: () => app.unmount(),
  };
};

describe("base components", () => {
  it("renders actions as buttons by default", () => {
    const wrapper = mount(BaseAction, {}, "Cancel");

    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.element.getAttribute("type")).toBe("button");
    expect(wrapper.element.classList).toContain("base-action--secondary");

    wrapper.unmount();
  });

  it("renders linked actions as anchors without button attributes", () => {
    const wrapper = mount(
      BaseAction,
      { href: "#contact", variant: "primary" },
      "Contact",
    );

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.element.getAttribute("href")).toBe("#contact");
    expect(wrapper.element.hasAttribute("type")).toBe(false);
    expect(wrapper.element.classList).toContain("base-action--primary");

    wrapper.unmount();
  });

  it("connects a section heading id while hiding its decorative number", () => {
    const wrapper = mount(
      BaseSectionHeading,
      { headingId: "skills-title", number: "01" },
      "Skills",
    );

    expect(wrapper.element.querySelector("h2")?.id).toBe("skills-title");
    expect(wrapper.element.querySelector("h2")?.textContent).toBe("Skills");
    expect(
      wrapper.element
        .querySelector(".rail-number")
        ?.getAttribute("aria-hidden"),
    ).toBe("true");

    wrapper.unmount();
  });
});
