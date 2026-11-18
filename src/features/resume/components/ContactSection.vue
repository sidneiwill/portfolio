<script setup lang="ts">
import { computed } from "vue";
import type { ResumeContent } from "@/features/resume/types";

const props = defineProps<{
  content: ResumeContent;
  selected?: string | null;
}>();
defineEmits<{ select: [id: string]; hover: [id: string | null] }>();
const channels = computed(() => [
  {
    id: "contact-email",
    label: props.content.meta.email,
    href: `mailto:${props.content.meta.email}`,
  },
  {
    id: "contact-phone",
    label: props.content.meta.phone,
    href: `tel:${props.content.meta.phone.replaceAll(" ", "")}`,
  },
  {
    id: "contact-github",
    label: props.content.meta.github,
    href: props.content.meta.githubUrl,
  },
  {
    id: "contact-linkedin",
    label: props.content.meta.linkedin,
    href: props.content.meta.linkedinUrl,
  },
]);
</script>

<template>
  <section id="contact" class="contact-section" aria-labelledby="contact-title">
    <div>
      <p class="eyebrow">{{ content.sections.contact }}</p>
      <h2 id="contact-title">{{ content.contact.title }}</h2>
      <p>{{ content.contact.body }}</p>
    </div>
    <address>
      <div v-for="channel in channels" :key="channel.id" class="contact-channel">
        <button type="button" :data-contact-channel="channel.id" :aria-label="channel.label"
          :aria-pressed="selected === channel.id" :class="{ active: selected === channel.id }"
          @click="$emit('select', channel.id)" @focus="$emit('hover', channel.id)" @blur="$emit('hover', null)">
          <span aria-hidden="true">◇</span>
        </button>
        <a :href="channel.href" :class="{ active: selected === channel.id }"
          :target="channel.href.startsWith('https:') ? '_blank' : undefined"
          :rel="channel.href.startsWith('https:') ? 'noreferrer' : undefined">{{ channel.label }}</a>
      </div>
      <span v-for="language in content.languages" :key="language">{{ language }}</span>
    </address>
  </section>
</template>
