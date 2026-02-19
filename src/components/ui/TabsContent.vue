<template>
  <div v-show="isActive" class="mt-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { tabsInjectionKey, type TabsContext } from '@/components/ui/tabs'

const props = defineProps<{
  value: string
}>()

const context = inject<TabsContext>(tabsInjectionKey)

if (!context) {
  throw new Error('TabsContent must be used inside Tabs')
}

const isActive = computed(() => context.value.value === props.value)
</script>
