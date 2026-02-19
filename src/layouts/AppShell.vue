<template>
  <div class="min-h-screen bg-muted/30 text-foreground">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r bg-card md:flex md:flex-col">
        <div class="border-b px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            RFID Web
          </p>
          <p class="mt-1 text-lg font-semibold">Admin System</p>
        </div>
        <div class="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav :items="items" :active-path="activePath" />
        </div>
        <div class="space-y-3 border-t px-5 py-4">
          <Button variant="outline" class="w-full justify-center">Support</Button>
          <p class="text-xs text-muted-foreground">v0.1 internal dashboard</p>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <Topbar :title="title" @toggle-menu="mobileOpen = true" />
        <main class="flex-1 p-4 sm:p-6">
          <div class="mx-auto w-full max-w-7xl">
            <slot />
          </div>
        </main>
      </div>
    </div>

    <Sheet v-model="mobileOpen">
      <div class="space-y-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            RFID Web
          </p>
          <p class="mt-1 text-lg font-semibold">Admin System</p>
        </div>
        <Separator />
        <SidebarNav :items="items" :active-path="activePath" />
      </div>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SidebarNavItem } from '@/components/layout/SidebarNav.vue'
import SidebarNav from '@/components/layout/SidebarNav.vue'
import Topbar from '@/components/layout/Topbar.vue'
import Button from '@/components/ui/Button.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'

withDefaults(
  defineProps<{
    items: SidebarNavItem[]
    activePath: string
    title?: string
  }>(),
  {
    title: 'Dashboard',
  },
)

const mobileOpen = ref(false)
</script>
