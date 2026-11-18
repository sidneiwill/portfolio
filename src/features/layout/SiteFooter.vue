<script setup lang="ts">
import { computed } from "vue";
import type { ResumeContent } from "@/features/resume/types";

const props = defineProps<{ content: ResumeContent }>();
const locationPath = computed(
  () =>
    `/${props.content.meta.location
      .split(",")
      .reverse()
      .map((part) => part.trim().replace(/\s+/g, "_"))
      .join("/")}`,
);
</script>

<template>
  <footer class="site-footer">
    <p><span class="terminal-status" aria-hidden="true">[ok]</span> {{ content.footer }}</p>
    <div class="footer-location">
      <p class="footer-command"><span aria-hidden="true">$</span> pwd</p>
      <p class="footer-output">{{ locationPath }}</p>
    </div>
  </footer>
</template>
