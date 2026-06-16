<script setup lang="ts">
import { computed } from "vue";
import { localeLabels } from "@/features/resume/data/resumeContent";
import type { Locale } from "@/features/resume/types";
import type { Theme } from "@/shared/theme/useTheme";

const props = defineProps<{
  locale: Locale;
  locales: Locale[];
  theme: Theme;
  labels: {
    language: string;
    theme: string;
    light: string;
    dark: string;
  };
}>();

defineEmits<{
  setLocale: [locale: Locale];
  toggleTheme: [];
}>();

const languageSliderStyle = computed(() => ({
  "--active-index": props.locales.indexOf(props.locale),
  "--locale-count": props.locales.length,
}));
</script>

<template>
  <header class="site-header" aria-label="Site">
    <div class="site-header-inner">
      <a class="brand" href="#main" aria-label="Sidnei William de Oliveira">
        <span class="brand-mark">SW</span>
        <span class="brand-text">Sidnei</span>
      </a>

      <nav class="header-actions" :aria-label="labels.language">
        <div
          class="segmented language-selector"
          role="group"
          :aria-label="labels.language"
          :style="languageSliderStyle"
        >
          <button
            v-for="item in locales"
            :key="item"
            type="button"
            class="segment"
            :class="{ active: item === locale }"
            :aria-pressed="item === locale"
            @click="$emit('setLocale', item)"
          >
            {{ localeLabels[item] }}
          </button>
        </div>
        <button type="button" class="icon-button" :aria-label="labels.theme" @click="$emit('toggleTheme')">
          <span aria-hidden="true">{{ theme === "dark" ? "☾" : "☼" }}</span>
          <span class="theme-label">{{ theme === "dark" ? labels.dark : labels.light }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>
