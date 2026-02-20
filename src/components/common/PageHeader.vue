<template>
  <section class="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-foreground">{{ title }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ subtitle }}</p>
    </div>
    <Button v-if="actionLabel">
      <Plus v-if="showActionIcon" class="h-4 w-4" />
      {{ actionLabel }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import Button from '../ui/Button.vue'

const props = defineProps<{
  title: string
  subtitle: string
  actionLabel?: string
}>()

const showActionIcon = computed(() => {
  const label = (props.actionLabel ?? '').toLowerCase()
  return /(add|create|new|invite|compose|request|connect)/.test(label)
})
</script>
