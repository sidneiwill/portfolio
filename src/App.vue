<script setup lang="ts">
import { ref } from "vue";
import PortfolioExplorer from "@/features/explorer/PortfolioExplorer.vue";
import SiteFooter from "@/features/layout/SiteFooter.vue";
import SiteHeader from "@/features/layout/SiteHeader.vue";
import { useI18n } from "@/i18n/useI18n";
import { useTheme } from "@/shared/theme/useTheme";

const opened = ref(false);
const i18n = useI18n();
const theme = useTheme();
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">{{ i18n.t("nav.skip") }}</a>
    <div v-if="opened" class="header-reveal"><div class="header-reveal-inner">
    <SiteHeader :locale="i18n.locale.value" :locales="i18n.locales" :theme="theme.theme.value"
      :labels="{ language: i18n.t('controls.language'), theme: i18n.t('controls.theme'), light: i18n.t('controls.light'), dark: i18n.t('controls.dark'), site: i18n.t('layout.site') }"
      @set-locale="i18n.setLocale" @toggle-theme="theme.toggleTheme" />
    </div></div>
    <main id="main" tabindex="-1"><PortfolioExplorer :theme="theme.theme.value" @open="opened = true" /></main>
    <SiteFooter :content="i18n.resume.value" />
  </div>
</template>
