<script setup lang="ts">
import SiteFooter from "@/features/layout/SiteFooter.vue";
import SiteHeader from "@/features/layout/SiteHeader.vue";
import ContactSection from "@/features/resume/components/ContactSection.vue";
import HeroSection from "@/features/resume/components/HeroSection.vue";
import ProjectsSection from "@/features/resume/components/ProjectsSection.vue";
import ResumeSection from "@/features/resume/components/ResumeSection.vue";
import SkillsSection from "@/features/resume/components/SkillsSection.vue";
import { useI18n } from "@/shared/i18n/useI18n";
import { useTheme } from "@/shared/theme/useTheme";

const i18n = useI18n();
const theme = useTheme();
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">{{ i18n.t("nav.skip") }}</a>
    <SiteHeader
      :locale="i18n.locale.value"
      :locales="i18n.locales"
      :theme="theme.theme.value"
      :labels="{
        language: i18n.t('controls.language'),
        theme: i18n.t('controls.theme'),
        light: i18n.t('controls.light'),
        dark: i18n.t('controls.dark')
      }"
      @set-locale="i18n.setLocale"
      @toggle-theme="theme.toggleTheme"
    />
    <main id="main">
      <HeroSection :content="i18n.resume.value" />
      <SkillsSection :content="i18n.resume.value" />
      <ResumeSection :content="i18n.resume.value" />
      <ProjectsSection :content="i18n.resume.value" />
      <ContactSection :content="i18n.resume.value" />
    </main>
    <SiteFooter :content="i18n.resume.value" />
  </div>
</template>
