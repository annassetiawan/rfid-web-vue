<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button class="absolute inset-0 bg-black/40" type="button" @click="close" />
    <div class="relative z-10 w-full max-w-lg rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  if (props.modelValue) {
    emit('update:modelValue', false)
  }
}
</script>
