<template>
  <DropdownMenu>
    <template #trigger>
      <Button variant="ghost" size="icon" class="h-8 w-8">
        <MoreHorizontal class="h-4 w-4" />
        <span class="sr-only">Open row actions</span>
      </Button>
    </template>
    <Button
      v-for="action in actions"
      :key="action.key"
      variant="ghost"
      size="sm"
      class="w-full justify-start"
      :class="action.destructive ? 'text-destructive hover:text-destructive' : ''"
      @click="$emit('select', action.key)"
    >
      {{ action.label }}
    </Button>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'

export type RowActionItem = {
  key: string
  label: string
  destructive?: boolean
}

defineProps<{
  actions: RowActionItem[]
}>()

defineEmits<{
  select: [key: string]
}>()
</script>
