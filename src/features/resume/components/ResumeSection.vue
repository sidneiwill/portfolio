<script setup lang="ts">
import type { ResumeContent, TimelineItem } from "@/features/resume/types";
import BaseSectionHeading from "@/shared/components/base/BaseSectionHeading.vue";

defineProps<{ content: ResumeContent }>();

const itemId = (item: TimelineItem) => `${item.place}-${item.period}`;
</script>

<template>
  <section class="section-block timeline-layout" aria-labelledby="experience-title">
    <BaseSectionHeading number="02" heading-id="experience-title">
      {{ content.sections.experience }}
    </BaseSectionHeading>
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
    <BaseSectionHeading number="03" heading-id="education-title">
      {{ content.sections.education }}
    </BaseSectionHeading>
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
