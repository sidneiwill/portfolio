<script setup lang="ts">
defineProps<{ headingId: string }>();
</script>

<template>
  <div class="section-heading">
    <h2 :id="headingId"><slot /></h2>
  </div>
</template>
