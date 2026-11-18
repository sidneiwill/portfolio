<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";
import BaseAction from "@/shared/components/base/BaseAction.vue";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <div class="hero-identity">
      <div class="photo-frame">
        <img src="/profile.webp" alt="Sidnei William de Oliveira" width="264" height="274"
          loading="lazy" decoding="async" />
      </div>
      <div>
        <h1 id="hero-title">{{ content.meta.name }}</h1>
        <p class="role-line">{{ content.meta.role }} · {{ content.hero.region }}</p>
        <p class="status-line"><span class="status-dot" aria-hidden="true"></span>{{ content.hero.availability }}</p>
      </div>
    </div>
    <p class="hero-headline">{{ content.hero.headline }}</p>
    <p class="hero-summary">{{ content.hero.summary }}</p>
    <div class="hero-actions">
      <BaseAction href="#contact" variant="primary">{{ content.hero.primaryCta }}</BaseAction>
      <BaseAction href="#projects">{{ content.hero.secondaryCta }}</BaseAction>
    </div>
  </section>
</template>
