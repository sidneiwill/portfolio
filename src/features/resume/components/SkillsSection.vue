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
      <article v-for="group in content.skillGroups" :key="group.id" class="skill-card">
        <h3><button type="button" class="stack-topic" :class="{ active: selected === `stack-${group.id}` }" :aria-expanded="selected === `stack-${group.id}`" :aria-controls="`stack-details-${group.id}`" @click="$emit('select', selected === `stack-${group.id}` ? null : `stack-${group.id}`)" @focus="$emit('hover', `stack-${group.id}`)" @blur="$emit('hover', null)">{{ group.title }}<span aria-hidden="true">{{ selected === `stack-${group.id}` ? '−' : '+' }}</span></button></h3>
        <div :id="`stack-details-${group.id}`" class="stack-details" :aria-hidden="selected !== `stack-${group.id}`" :inert="selected !== `stack-${group.id}` ? true : undefined">
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
        </div>
      </article>
    </div>
  </section>
</template>
