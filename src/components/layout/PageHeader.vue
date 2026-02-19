<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">
          {{ title }}
        </h1>
        <p v-if="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
        <div v-if="$slots.meta" class="text-xs text-muted-foreground">
          <slot name="meta" />
        </div>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <Separator />
  </section>
</template>

<script setup lang="ts">
import Separator from '@/components/ui/Separator.vue'

defineProps<{
  title: string
  description?: string
}>()
</script>
