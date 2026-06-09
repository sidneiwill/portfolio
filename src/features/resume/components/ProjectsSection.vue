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
        <div class="project-footer">
          <span>{{ project.stack }}</span>
          <div v-if="project.name === 'Aylon'" class="project-downloads" aria-label="Aylon downloads">
            <a href="https://drive.google.com/uc?export=download&id=1gG2cu29xaZEtkrLgNyQSV5LidoO9qk1N" class="platform-button" aria-label="Download Aylon for Windows">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5.1 10.6 4v7.3H3V5.1Zm8.6-1.25L21 2.5v8.8h-9.4V3.85ZM3 12.3h7.6v7.35L3 18.6v-6.3Zm8.6 0H21v9.2l-9.4-1.3v-7.9Z" />
              </svg>
            </a>
            <a href="https://drive.google.com/uc?export=download&id=1A2MSk9L3t4Yr6fISgyxAm0vYCjgLet2S" class="platform-button" aria-label="Download Aylon for macOS">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.1 2.4c.05 1.15-.4 2.25-1.18 3.05-.82.85-1.98 1.45-3.08 1.36-.08-1.1.42-2.25 1.16-3.03.8-.86 2.15-1.52 3.1-1.38ZM20.5 17.45c-.44 1.02-.65 1.47-1.2 2.38-.78 1.28-1.88 2.88-3.25 2.9-1.22.02-1.53-.84-3.18-.83-1.65.01-1.99.85-3.22.83-1.37-.02-2.42-1.46-3.2-2.74-2.18-3.56-2.4-7.74-1.06-9.96.96-1.58 2.47-2.5 3.9-2.5 1.45 0 2.36.86 3.56.86 1.16 0 1.87-.86 3.55-.86 1.27 0 2.62.69 3.57 1.88-3.14 1.72-2.63 6.18.53 8.04Z" />
              </svg>
            </a>
            <a href="https://drive.google.com/uc?export=download&id=13522-XsG7dQthKLpHY0aSZ8SyaT2XRHL" class="platform-button" aria-label="Download Aylon for Linux">
              <svg class="linux-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.1 2.1c-2.35 0-3.72 1.95-3.72 4.52 0 1.2.28 2.18.18 3.16-.1.9-.62 1.7-1.18 2.62-.82 1.35-1.72 2.82-1.86 5.12-.04.66.32 1.14.84 1.14.4 0 .72-.22 1.1-.5.48-.35 1.06-.78 2-.78.72 0 1.33.2 1.9.38.52.17 1 .33 1.52.33s1-.16 1.52-.33c.57-.18 1.18-.38 1.9-.38.94 0 1.52.43 2 .78.38.28.7.5 1.1.5.52 0 .88-.48.84-1.14-.14-2.3-1.04-3.77-1.86-5.12-.56-.92-1.08-1.72-1.18-2.62-.1-.98.18-1.96.18-3.16 0-2.57-1.37-4.52-3.72-4.52h-1.56Zm-1.18 4.08c.42 0 .76.42.76.94s-.34.94-.76.94-.76-.42-.76-.94.34-.94.76-.94Zm3.34 0c.42 0 .76.42.76.94s-.34.94-.76.94-.76-.42-.76-.94.34-.94.76-.94Zm-4.04 4.82h3.76c-.24.72-.92 1.18-1.88 1.18s-1.64-.46-1.88-1.18Z" />
              </svg>
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
