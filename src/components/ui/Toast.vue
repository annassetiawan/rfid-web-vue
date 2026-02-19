<template>
  <div
    class="w-full max-w-sm rounded-md border bg-card p-4 text-card-foreground shadow-lg"
    :class="variant === 'destructive' ? 'border-destructive/50' : 'border-border'"
    role="status"
  >
    <p class="text-sm font-semibold">{{ title }}</p>
    <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    variant?: 'default' | 'destructive'
  }>(),
  {
    variant: 'default',
  },
)
</script>
