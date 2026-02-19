<template>
  <Button
    variant="ghost"
    size="sm"
    class="h-7 rounded-md px-3 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    :data-state="isActive ? 'active' : 'inactive'"
    @click="setValue(value)"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Button from '@/components/ui/Button.vue'
import { tabsInjectionKey, type TabsContext } from '@/components/ui/tabs'

const props = defineProps<{
  value: string
}>()

const context = inject<TabsContext>(tabsInjectionKey)

if (!context) {
  throw new Error('TabsTrigger must be used inside Tabs')
}

const isActive = computed(() => context.value.value === props.value)

const setValue = (next: string) => {
  context.setValue(next)
}
</script>
