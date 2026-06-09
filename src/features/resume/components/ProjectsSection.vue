<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section id="projects" class="section-block" aria-labelledby="projects-title">
    <div class="section-heading">
      <span class="rail-number">04</span>
      <h2 id="projects-title">{{ content.sections.projects }}</h2>
    </div>
    <div class="projects-grid">
      <article v-for="project in content.projects" :key="project.name" class="project-card">
        <p class="project-name">{{ project.name }}</p>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <span>{{ project.stack }}</span>
      </article>
    </div>
  </section>
</template>
