<template>
  <input
    v-bind="$attrs"
    :value="resolvedValue"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    @input="onInput"
  />
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

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
