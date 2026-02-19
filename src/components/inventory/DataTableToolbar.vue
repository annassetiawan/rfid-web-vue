<template>
  <ListToolbar>
    <template #search>
      <div class="relative w-full max-w-[320px]">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :value="String(table.getColumn(searchColumnId)?.getFilterValue() ?? '')"
          type="search"
          :placeholder="searchPlaceholder"
          class="h-8 w-[320px] pl-9"
          @input="onSearchInput"
        />
      </div>
    </template>
    <template #actions>
      <Button variant="outline" :class="compactButtonClass" @click="$emit('openFilters')">
        <SlidersHorizontal class="h-4 w-4" />
        Filters
        <span
          v-if="(appliedFiltersCount ?? 0) > 0"
          class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground"
        >
          {{ appliedFiltersCount ?? 0 }}
        </span>
      </Button>

      <div class="relative">
        <Button variant="outline" :class="compactButtonClass" @click="viewOptionsOpen = !viewOptionsOpen">
          <TableProperties class="h-4 w-4" />
          View options
          <ChevronDown class="h-4 w-4" />
        </Button>
        <div
          v-if="viewOptionsOpen"
          class="absolute right-0 z-50 mt-2 min-w-52 rounded-lg border bg-card p-2 text-card-foreground shadow-md"
        >
          <div class="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">Toggle Columns</div>
          <label
            v-for="column in toggleableColumns"
            :key="column.id"
            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
          >
            <Checkbox
              :checked="column.getIsVisible()"
              @update:checked="(value) => column.toggleVisibility(!!value)"
            />
            <span>{{ labelFor(column.id) }}</span>
          </label>
          <template v-if="viewOptions.length > 0">
            <div class="my-1 border-t border-border" />
            <label
              v-for="option in viewOptions"
              :key="option.key"
              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                :checked="option.checked"
                @update:checked="(value) => emit('toggle:view-option', { key: option.key, value: !!value })"
              />
              <span>{{ option.label }}</span>
            </label>
          </template>
        </div>
      </div>

      <div class="relative">
        <Button variant="outline" :class="compactButtonClass" @click="densityOpen = !densityOpen">
          <SlidersHorizontal class="h-4 w-4" />
          Density: {{ densityLabel }}
          <ChevronDown class="h-4 w-4" />
        </Button>
        <div
          v-if="densityOpen"
          class="absolute right-0 z-50 mt-2 min-w-44 rounded-lg border bg-card p-2 text-card-foreground shadow-md"
        >
          <div class="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">Row Density</div>
          <button
            type="button"
            class="inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
            :class="density === 'compact' ? 'bg-muted' : ''"
            @click="setDensity('compact')"
          >
            Compact
          </button>
          <button
            type="button"
            class="mt-1 inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
            :class="density === 'comfortable' ? 'bg-muted' : ''"
            @click="setDensity('comfortable')"
          >
            Comfortable
          </button>
        </div>
      </div>

      <DropdownMenu>
        <template #trigger>
          <Button variant="outline" :class="compactButtonClass">
            <Download class="h-4 w-4" />
            Export Excel
            <ChevronDown class="h-4 w-4" />
          </Button>
        </template>
        <Button variant="ghost" size="sm" class="w-full justify-start" @click="$emit('exportCsv')">
          Export CSV
        </Button>
        <Button variant="ghost" size="sm" class="w-full justify-start" @click="$emit('exportExcel')">
          Export Excel
        </Button>
      </DropdownMenu>
    </template>
  </ListToolbar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Table } from '@tanstack/vue-table'
import { ChevronDown, Download, Search, SlidersHorizontal, TableProperties } from 'lucide-vue-next'
import ListToolbar from '@/components/list/ListToolbar.vue'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'
import Input from '@/components/ui/Input.vue'

type Density = 'comfortable' | 'compact'

const props = withDefaults(defineProps<{
  table: Table<any>
  density: Density
  appliedFiltersCount?: number
  searchColumnId?: string
  searchPlaceholder?: string
  viewOptions?: Array<{ key: string; label: string; checked: boolean }>
}>(), {
  searchColumnId: 'name',
  searchPlaceholder: 'Search name, serial, RFID, location...',
  viewOptions: () => [],
})

const emit = defineEmits<{
  openFilters: []
  exportCsv: []
  exportExcel: []
  'update:density': [value: Density]
  'toggle:view-option': [payload: { key: string; value: boolean }]
}>()

const compactButtonClass = computed(() => (props.density === 'compact' ? 'h-8 px-2 text-xs' : 'h-8'))
const densityLabel = computed(() => {
  if (props.density === 'compact') return 'Compact'
  return 'Comfortable'
})
const densityOpen = ref(false)
const viewOptionsOpen = ref(false)
const toggleableColumns = computed(() =>
  props.table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())
    .filter((column) => !(props.viewOptions.some((option) => option.key === 'showRowNumbers') && column.id === 'number')),
)

const labelFor = (id: string) => {
  if (id === 'serialNumber') return 'Serial Number'
  if (id === 'rfidCode') return 'RFID Code'
  if (id === 'inventoryStatus') return 'Inventory Status'
  if (id === 'taggedDate') return 'Tagged Date'
  return id.charAt(0).toUpperCase() + id.slice(1)
}

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.table.getColumn(props.searchColumnId)?.setFilterValue(target.value)
}

const setDensity = (value: Density) => {
  emit('update:density', value)
  densityOpen.value = false
}
</script>

