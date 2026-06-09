<script setup lang="ts">
import type { ResumeContent } from "@/features/resume/types";

defineProps<{ content: ResumeContent }>();
</script>

<template>
  <footer class="site-footer">
    <p>{{ content.footer }}</p>
    <p>{{ content.meta.location }}</p>
  </footer>
</template>
