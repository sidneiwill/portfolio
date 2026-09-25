import { onBeforeUnmount, onMounted } from "vue";

export const useSectionReveal = () => {
  let observer: IntersectionObserver | null = null;
  let motionPreference: MediaQueryList | null = null;
  let sections: HTMLElement[] = [];

  const revealAll = () => {
    observer?.disconnect();
    for (const section of sections) {
      if (section.dataset.reveal === "pending") {
        section.dataset.reveal = "visible";
      }
    }
  };

  const onMotionChange = () => {
    if (motionPreference?.matches) revealAll();
  };

  onMounted(() => {
    if (!("IntersectionObserver" in window) || !("matchMedia" in window))
      return;

    motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main > section:not(.hero-section)",
      ),
    );
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = entry.target as HTMLElement;
        section.dataset.reveal = "visible";
        observer?.unobserve(section);
      }
    });

    for (const section of sections) {
      section.dataset.reveal = "pending";
      observer.observe(section);
    }
    motionPreference.addEventListener("change", onMotionChange);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    motionPreference?.removeEventListener("change", onMotionChange);
  });
};
