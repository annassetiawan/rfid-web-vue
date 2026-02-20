<template>
  <div class="h-screen bg-background text-foreground">
    <div class="flex h-screen">
      <aside
        class="hidden shrink-0 border-r border-border bg-card transition-[width] duration-200 lg:flex lg:flex-col"
        :class="isSidebarCollapsed ? 'w-20' : 'w-72'"
      >
        <div
          class="flex h-16 items-center border-b border-border"
          :class="isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'"
        >
          <div :class="isSidebarCollapsed ? 'text-center' : ''">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {{ isSidebarCollapsed ? 'RF' : 'RFID Web' }}
            </p>
            <p v-if="!isSidebarCollapsed" class="mt-1 text-lg font-semibold">Dashboard</p>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto py-5" :class="isSidebarCollapsed ? 'px-2' : 'px-4'">
          <div v-for="group in groupedItems" :key="group.name" class="mb-6">
            <p
              v-if="!isSidebarCollapsed"
              class="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {{ group.name }}
            </p>
            <ul class="space-y-1">
              <li v-for="item in group.items" :key="item.to">
                <RouterLink
                  :to="item.to"
                  class="flex items-center rounded-md px-3 py-2 text-sm transition"
                  :class="[
                    isSidebarCollapsed ? 'justify-center' : 'gap-3',
                    isActive(item.to)
                      ? 'border border-primary/20 bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                  :title="item.label"
                >
                  <component :is="item.icon" class="h-4 w-4 shrink-0" />
                  <span v-if="!isSidebarCollapsed">{{ item.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="h-16 border-b border-border bg-background">
          <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div class="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                class="hidden lg:inline-flex"
                :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                @click="isSidebarCollapsed = !isSidebarCollapsed"
              >
                <PanelLeft class="h-4 w-4" />
              </Button>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays class="h-3.5 w-3.5" />
                  <span>{{ headerDate }}</span>
                  <Clock3 class="h-3.5 w-3.5" />
                  <span>{{ headerTime }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <CircleHelp class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" class="relative h-8 w-8">
                <Bell class="h-4 w-4" />
                <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </Button>
              <Separator orientation="vertical" class="mx-1 hidden h-6 sm:block" />
              <div class="hidden items-center gap-2 sm:flex">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  DU
                </div>
                <div class="text-xs leading-tight">
                  <p class="font-medium text-foreground">demo user</p>
                  <p class="text-muted-foreground">Admin Eval</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto overflow-x-hidden">
          <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Clock3,
  Gauge,
  Handshake,
  LifeBuoy,
  Mail,
  PanelLeft,
  QrCode,
  ScanLine,
  Search as SearchIcon,
  Settings2,
  UserCog,
  Warehouse,
} from 'lucide-vue-next'
import Button from '../components/ui/Button.vue'
import Separator from '../components/ui/Separator.vue'

type SidebarItem = {
  label: string
  icon: Component
  to: string
  group: 'Operations' | 'Master Data' | 'Settings/Support'
}

const sidebarItems: SidebarItem[] = [
  { label: 'Overview', icon: Gauge, to: '/dashboard/overview', group: 'Operations' },
  { label: 'Request', icon: ClipboardList, to: '/requests/local', group: 'Operations' },
  { label: 'Inventory', icon: Boxes, to: '/inventory', group: 'Operations' },
  { label: 'Cycle Count', icon: QrCode, to: '/cycle-count', group: 'Operations' },
  { label: 'Customers', icon: Handshake, to: '/customers', group: 'Operations' },
  { label: 'Warehouses', icon: Warehouse, to: '/warehouses', group: 'Operations' },
  { label: 'Scanner', icon: ScanLine, to: '/scanner', group: 'Operations' },
  { label: 'Search', icon: SearchIcon, to: '/search', group: 'Operations' },
  { label: 'Units', icon: Building2, to: '/master-data/units', group: 'Master Data' },
  { label: 'Unit Relation', icon: Settings2, to: '/master-data/unit-relation', group: 'Master Data' },
  { label: 'Users', icon: UserCog, to: '/users', group: 'Settings/Support' },
  { label: 'Logistic Email', icon: Mail, to: '/logistic-email', group: 'Settings/Support' },
  { label: 'Support Center', icon: LifeBuoy, to: '/support-center', group: 'Settings/Support' },
]

const route = useRoute()
const isSidebarCollapsed = ref(false)
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

const headerDate = computed(() =>
  now.value.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
)

const headerTime = computed(() =>
  now.value.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }),
)

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const groupedItems = computed(() => {
  const groups: SidebarItem['group'][] = ['Operations', 'Master Data', 'Settings/Support']
  return groups.map((name) => ({
    name,
    items: sidebarItems.filter((item) => item.group === name),
  }))
})

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>
