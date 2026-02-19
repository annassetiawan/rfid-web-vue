<template>
  <section class="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-foreground">{{ title }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ subtitle }}</p>
    </div>
    <Button v-if="actionLabel">{{ actionLabel }}</Button>
  </section>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'

defineProps<{
  title: string
  subtitle: string
  actionLabel?: string
}>()
</script>
