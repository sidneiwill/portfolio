<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";
import BaseSectionHeading from "@/shared/components/base/BaseSectionHeading.vue";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section class="section-block" aria-labelledby="skills-title">
    <BaseSectionHeading number="01" heading-id="skills-title">
      {{ content.sections.skills }}
    </BaseSectionHeading>
    <div class="skills-grid">
      <article v-for="group in content.skillGroups" :key="group.title" class="skill-card">
        <h3>{{ group.title }}</h3>
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
