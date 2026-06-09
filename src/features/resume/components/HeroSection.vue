<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">{{ content.hero.eyebrow }}</p>
      <h1 id="hero-title">{{ content.meta.name }}</h1>
      <p class="role-line">{{ content.meta.role }}</p>
      <p class="hero-headline">{{ content.hero.headline }}</p>
      <p class="hero-summary">{{ content.hero.summary }}</p>
      <div class="hero-actions">
        <a class="button primary" href="#contact">{{ content.hero.primaryCta }}</a>
        <a class="button secondary" href="#projects">{{ content.hero.secondaryCta }}</a>
      </div>
    </div>

    <aside class="hero-card" aria-label="Profile">
      <div class="photo-frame">
        <img src="/profile.svg" alt="Sidnei William de Oliveira" />
      </div>
      <div class="status-panel">
        <span class="status-dot" aria-hidden="true"></span>
        <p>{{ content.hero.availability }}</p>
      </div>
    </aside>
  </section>
</template>
