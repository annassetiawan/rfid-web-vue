<template>
  <div
    :class="orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'"
    class="shrink-0 bg-border"
    role="separator"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'horizontal',
  },
)
</script>
