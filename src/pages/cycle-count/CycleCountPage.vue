<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cycle Count</p>
      <PageHeader :title="pageConfig.title" :description="pageConfig.description">
        <template #actions>
          <Button @click="openRequestDialog">
            <Plus class="h-4 w-4" />
            Request Cycle Count
          </Button>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid gap-4 md:grid-cols-3">
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Total Sessions</p>
              <p class="text-4xl font-semibold leading-none">{{ summary.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <ListChecks class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All cycle count sessions in current result set.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-4xl font-semibold leading-none">{{ summary.inProgress }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <LoaderCircle class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Sessions with active scanning progress.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Completed</p>
              <p class="text-4xl font-semibold leading-none">{{ summary.completed }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Sessions fully processed and closed.</CardContent>
      </Card>
    </div>

    <ListCard compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search cycle count ID, operator, warehouse..."
        :view-options="[
          { key: 'wrapText', label: 'Wrap text', checked: wrapText },
          { key: 'showRowNumbers', label: 'Show row numbers', checked: showRowNumbers },
        ]"
        @open-filters="filtersOpen = true"
        @toggle:view-option="onToggleViewOption"
        @update:density="onDensityChange"
        @export-csv="onExportCsv"
        @export-excel="onExportExcel"
      />

      <p class="px-4 pb-2 text-sm text-muted-foreground">{{ table.getFilteredRowModel().rows.length }} results</p>

      <DataTable
        :table="table"
        :density="density"
        :wrap-text="wrapText"
        empty-title="No cycle count sessions found"
        empty-description="Try adjusting filters."
      />

      <DataTablePagination
        :table="table"
        :density="density"
        :total-rows="table.getFilteredRowModel().rows.length"
      />
    </ListCard>

    <FilterSheet
      v-model="filtersOpen"
      title="Filters"
      description="Apply cycle count filters."
      reset-label="Reset"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">ID</label>
        <Input :value="draftFilters.countId" @input="onInputChange('countId', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Category</label>
        <Select :value="draftFilters.category" @change="onSelectChange('category', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.category" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Operator</label>
        <Select :value="draftFilters.operator" @change="onSelectChange('operator', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.operator" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Warehouse</label>
        <Select :value="draftFilters.warehouse" @change="onSelectChange('warehouse', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.warehouse" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Status</label>
        <Select :value="draftFilters.status" @change="onSelectChange('status', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.status" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Created Date From</label>
          <Input :value="draftFilters.createdDateFrom" type="date" @input="onInputChange('createdDateFrom', $event)" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Created Date To</label>
          <Input :value="draftFilters.createdDateTo" type="date" @input="onInputChange('createdDateTo', $event)" />
        </div>
      </div>
    </FilterSheet>

    <Dialog v-model="requestDialogOpen">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">Request Cycle Count</h2>
            <p class="mt-1 text-sm text-muted-foreground">Create a new cycle count session for warehouse operations.</p>
          </div>
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="requestDialogOpen = false">
            <X class="h-4 w-4" />
          </Button>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Warehouse</label>
          <Select v-model="requestForm.warehouse">
            <option value="">Select warehouse</option>
            <option v-for="item in filterOptions.warehouse" :key="item" :value="item">{{ item }}</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Category</label>
          <Select v-model="requestForm.category">
            <option value="">Select category</option>
            <option value="Product">Product</option>
            <option value="Accessory">Accessory</option>
            <option value="All">All</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Notes (optional)</label>
          <Textarea v-model="requestForm.notes" rows="3" placeholder="Add notes for this request" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Assign Operator (optional)</label>
          <Select v-model="requestForm.operator">
            <option value="">Unassigned</option>
            <option v-for="item in filterOptions.operator" :key="item" :value="item">{{ item }}</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Start Date (optional)</label>
          <Input v-model="requestForm.startDate" type="date" />
        </div>

        <p v-if="requestFormError" class="text-sm text-destructive">{{ requestFormError }}</p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" @click="requestDialogOpen = false">Cancel</Button>
          <Button @click="onCreateCycleCountRequest">Create</Button>
        </div>
      </div>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useVueTable,
} from '@tanstack/vue-table'
import { CircleCheckBig, ListChecks, LoaderCircle, Plus, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { createCycleCountColumns, type CycleCountTableRow } from '@/components/cycle-count/columns'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { getAdminPageConfig } from '@/config/pages'
import type { CycleCountStatus } from '@/mock/cycleCount'
import { cycleCountMock } from '@/mock/cycleCount'
import { valueUpdater } from '@/lib/utils'

type Density = 'compact' | 'comfortable'
type CycleCountFilters = {
  countId: string
  category: string
  operator: string
  warehouse: string
  status: string
  createdDateFrom: string
  createdDateTo: string
}

const DENSITY_STORAGE_KEY = 'table-density:cycle-count'
const VIEW_STORAGE_KEY = 'table-view:cycle-count'

const router = useRouter()
const pageConfig = getAdminPageConfig('cycle-count') ?? {
  title: 'Cycle Count',
  description: 'Track inventory audit sessions and scan progress.',
  primaryAction: { label: 'Request Cycle Count', route: '/cycle-count/new' },
}

const baseRows = ref(cycleCountMock)
const density = ref<Density>(loadDensity())
const wrapText = ref(false)
const showRowNumbers = ref(false)
const filtersOpen = ref(false)
const requestDialogOpen = ref(false)
const requestFormError = ref('')

const requestForm = reactive({
  warehouse: '',
  category: '',
  notes: '',
  operator: '',
  startDate: '',
})

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const filters = reactive<CycleCountFilters>({
  countId: '',
  category: '',
  operator: '',
  warehouse: '',
  status: '',
  createdDateFrom: '',
  createdDateTo: '',
})

const draftFilters = reactive<CycleCountFilters>({
  countId: '',
  category: '',
  operator: '',
  warehouse: '',
  status: '',
  createdDateFrom: '',
  createdDateTo: '',
})

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false

const filterOptions = computed(() => ({
  category: Array.from(new Set(baseRows.value.map((item) => item.category))),
  operator: Array.from(new Set(baseRows.value.map((item) => item.operator))),
  warehouse: Array.from(new Set(baseRows.value.map((item) => item.warehouse))),
  status: Array.from(new Set(baseRows.value.map((item) => item.status))),
}))

const filteredRows = computed<CycleCountTableRow[]>(() => {
  return baseRows.value
    .filter((row) => {
      if (filters.countId && !row.countId.toLowerCase().includes(filters.countId.toLowerCase())) return false
      if (filters.category && row.category !== filters.category) return false
      if (filters.operator && row.operator !== filters.operator) return false
      if (filters.warehouse && row.warehouse !== filters.warehouse) return false
      if (filters.status && row.status !== filters.status) return false
      if (filters.createdDateFrom && row.createdDate < filters.createdDateFrom) return false
      if (filters.createdDateTo && row.createdDate > filters.createdDateTo) return false
      return true
    })
    .map((row) => ({
      ...row,
      searchText: `${row.countId} ${row.operator} ${row.warehouse}`.toLowerCase(),
    }))
})

const summary = computed(() => ({
  total: filteredRows.value.length,
  inProgress: filteredRows.value.filter((row) => row.status === 'In Progress').length,
  completed: filteredRows.value.filter((row) => row.status === 'Processed').length,
}))

const appliedFiltersCount = computed(() => {
  let count = 0
  if (filters.countId) count += 1
  if (filters.category) count += 1
  if (filters.operator) count += 1
  if (filters.warehouse) count += 1
  if (filters.status) count += 1
  if (filters.createdDateFrom || filters.createdDateTo) count += 1
  return count
})

const onView = (row: CycleCountTableRow) => {
  router.push(`/cycle-count/${row.id}`)
}

const onStart = (row: CycleCountTableRow) => {
  baseRows.value = baseRows.value.map((item) => (
    item.id === row.id
      ? { ...item, status: 'In Progress' as CycleCountStatus }
      : item
  ))
}

const onClose = (row: CycleCountTableRow) => {
  baseRows.value = baseRows.value.map((item) => (
    item.id === row.id
      ? { ...item, status: 'Cancelled' as CycleCountStatus }
      : item
  ))
}

const columns = computed<ColumnDef<CycleCountTableRow>[]>(() => createCycleCountColumns({ onView, onStart, onClose }))

const table = useVueTable({
  get data() {
    return filteredRows.value
  },
  get columns() {
    return columns.value
  },
  state: {
    get rowSelection() {
      return rowSelection.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onRowSelectionChange: (updater) => valueUpdater(updater, rowSelection),
  onColumnVisibilityChange: (updater) => valueUpdater(updater, columnVisibility),
  onColumnFiltersChange: (updater) => valueUpdater(updater, columnFilters),
  onSortingChange: (updater) => valueUpdater(updater, sorting),
  onPaginationChange: (updater) => valueUpdater(updater, pagination),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

watch(
  () => filtersOpen.value,
  (isOpen) => {
    if (isOpen) Object.assign(draftFilters, filters)
  },
)

watch(
  () => density.value,
  (value) => {
    localStorage.setItem(DENSITY_STORAGE_KEY, value)
  },
)

watch(
  () => [wrapText.value, showRowNumbers.value],
  () => {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ wrapText: wrapText.value, showRowNumbers: showRowNumbers.value }))
  },
)

const openRequestDialog = () => {
  requestFormError.value = ''
  requestForm.warehouse = ''
  requestForm.category = ''
  requestForm.notes = ''
  requestForm.operator = ''
  requestForm.startDate = ''
  requestDialogOpen.value = true
}

const onDensityChange = (value: Density) => {
  density.value = value
}

const onToggleViewOption = (payload: { key: string; value: boolean }) => {
  if (payload.key === 'wrapText') {
    wrapText.value = payload.value
    return
  }

  if (payload.key === 'showRowNumbers') {
    showRowNumbers.value = payload.value
    table.getColumn('number')?.toggleVisibility(payload.value)
  }
}

const applyFilters = () => {
  Object.assign(filters, draftFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const resetFilters = () => {
  Object.assign(draftFilters, {
    countId: '',
    category: '',
    operator: '',
    warehouse: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
  })
  Object.assign(filters, draftFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const onSelectChange = (key: keyof CycleCountFilters, event: Event) => {
  const target = event.target as HTMLSelectElement
  draftFilters[key] = target.value
}

const onInputChange = (key: keyof CycleCountFilters, event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['ID', 'Category', 'Created Date', 'Operator', 'Warehouse', 'Status']
  const body = rows.map((row) => [
    row.countId,
    row.category,
    row.createdDate,
    row.operator,
    row.warehouse,
    row.status,
  ])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cycle-count-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const onExportExcel = () => {
  console.log('Export Excel (stub) clicked')
}

const onCreateCycleCountRequest = () => {
  if (!requestForm.warehouse || !requestForm.category) {
    requestFormError.value = 'Warehouse and category are required.'
    return
  }

  const maxNumericId = baseRows.value.reduce((max, row) => {
    const number = Number(row.countId.split('-').pop() ?? '0')
    return number > max ? number : max
  }, 0)
  const nextNumericId = maxNumericId + 1

  const nextRow = {
    id: baseRows.value.length + 1,
    countId: `CC-2026-${String(nextNumericId).padStart(3, '0')}`,
    category: requestForm.category as 'Product' | 'Accessory' | 'All',
    createdDate: requestForm.startDate || new Date().toISOString().slice(0, 10),
    operator: requestForm.operator || 'Unassigned',
    warehouse: requestForm.warehouse,
    status: 'New' as CycleCountStatus,
  }

  baseRows.value = [nextRow, ...baseRows.value]
  requestDialogOpen.value = false
  requestFormError.value = ''
}

function loadDensity(): Density {
  const value = localStorage.getItem(DENSITY_STORAGE_KEY)
  if (value === 'compact' || value === 'comfortable') return value
  return 'comfortable'
}

function loadViewState() {
  const raw = localStorage.getItem(VIEW_STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as { wrapText?: boolean; showRowNumbers?: boolean }
    wrapText.value = parsed.wrapText ?? false
    showRowNumbers.value = parsed.showRowNumbers ?? false
  } catch {
    wrapText.value = false
    showRowNumbers.value = false
  }
}
</script>
