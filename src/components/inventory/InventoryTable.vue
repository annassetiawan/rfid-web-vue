<template>
  <Card>
    <CardHeader :class="density === 'compact' ? '!p-4' : ''">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="relative w-full max-w-md">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            :value="searchQuery"
            @input="onSearchInput"
            type="search"
            placeholder="Search name, serial number, RFID code..."
            class="pl-9"
          />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" :class="compactButtonClass" @click="$emit('update:filtersOpen', true)">
            Filters
          </Button>
          <InventoryColumnsMenu
            :columns="columnMenuItems"
            :density="density"
            @toggle="$emit('toggleColumn', $event)"
          />
          <Select :value="density" :class="compactSelectClass" @change="onDensityChange">
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </Select>
          <DropdownMenu>
            <template #trigger>
              <Button variant="outline" :class="compactButtonClass">
                Export
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
        </div>
      </div>
    </CardHeader>

    <CardContent :class="density === 'compact' ? '!p-4 !pt-0' : ''">
      <Table
        class="max-h-[460px] overflow-auto rounded-lg border [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-card"
      >
        <TableHeader>
          <TableRow>
            <TableHead v-for="column in activeColumns" :key="column.key">{{ column.label }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="rows.length === 0">
            <TableCell :colspan="activeColumns.length">
              <div class="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <PackageX class="h-8 w-8 text-muted-foreground" />
                <p class="text-sm font-medium">No results</p>
                <p class="text-sm text-muted-foreground">Try adjusting filters.</p>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-for="row in rows" :key="row.id" class="hover:bg-muted/40">
            <TableCell v-if="isVisible('name')"><div :class="rowClass">{{ row.name }}</div></TableCell>
            <TableCell v-if="isVisible('serialNumber')"><div :class="rowClass">{{ row.serialNumber }}</div></TableCell>
            <TableCell v-if="isVisible('rfidCode')"><div :class="rowClass">{{ row.rfidCode }}</div></TableCell>
            <TableCell v-if="isVisible('inventoryStatus')">
              <div :class="rowClass">
                <span :class="badgeScaleClass">
                  <Badge :variant="inventoryStatusVariant(row.inventoryStatus)">{{ row.inventoryStatus }}</Badge>
                </span>
              </div>
            </TableCell>
            <TableCell v-if="isVisible('location')"><div :class="rowClass">{{ row.location }}</div></TableCell>
            <TableCell v-if="isVisible('taggedDate')"><div :class="rowClass">{{ row.taggedDate }}</div></TableCell>
            <TableCell v-if="isVisible('status')">
              <div :class="rowClass">
                <span :class="badgeScaleClass">
                  <Badge :variant="row.status === 'active' ? 'default' : 'secondary'">{{ row.status }}</Badge>
                </span>
              </div>
            </TableCell>
            <TableCell v-if="isVisible('actions')">
              <div class="flex justify-end">
                <DropdownMenu>
                  <template #trigger>
                    <Button variant="ghost" :class="compactButtonClass">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </template>
                  <Button variant="ghost" size="sm" class="w-full justify-start" @click="$emit('view', row)">
                    View detail
                  </Button>
                  <Button variant="ghost" size="sm" class="w-full justify-start" @click="$emit('edit', row)">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" class="w-full justify-start" @click="$emit('archive', row)">
                    Archive
                  </Button>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select :value="String(pageSize)" class="w-[88px]" @change="onPageSizeChange">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <span>{{ startRow }}-{{ endRow }} of {{ filteredCount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" :class="compactButtonClass" :disabled="page <= 1" @click="$emit('setPage', page - 1)">
            Previous
          </Button>
          <Button variant="outline" :class="compactButtonClass" :disabled="page >= totalPages" @click="$emit('setPage', page + 1)">
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <InventoryFiltersSheet
    :model-value="filtersOpen"
    :filters="filters"
    :options="filterOptions"
    @update:model-value="$emit('update:filtersOpen', $event)"
    @apply="$emit('applyFilters', $event)"
    @clear="$emit('clearFilters')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, MoreHorizontal, PackageX, Search } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Table from '@/components/ui/Table.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableCell from '@/components/ui/TableCell.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableRow from '@/components/ui/TableRow.vue'
import InventoryColumnsMenu from './InventoryColumnsMenu.vue'
import InventoryFiltersSheet from './InventoryFiltersSheet.vue'
import type {
  Density,
  InventoryColumn,
  InventoryColumnKey,
  InventoryFilters,
  InventoryRow,
} from './useInventoryTable'

const props = defineProps<{
  rows: InventoryRow[]
  columns: InventoryColumn[]
  activeColumns: InventoryColumn[]
  density: Density
  searchQuery: string
  pageSize: number
  page: number
  totalPages: number
  totalRows: number
  filteredCount: number
  filters: InventoryFilters
  filterOptions: {
    inventoryStatus: string[]
    location: string[]
    condition: string[]
    stagingStatus: string[]
    warehouseLocation: string[]
  }
  visibleColumns: Record<InventoryColumnKey, boolean>
  filtersOpen: boolean
}>()

const emit = defineEmits<{
  'update:filtersOpen': [open: boolean]
  search: [query: string]
  toggleColumn: [key: InventoryColumnKey]
  setDensity: [value: Density]
  setPageSize: [value: number]
  setPage: [value: number]
  applyFilters: [filters: InventoryFilters]
  clearFilters: []
  exportCsv: []
  exportExcel: []
  view: [row: InventoryRow]
  edit: [row: InventoryRow]
  archive: [row: InventoryRow]
}>()

const compactButtonClass = computed(() => (props.density === 'compact' ? '!px-2 !py-1 !text-xs' : ''))
const compactSelectClass = computed(() => (props.density === 'compact' ? '!h-8 !text-xs' : 'w-[140px]'))
const rowClass = computed(() => (props.density === 'compact' ? 'py-2 text-xs' : 'py-3 text-sm'))
const badgeScaleClass = computed(() => (props.density === 'compact' ? 'inline-flex scale-95 origin-left' : 'inline-flex'))

const columnMenuItems = computed(() =>
  props.columns
    .filter((column) => column.hideable !== false)
    .map((column) => ({
      key: column.key,
      label: column.label,
      hideable: column.hideable,
      visible: props.visibleColumns[column.key],
    })),
)

const startRow = computed(() => (props.filteredCount === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const endRow = computed(() => Math.min(props.page * props.pageSize, props.filteredCount))

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}

const onDensityChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value as Density
  emit('setDensity', value)
}

const onPageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('setPageSize', Number(target.value))
}

const isVisible = (key: InventoryColumnKey) => props.visibleColumns[key]

const inventoryStatusVariant = (status: InventoryRow['inventoryStatus']) => {
  if (status === 'In Stock') return 'default'
  if (status === 'In Transit') return 'secondary'
  if (status === 'Reserved') return 'outline'
  return 'destructive'
}
</script>
