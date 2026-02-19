<template>
  <input
    type="checkbox"
    :checked="checked"
    class="h-4 w-4 rounded border border-input bg-background text-primary accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    @change="onChange"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  checked?: boolean
}>()

const emit = defineEmits<{
  'update:checked': [value: boolean]
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:checked', target.checked)
}
</script>
