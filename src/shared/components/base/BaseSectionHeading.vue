<script setup lang="ts">
defineProps<{
  headingId: string;
  number: string;
}>();
</script>

<template>
  <div class="section-heading">
    <span class="rail-number" aria-hidden="true">{{ number }}</span>
    <h2 :id="headingId"><slot /></h2>
  </div>
</template>
