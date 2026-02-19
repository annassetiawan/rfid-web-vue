<template>
  <DropdownMenu>
    <template #trigger>
      <Button variant="outline" :class="buttonClass">
        Columns
        <ChevronDown class="h-4 w-4" />
      </Button>
    </template>
    <div class="space-y-1">
      <label
        v-for="column in columns"
        :key="column.key"
        class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
      >
        <Checkbox
          :checked="column.visible"
          :disabled="column.hideable === false"
          @update:checked="$emit('toggle', column.key)"
        />
        <span :class="column.hideable === false ? 'text-muted-foreground' : ''">
          {{ column.label }}
        </span>
      </label>
    </div>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'
import type { Density, InventoryColumnKey } from './useInventoryTable'

defineEmits<{
  toggle: [key: InventoryColumnKey]
}>()

const props = defineProps<{
  columns: Array<{
    key: InventoryColumnKey
    label: string
    visible: boolean
    hideable?: boolean
  }>
  density: Density
}>()

const buttonClass = computed(() => (props.density === 'compact' ? '!px-2 !py-1 !text-xs' : ''))
</script>
