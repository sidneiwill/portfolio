<script setup lang="ts">
import { type Locale, localeLabels } from "@/i18n/config";
import type { Theme } from "@/shared/theme/useTheme";

defineProps<{
  locale: Locale;
  locales: Locale[];
  theme: Theme;
  labels: {
    language: string;
    theme: string;
    light: string;
    dark: string;
    site: string;
  };
}>();

defineEmits<{
  setLocale: [locale: Locale];
  toggleTheme: [];
}>();
</script>

<template>
  <header class="site-header" :aria-label="labels.site">
    <div class="site-header-inner">
      <a class="brand" href="#main" aria-label="Sidnei William de Oliveira">
        <span class="brand-text">sidnei<span class="terminal-at">@</span>portfolio</span>
        <span class="brand-mark" aria-hidden="true">:~ $</span>
        <span class="terminal-cursor" aria-hidden="true">▌</span>
      </a>

      <nav class="header-actions" :aria-label="labels.language">
        <div
          class="segmented language-selector"
          role="group"
          :aria-label="labels.language"
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
          <span class="terminal-setting" aria-hidden="true">theme=</span>
          <span class="theme-label">{{ theme === "dark" ? labels.dark : labels.light }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>
