<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";
import BaseSectionHeading from "@/shared/components/base/BaseSectionHeading.vue";

defineProps<{ content: ResumeContent; selected: string | null }>();
defineEmits<{ select: [id: string]; hover: [id: string | null] }>();
</script>

<template>
  <section class="section-block" aria-labelledby="skills-title">
    <BaseSectionHeading heading-id="skills-title">
      {{ content.sections.skills }}
    </BaseSectionHeading>
    <div class="skills-grid">
      <article v-for="(group, index) in content.skillGroups" :key="group.title" class="skill-card">
        <h3><button type="button" class="stack-topic" :class="{ active: selected === `stack-${index}` }" :aria-pressed="selected === `stack-${index}`" @click="$emit('select', `stack-${index}`)" @focus="$emit('hover', `stack-${index}`)" @blur="$emit('hover', null)">{{ group.title }}</button></h3>
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
