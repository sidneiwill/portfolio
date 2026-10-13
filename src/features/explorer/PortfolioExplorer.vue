<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import ContactSection from "@/features/resume/components/ContactSection.vue";
import HeroSection from "@/features/resume/components/HeroSection.vue";
import ProjectsSection from "@/features/resume/components/ProjectsSection.vue";
import ResumeSection from "@/features/resume/components/ResumeSection.vue";
import SkillsSection from "@/features/resume/components/SkillsSection.vue";
import { useI18n } from "@/i18n/useI18n";
import type { Theme } from "@/shared/theme/useTheme";
import { areaIds, explorerContent, type SectionId } from "./content";

const emit = defineEmits<{ open: []; close: [] }>();
const props = defineProps<{ theme: Theme }>();
const { locale, resume } = useI18n();
const text = computed(() => explorerContent[locale.value]);
const stackIds = computed(() =>
  resume.value.skillGroups.map((_, index) => `stack-${index}`),
);
const section = ref<SectionId>("home");
const selected = ref<string | null>(null);
const hovered = ref<string | null>(null);
const modelLabel = computed(() => {
  if (section.value === "contact") {
    const labels: Record<string, string> = {
      "contact-email": resume.value.meta.email,
      "contact-phone": resume.value.meta.phone,
      "contact-github": resume.value.meta.github,
      "contact-linkedin": resume.value.meta.linkedin,
    };
    return labels[hovered.value ?? selected.value ?? ""] ?? null;
  }
  if (section.value !== "programming") return part.value?.label ?? null;
  const index = stackIds.value.indexOf(hovered.value ?? selected.value ?? "");
  return resume.value.skillGroups[index]?.title;
});
const menuOpen = ref(false);
const expanded = ref(false);
const reducedMotion = ref(false);
const failed = ref(false);
const content = ref<HTMLElement>();
const stage = ref<HTMLElement>();
const CubeScene = defineAsyncComponent({
  loader: () => import("./CubeScene.vue"),
  onError: (_error, _retry, fail) => {
    failed.value = true;
    fail();
  },
});
const sections: SectionId[] = ["about", ...areaIds, "projects", "contact"];
const area = computed(() => areaIds.find((id) => id === section.value));
const details = computed(() =>
  area.value ? text.value.areas[area.value] : null,
);
const part = computed(() =>
  details.value?.parts.find((item) => item.id === selected.value),
);
let motion: MediaQueryList | undefined;
let sectionObserver: IntersectionObserver | undefined;
let settleTimer: ReturnType<typeof setTimeout> | undefined;
let scrollDirection = 0;
let crossedBoundary: HTMLElement | undefined;
function cancelSettle() {
  clearTimeout(settleTimer);
  settleTimer = undefined;
  crossedBoundary = undefined;
}
function activateSection(id: SectionId) {
  if (section.value === id) return;
  section.value = id;
  selected.value = null;
  hovered.value = null;
  expanded.value = false;
}
async function closeMenu(pushHistory = true) {
  cancelSettle();
  sectionObserver?.disconnect();
  activateSection("home");
  menuOpen.value = false;
  if (pushHistory && window.location.hash !== "#home")
    window.history.pushState(null, "", "#home");
  emit("close");
  await nextTick();
  window.scrollTo({ top: 0, behavior: "instant" });
  stage.value
    ?.querySelector<HTMLElement>(".cube-canvas")
    ?.focus({ preventScroll: true });
}
async function selectSection(id: SectionId, pushHistory = true) {
  if (id === "home") {
    await closeMenu(pushHistory);
    return;
  }
  cancelSettle();
  menuOpen.value = true;
  activateSection(id);
  if (pushHistory && window.location.hash !== `#${id}`)
    window.history.pushState(null, "", `#${id}`);
  await nextTick();
  alignSection(
    content.value?.querySelector<HTMLElement>(`[data-section="${id}"]`),
  );
}
function alignSection(element: HTMLElement | null | undefined) {
  element?.scrollIntoView?.({
    behavior: reducedMotion.value ? "instant" : "smooth",
    block: "start",
  });
}
function selectMobileSection(event: Event) {
  void selectSection((event.target as HTMLSelectElement).value as SectionId);
}
function readHash() {
  const hash = window.location.hash.slice(1);
  const id = hash === "main" || !hash ? "home" : hash;
  if (
    (id === "home" || sections.includes(id as SectionId)) &&
    (hash || menuOpen.value)
  )
    void selectSection(id as SectionId, false);
}
function readingTop() {
  return window.innerWidth <= 800
    ? Math.min(
        window.innerHeight * 0.8,
        116 + (stage.value?.getBoundingClientRect().height ?? 0),
      )
    : 64;
}
function settleSection() {
  settleTimer = undefined;
  if (!menuOpen.value || reducedMotion.value || !scrollDirection) return;
  const items = Array.from(
    content.value?.querySelectorAll<HTMLElement>("[data-section]") ?? [],
  );
  const top = readingTop();
  const range = Math.min(320, (window.innerHeight - top) * 0.45);
  // Let the visitor reach the footer instead of returning to Contact's heading.
  if (
    scrollDirection > 0 &&
    (items.at(-1)?.getBoundingClientRect().bottom ?? Infinity) <
      window.innerHeight - 1
  )
    return;
  const candidates = items
    .map((item, index) => {
      const bounds = item.getBoundingClientRect();
      const offset =
        scrollDirection > 0
          ? bounds.top - top
          : bounds.bottom - window.innerHeight;
      const previousContent = Array.from(items[index - 1]?.children ?? [])
        .reverse()
        .find((child) => child.textContent?.trim());
      const unreadTail =
        scrollDirection > 0 &&
        offset > 0 &&
        previousContent &&
        previousContent.getBoundingClientRect().bottom > top;
      return { offset, unreadTail, index, item };
    })
    .filter(
      ({ offset, unreadTail, index, item }) =>
        !unreadTail &&
        (offset * scrollDirection > 0 || item === crossedBoundary) &&
        (scrollDirection < 0 || index > 0) &&
        Math.abs(offset) > 1 &&
        Math.abs(offset) <= range,
    );
  const closest = candidates.sort(
    (a, b) => Math.abs(a.offset) - Math.abs(b.offset),
  )[0];
  if (closest) alignSection(closest.item);
}
function observeSections() {
  cancelSettle();
  sectionObserver?.disconnect();
  if (!menuOpen.value || typeof IntersectionObserver === "undefined") return;
  const height = window.innerHeight;
  const center = (readingTop() + height) / 2;
  const top = Math.round(center - height * 0.05);
  const bottom = Math.round(height - center - height * 0.05);
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      const id = (visible?.target as HTMLElement | undefined)?.dataset
        .section as SectionId | undefined;
      if (!id || !sections.includes(id)) return;
      activateSection(id);
      if (window.location.hash !== `#${id}`)
        window.history.replaceState(null, "", `#${id}`);
    },
    { rootMargin: `-${top}px 0px -${bottom}px 0px` },
  );
  for (const item of content.value?.querySelectorAll("[data-section]") ?? [])
    sectionObserver.observe(item);
}
watch(menuOpen, async (open) => {
  if (!open) return;
  emit("open");
  await nextTick();
  observeSections();
});
watch(expanded, async () => {
  await nextTick();
  observeSections();
});
function selectPart(id: SectionId, partId: string | null) {
  activateSection(id);
  selected.value = partId;
}
function hoverPart(id: SectionId, partId: string | null) {
  if (partId) activateSection(id);
  hovered.value = partId;
}
function isNativeScroll(target: EventTarget | null) {
  const element = target instanceof Element ? target : null;
  if (
    element?.closest(
      'dialog, [role="dialog"], select, input, textarea, [contenteditable="true"]',
    )
  )
    return true;
  for (
    let item = element;
    item && item !== document.body && item !== document.documentElement;
    item = item.parentElement
  ) {
    if (
      item.scrollHeight > item.clientHeight &&
      /auto|scroll/.test(getComputedStyle(item).overflowY)
    )
      return true;
  }
  return false;
}
function onWheel(event: WheelEvent) {
  const hadSettle = settleTimer !== undefined;
  clearTimeout(settleTimer);
  settleTimer = undefined;
  if (!hadSettle) crossedBoundary = undefined;
  if (
    !menuOpen.value ||
    reducedMotion.value ||
    event.defaultPrevented ||
    !event.cancelable ||
    event.ctrlKey ||
    event.shiftKey ||
    Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
    isNativeScroll(event.target)
  )
    return;
  const unit =
    event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? window.innerHeight
      : event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : 1;
  const delta = event.deltaY * unit;
  if (!Number.isFinite(delta)) return;
  const top = readingTop();
  const items = Array.from(
    content.value?.querySelectorAll<HTMLElement>("[data-section]") ?? [],
  );
  if (delta && Math.sign(delta) !== scrollDirection)
    crossedBoundary = undefined;
  const boundaries = items
    .slice(1)
    .map((element) => element.getBoundingClientRect().top - top);
  const steps = Math.max(1, Math.ceil(Math.abs(delta) / 12));
  const step = delta / steps;
  let distance = 0;
  for (let index = 0; index < steps; index++) {
    const nearest = Math.min(
      ...boundaries.map((boundary) => Math.abs(boundary - distance - step / 2)),
    );
    const proximity = Math.max(0, 1 - nearest / 220);
    distance += step * (1 - 0.9 * proximity * proximity);
  }
  if (delta) {
    for (const item of delta > 0 ? items : [...items].reverse()) {
      const bounds = item.getBoundingClientRect();
      const offset =
        delta > 0 ? bounds.top - top : bounds.bottom - window.innerHeight;
      if (
        offset * Math.sign(delta) > 0 &&
        (offset - distance) * Math.sign(delta) <= 0
      )
        crossedBoundary = item;
    }
  }
  // Control the gesture from its first event so Safari's momentum stays cancelable.
  event.preventDefault();
  if (!event.defaultPrevented) return;
  window.scrollBy({ top: distance, behavior: "instant" });
  if (delta || hadSettle) {
    if (delta) scrollDirection = Math.sign(delta);
    settleTimer = setTimeout(settleSection, 220);
  }
}
function updateMotion() {
  cancelSettle();
  reducedMotion.value = motion?.matches ?? false;
}
onMounted(() => {
  motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  updateMotion();
  motion?.addEventListener("change", updateMotion);
  readHash();
  window.addEventListener("hashchange", readHash);
  window.addEventListener("popstate", readHash);
  window.addEventListener("resize", observeSections);
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("pointerdown", cancelSettle);
  window.addEventListener("keydown", cancelSettle);
});
onBeforeUnmount(() => {
  cancelSettle();
  sectionObserver?.disconnect();
  motion?.removeEventListener("change", updateMotion);
  window.removeEventListener("hashchange", readHash);
  window.removeEventListener("popstate", readHash);
  window.removeEventListener("resize", observeSections);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("pointerdown", cancelSettle);
  window.removeEventListener("keydown", cancelSettle);
});
</script>

<template>
  <div class="portfolio-explorer" :class="{ 'has-panel': section !== 'home', 'menu-open': menuOpen, 'model-expanded': expanded, 'is-projects': section === 'projects' }">
    <nav v-if="menuOpen" class="explorer-nav" :aria-label="text.intro">
      <button v-if="section !== 'home'" class="menu-toggle" type="button" :aria-label="text.collapseMenu" @click="closeMenu()"><span aria-hidden="true">›</span></button>
      <p class="terminal-command" aria-hidden="true"><span>$</span> ls ~/portfolio</p>
      <a v-for="(id, index) in sections" :key="id" :href="`#${id}`"
        :class="{ active: section === id }" :aria-current="section === id ? 'page' : undefined"
        @click.prevent="selectSection(id)">
        <span class="nav-index" aria-hidden="true">{{ String(index).padStart(2, '0') }}</span>
        <span>{{ text.navigation[id] }}</span><span class="nav-arrow" aria-hidden="true">↗</span>
      </a>
    </nav>
    <div v-if="menuOpen" class="mobile-navigation">
      <label for="mobile-section"><span aria-hidden="true">$ cd</span><span class="sr-only">{{ text.chooseSection }}</span></label>
      <select id="mobile-section" :value="section" @change="selectMobileSection">
        <option v-for="id in sections" :key="id" :value="id">{{ text.navigation[id] }}</option>
      </select>
    </div>
    <div id="model-stage" ref="stage" class="explorer-stage">
      <button v-if="failed" type="button" class="cube-fallback" :aria-label="text.openCube"
        @click="selectSection('about')">
        <svg viewBox="0 0 300 300" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="1"
            d="M131.29 166.34L108.68 238.05 M108.68 238.05L69.64 142.11 M108.68 238.05L177.28 206.42 M108.68 238.05L180.07 219.18 M108.68 238.05L89.08 146.26 M69.64 142.11L106.03 93.81 M69.64 142.11L89.08 146.26 M177.28 206.42L180.07 219.18 M177.28 206.42L253.31 155.22 M106.03 93.81L139.32 85.90 M106.03 93.81L89.08 146.26 M106.03 93.81L179.03 83.02 M199.70 130.87L253.31 155.22 M139.32 85.90L179.03 83.02 M180.07 219.18L253.31 155.22 M173.41 130.64L253.31 155.22 M179.03 83.02L253.31 155.22" />
          <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"
            d="M131.29 166.34L69.64 142.11 M131.29 166.34L199.70 130.87 M131.29 166.34L139.32 85.90 M131.29 166.34L180.07 219.18 M69.64 142.11L139.32 85.90 M177.28 206.42L89.08 146.26 M177.28 206.42L173.41 130.64 M106.03 93.81L173.41 130.64 M199.70 130.87L139.32 85.90 M199.70 130.87L180.07 219.18 M199.70 130.87L179.03 83.02 M89.08 146.26L173.41 130.64 M173.41 130.64L179.03 83.02" />
        </svg>
        <p>{{ text.fallback }}</p>
      </button>
      <Suspense v-else>
        <CubeScene :section="section" :stack-ids="stackIds" :theme="props.theme" :reduced-motion="reducedMotion"
          :paused="section === 'projects'" :selected="selected" :reset="0" :label="section === 'home' ? text.openCube : text.navigation[section]"
          :interactive="!menuOpen" @select="selected = $event" @hover="hovered = $event" @open="selectSection('about')"
          @failed="failed = true" />
        <template #fallback><div class="cube-loading" aria-hidden="true">◇</div></template>
      </Suspense>
      <button v-if="section !== 'home'" class="mobile-model-toggle" type="button" :aria-expanded="expanded" aria-controls="model-stage" @click="expanded = !expanded">{{ expanded ? text.collapseModel : text.expandModel }}</button>
      <p v-if="modelLabel" class="model-label" aria-live="polite">{{ modelLabel }}</p>
      <div v-if="section === 'home'" class="explorer-intro">
        <p class="eyebrow">{{ resume.meta.name }}</p>
        <p class="explorer-role">{{ resume.meta.role }}</p>
      </div>
    </div>
    <div v-if="menuOpen" ref="content" class="explorer-content">
      <div id="about" data-section="about" class="scroll-section" role="region" :aria-label="text.navigation.about">
        <HeroSection :content="resume" /><ResumeSection :content="resume" />
      </div>
      <div v-for="id in areaIds" :id="id" :key="id" :data-section="id" class="scroll-section" role="region" :aria-label="text.navigation[id]">
        <p class="eyebrow">{{ resume.meta.name }}</p>
        <h2>{{ text.navigation[id] }}</h2>
        <p class="area-summary">{{ text.areas[id].summary }}</p>
        <SkillsSection v-if="id === 'programming'" :content="resume" :selected="section === id ? selected : null"
          @select="selectPart(id, $event)" @hover="hoverPart(id, $event)" />
        <template v-else>
          <h3 class="part-heading">{{ text.details }}</h3>
          <div class="part-buttons">
            <button v-for="(item, index) in text.areas[id].parts" :key="item.id" type="button"
              :aria-pressed="section === id && selected === item.id" :class="{ active: section === id && selected === item.id }"
              @click="selectPart(id, item.id)"><span aria-hidden="true">0{{ index + 1 }}</span>{{ item.label }}<span aria-hidden="true">↗</span></button>
          </div>
          <div class="part-detail" aria-live="polite">
            <template v-if="section === id && part"><h3>{{ part.label }}</h3><p>{{ part.description }}</p></template>
          </div>
        </template>
      </div>
      <div data-section="projects" class="scroll-section projects-scroll-section" role="region" :aria-label="text.navigation.projects">
        <ProjectsSection :content="resume" />
      </div>
      <div data-section="contact" class="scroll-section" role="region" :aria-label="text.navigation.contact">
        <ContactSection :content="resume" :selected="section === 'contact' ? selected : null"
          @select="selectPart('contact', $event)" @hover="hoverPart('contact', $event)" />
      </div>
    </div>
  </div>
</template>
