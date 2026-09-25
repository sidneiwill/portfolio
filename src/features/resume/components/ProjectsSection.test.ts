import { describe, expect, it } from "vitest";
import { createApp, nextTick } from "vue";
import { resumeContent } from "@/i18n/resumeContent";
import ProjectsSection from "./ProjectsSection.vue";

describe("ProjectsSection macOS warning", () => {
  it("keeps keyboard focus in the dialog and restores it on Escape", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const app = createApp(ProjectsSection, {
      content: resumeContent["en-US"],
    });
    app.mount(container);

    try {
      const trigger = container.querySelector<HTMLButtonElement>(
        'button[aria-label="Download Aylon for macOS"]',
      );
      if (!trigger) throw new Error("macOS download button is missing");

      trigger.click();
      await nextTick();

      const dialog = document.querySelector<HTMLElement>(".macos-warning");
      if (!dialog) throw new Error("macOS warning dialog is missing");
      expect(document.activeElement).toBe(dialog);

      const actions = dialog.querySelectorAll<HTMLElement>("a[href], button");
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (!first || !last) throw new Error("dialog actions are missing");

      last.focus();
      last.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          bubbles: true,
          cancelable: true,
        }),
      );
      expect(document.activeElement).toBe(first);

      first.focus();
      first.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
      expect(document.activeElement).toBe(last);

      dialog.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      await nextTick();
      expect(document.querySelector(".macos-warning")).toBeNull();
      expect(document.activeElement).toBe(trigger);
    } finally {
      app.unmount();
      container.remove();
    }
  });
});
