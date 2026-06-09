<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <section id="contact" class="contact-section" aria-labelledby="contact-title">
    <div>
      <p class="eyebrow">{{ content.sections.contact }}</p>
      <h2 id="contact-title">{{ content.contact.title }}</h2>
      <p>{{ content.contact.body }}</p>
    </div>
    <address>
      <a :href="`mailto:${content.meta.email}`">{{ content.meta.email }}</a>
      <a :href="`tel:${content.meta.phone.replaceAll(' ', '')}`">{{ content.meta.phone }}</a>
      <a :href="content.meta.githubUrl" target="_blank" rel="noreferrer">{{ content.meta.github }}</a>
      <a :href="content.meta.linkedinUrl" target="_blank" rel="noreferrer">{{ content.meta.linkedin }}</a>
      <span v-for="language in content.languages" :key="language">{{ language }}</span>
    </address>
  </section>
</template>
