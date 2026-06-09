<script setup lang="ts">
import type { ResumeContent, TimelineItem } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();

const itemId = (item: TimelineItem) => `${item.place}-${item.period}`;
</script>

<template>
  <section class="section-block timeline-layout" aria-labelledby="experience-title">
    <div class="section-heading">
      <span class="rail-number">02</span>
      <h2 id="experience-title">{{ content.sections.experience }}</h2>
    </div>
    <div class="timeline">
      <article v-for="item in content.experience" :key="itemId(item)" class="timeline-item">
        <p class="period">{{ item.period }}</p>
        <h3>{{ item.title }}</h3>
        <p class="place">{{ item.place }}</p>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </section>

  <section class="section-block timeline-layout compact" aria-labelledby="education-title">
    <div class="section-heading">
      <span class="rail-number">03</span>
      <h2 id="education-title">{{ content.sections.education }}</h2>
    </div>
    <div class="timeline">
      <article v-for="item in content.education" :key="itemId(item)" class="timeline-item">
        <p class="period">{{ item.period }}</p>
        <h3>{{ item.title }}</h3>
        <p class="place">{{ item.place }}</p>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
