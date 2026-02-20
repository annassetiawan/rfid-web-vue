<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="h-8 w-8">
        <MoreHorizontal class="h-4 w-4" />
        <span class="sr-only">Open row actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        side="bottom"
        align="end"
        :side-offset="6"
        class="z-[120] min-w-[10rem] rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <DropdownMenuItem
          v-for="action in actions"
          :key="action.key"
          class="relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          :class="action.destructive ? 'text-destructive data-[highlighted]:text-destructive' : ''"
          @select.prevent="$emit('select', action.key)"
        >
          {{ action.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { MoreHorizontal } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

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
