<template>
  <Card class="rounded-lg">
    <CardHeader v-if="title || description" class="space-y-1.5">
      <h2 v-if="title" class="text-base font-semibold">{{ title }}</h2>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </CardHeader>
    <CardContent :class="contentClass">
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const contentClass = computed(() => (props.compact ? 'p-0' : 'space-y-4'))
</script>
