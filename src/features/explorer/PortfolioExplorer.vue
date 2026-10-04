<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
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

const emit = defineEmits<{ open: [] }>();
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
  if (section.value !== "programming") return null;
  const index = stackIds.value.indexOf(hovered.value ?? selected.value ?? "");
  return resume.value.skillGroups[index]?.title;
});
const menuOpen = ref(false);
watch(menuOpen, (open) => {
  if (open) emit("open");
});
const reducedMotion = ref(false);
const failed = ref(false);
const panel = ref<HTMLElement>();
const CubeScene = defineAsyncComponent({
  loader: () => import("./CubeScene.vue"),
  onError: (_error, _retry, fail) => {
    failed.value = true;
    fail();
  },
});
const sections: SectionId[] = [
  "home",
  ...areaIds,
  "about",
  "projects",
  "contact",
];
const area = computed(() => areaIds.find((id) => id === section.value));
const details = computed(() =>
  area.value ? text.value.areas[area.value] : null,
);
const part = computed(() =>
  details.value?.parts.find((item) => item.id === selected.value),
);
let motion: MediaQueryList | undefined;
function selectSection(id: SectionId) {
  menuOpen.value = true;
  section.value = id;
  selected.value = null;
  hovered.value = null;
  if (panel.value) panel.value.scrollTop = 0;
}
function readHash() {
  const hash = window.location.hash.slice(1);
  const id = hash === "main" ? "home" : hash;
  if (sections.includes(id as SectionId)) selectSection(id as SectionId);
}
function updateMotion() {
  reducedMotion.value = motion?.matches ?? false;
}
onMounted(() => {
  motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  updateMotion();
  motion?.addEventListener("change", updateMotion);
  readHash();
  window.addEventListener("hashchange", readHash);
});
onBeforeUnmount(() => {
  motion?.removeEventListener("change", updateMotion);
  window.removeEventListener("hashchange", readHash);
});
</script>

<template>
  <div class="portfolio-explorer" :class="{ 'has-panel': section !== 'home', 'menu-open': menuOpen }">
    <nav v-if="menuOpen" class="explorer-nav" :aria-label="text.intro">
      <p class="terminal-command" aria-hidden="true"><span>$</span> ls ~/portfolio</p>
      <a v-for="(id, index) in sections" :key="id" :href="`#${id}`"
        :class="{ active: section === id }" :aria-current="section === id ? 'page' : undefined"
        @click="selectSection(id)">
        <span class="nav-index" aria-hidden="true">{{ String(index).padStart(2, '0') }}</span>
        <span>{{ text.navigation[id] }}</span><span class="nav-arrow" aria-hidden="true">↗</span>
      </a>
    </nav>
    <div class="explorer-stage">
      <button v-if="failed" type="button" class="cube-fallback" :aria-label="text.openCube"
        @click="menuOpen = true">
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
          :paused="false" :selected="selected" :reset="0" :label="text.openCube"
          :interactive="!menuOpen" @select="selected = $event" @hover="hovered = $event" @open="menuOpen = true"
          @failed="failed = true" />
        <template #fallback><div class="cube-loading" aria-hidden="true">◇</div></template>
      </Suspense>
      <p v-if="modelLabel" class="model-label" aria-live="polite">{{ modelLabel }}</p>
      <div v-if="section === 'home'" class="explorer-intro">
        <p class="eyebrow">{{ resume.meta.name }}</p>
        <p class="explorer-role">{{ resume.meta.role }}</p>
      </div>
    </div>
    <div v-if="section !== 'home'" id="explorer-panel" ref="panel" class="explorer-panel" tabindex="0"
      role="region" :aria-label="text.navigation[section]">
      <template v-if="details">
        <p class="eyebrow">{{ resume.meta.name }}</p>
        <h1>{{ text.navigation[section] }}</h1>
        <p class="area-summary">{{ details.summary }}</p>
        <SkillsSection v-if="section === 'programming'" :content="resume" :selected="selected" @select="selected = $event" @hover="hovered = $event" />
        <template v-else>
        <h2 class="part-heading">{{ text.details }}</h2>
        <div class="part-buttons">
          <button v-for="(item, index) in details.parts" :key="item.id" type="button"
            :aria-pressed="selected === item.id" :class="{ active: selected === item.id }"
            @click="selected = item.id"><span aria-hidden="true">0{{ index + 1 }}</span>{{ item.label }}<span aria-hidden="true">↗</span></button>
        </div>
        <div class="part-detail" aria-live="polite">
          <template v-if="part"><h3>{{ part.label }}</h3><p>{{ part.description }}</p></template>
        </div>
        </template>
      </template>
      <template v-else-if="section === 'about'">
        <HeroSection :content="resume" /><ResumeSection :content="resume" />
      </template>
      <ProjectsSection v-else-if="section === 'projects'" :content="resume" />
      <ContactSection v-else-if="section === 'contact'" :content="resume" />
    </div>
  </div>
</template>
