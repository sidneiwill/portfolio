<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section class="section-block" aria-labelledby="skills-title">
    <div class="section-heading">
      <span class="rail-number">01</span>
      <h2 id="skills-title">{{ content.sections.skills }}</h2>
    </div>
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
