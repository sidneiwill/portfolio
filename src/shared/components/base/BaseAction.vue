<script setup lang="ts">
type ActionVariant = "primary" | "secondary";

const props = withDefaults(
  defineProps<{
    href?: string;
    type?: "button" | "submit" | "reset";
    variant?: ActionVariant;
  }>(),
  {
    href: undefined,
    type: "button",
    variant: "secondary",
  },
);
</script>

<template>
  <component
    :is="props.href === undefined ? 'button' : 'a'"
    :href="props.href"
    :type="props.href === undefined ? props.type : undefined"
    class="base-action"
    :class="`base-action--${props.variant}`"
  >
    <slot />
  </component>
</template>
