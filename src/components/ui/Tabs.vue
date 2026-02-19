<template>
  <div class="w-full">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { tabsInjectionKey, type TabsContext } from '@/components/ui/tabs'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = computed(() => props.modelValue)

const setValue = (next: string) => {
  emit('update:modelValue', next)
}

provide<TabsContext>(tabsInjectionKey, {
  value,
  setValue,
})
</script>
