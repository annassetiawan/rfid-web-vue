<template>
  <select
    v-bind="$attrs"
    :value="resolvedValue"
    class="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    @change="onChange"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue?: string | number | null
  value?: string | number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const resolvedValue = computed(() => props.modelValue ?? props.value ?? '')

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
