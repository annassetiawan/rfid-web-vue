<template>
  <nav class="space-y-6">
    <div v-for="group in groupedItems" :key="group.name" class="space-y-1.5">
      <p class="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {{ group.name }}
      </p>
      <RouterLink
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        class="group relative flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm transition"
        :class="isActive(item.to) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'"
      >
        <span
          class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary transition-opacity"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'"
        />
        <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink } from 'vue-router'

export type SidebarNavItem = {
  label: string
  icon?: Component
  to: string
  group?: string
}

const props = defineProps<{
  items: SidebarNavItem[]
  activePath?: string
}>()

const groupedItems = computed(() => {
  const map = new Map<string, SidebarNavItem[]>()

  for (const item of props.items) {
    const group = item.group ?? 'General'
    if (!map.has(group)) {
      map.set(group, [])
    }
    map.get(group)?.push(item)
  }

  return Array.from(map.entries()).map(([name, items]) => ({ name, items }))
})

const isActive = (to: string) => {
  if (!props.activePath) return false
  return props.activePath === to || props.activePath.startsWith(`${to}/`)
}
</script>
