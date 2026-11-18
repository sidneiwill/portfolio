<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";
import BaseSectionHeading from "@/shared/components/base/BaseSectionHeading.vue";

defineProps<{ content: ResumeContent; selected: string | null }>();
defineEmits<{ select: [id: string | null]; hover: [id: string | null] }>();
</script>

<template>
  <section class="section-block" aria-labelledby="skills-title">
    <BaseSectionHeading heading-id="skills-title">
      {{ content.sections.skills }}
    </BaseSectionHeading>
    <div class="skills-grid">
      <article v-for="(group, index) in content.skillGroups" :key="group.title" class="skill-card">
        <h3><button type="button" class="stack-topic" :class="{ active: selected === `stack-${index}` }" :aria-expanded="selected === `stack-${index}`" :aria-controls="`stack-details-${index}`" @click="$emit('select', selected === `stack-${index}` ? null : `stack-${index}`)" @focus="$emit('hover', `stack-${index}`)" @blur="$emit('hover', null)">{{ group.title }}<span aria-hidden="true">{{ selected === `stack-${index}` ? '−' : '+' }}</span></button></h3>
        <div :id="`stack-details-${index}`" class="stack-details" :aria-hidden="selected !== `stack-${index}`" :inert="selected !== `stack-${index}` ? true : undefined">
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
        </div>
      </article>
    </div>
  </section>
</template>
