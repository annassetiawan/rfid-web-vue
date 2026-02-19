<template>
  <Sheet :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="flex h-full flex-col gap-5">
      <div>
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </div>

      <div class="grid gap-4 overflow-y-auto pr-1">
        <slot />
      </div>

      <div class="mt-auto flex items-center justify-end gap-2 border-t pt-4">
        <Button variant="secondary" @click="$emit('reset')">{{ resetLabel }}</Button>
        <Button @click="$emit('apply')">{{ applyLabel }}</Button>
      </div>
    </div>
  </Sheet>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Sheet from '@/components/ui/Sheet.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    applyLabel?: string
    resetLabel?: string
  }>(),
  {
    title: 'Filters',
    description: '',
    applyLabel: 'Apply',
    resetLabel: 'Reset',
  },
)

defineEmits<{
  'update:modelValue': [value: boolean]
  apply: []
  reset: []
}>()
</script>
