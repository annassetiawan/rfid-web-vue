<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[90] bg-black/35"
      @click="close"
    />
  </Transition>

  <Transition
    enter-active-class="transform transition duration-250 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transform transition duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <aside
      v-if="modelValue"
      class="fixed right-0 top-0 z-[100] h-full w-[400px] max-w-full border-0 bg-card p-6 text-card-foreground shadow-lg"
    >
      <slot />
    </aside>
  </Transition>
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
