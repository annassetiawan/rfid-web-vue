<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
      <PageHeader :title="pageConfig.title" :description="pageConfig.description">
        <template #actions>
          <Button @click="goToNewRequest">New Request</Button>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <ListCard title="Local Requests" description="Monitor and manage submitted local requests across all warehouses." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search request number, company, warehouse..."
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
        table-class="min-w-[1120px]"
        empty-title="No requests found"
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
      description="Apply advanced request filters."
      reset-label="Reset"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Request Number</label>
        <Input :value="draftFilters.requestNumber" @input="onInputChange('requestNumber', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Warehouse</label>
        <Select :value="draftFilters.warehouse" @change="onSelectChange('warehouse', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.warehouse" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Company Name</label>
        <Select :value="draftFilters.companyName" @change="onSelectChange('companyName', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.companyName" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Request Type</label>
        <Select :value="draftFilters.requestType" @change="onSelectChange('requestType', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.requestType" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Service Level</label>
        <Select :value="draftFilters.serviceLevel" @change="onSelectChange('serviceLevel', $event)">
          <option value="">All</option>
          <option v-for="item in filterOptions.serviceLevel" :key="item" :value="item">{{ item }}</option>
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
import { useRouter } from 'vue-router'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import { createLocalRequestColumns, type LocalRequestTableRow } from '@/components/requests/columns'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import { getAdminPageConfig } from '@/config/pages'
import { valueUpdater } from '@/lib/utils'
import { localRequestsMock } from '@/mock/requests'

type Density = 'compact' | 'comfortable'

type RequestFilters = {
  requestNumber: string
  warehouse: string
  companyName: string
  requestType: string
  serviceLevel: string
  status: string
  createdDateFrom: string
  createdDateTo: string
}

const DENSITY_STORAGE_KEY = 'table-density:local-requests'
const VIEW_STORAGE_KEY = 'table-view:local-requests'

const router = useRouter()
const pageConfig = getAdminPageConfig('requests') ?? {
  title: 'Requests',
  description: 'Track and process local RFID requests from operations teams.',
  primaryAction: { label: 'New Request', route: '/requests/local/new' },
}

const baseRows = localRequestsMock
const density = ref<Density>(loadDensity())
const wrapText = ref(false)
const showRowNumbers = ref(true)
const filtersOpen = ref(false)

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const filters = reactive<RequestFilters>({
  requestNumber: '',
  warehouse: '',
  companyName: '',
  requestType: '',
  serviceLevel: '',
  status: '',
  createdDateFrom: '',
  createdDateTo: '',
})

const draftFilters = reactive<RequestFilters>({
  requestNumber: '',
  warehouse: '',
  companyName: '',
  requestType: '',
  serviceLevel: '',
  status: '',
  createdDateFrom: '',
  createdDateTo: '',
})

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false

const filterOptions = computed(() => ({
  warehouse: Array.from(new Set(baseRows.map((item) => item.warehouse))),
  companyName: Array.from(new Set(baseRows.map((item) => item.companyName))),
  requestType: Array.from(new Set(baseRows.map((item) => item.requestType))),
  serviceLevel: Array.from(new Set(baseRows.map((item) => item.serviceLevel))),
  status: Array.from(new Set(baseRows.map((item) => item.status))),
}))

const filteredRows = computed<LocalRequestTableRow[]>(() => {
  return baseRows
    .filter((row) => {
      if (filters.requestNumber && !row.requestNumber.toLowerCase().includes(filters.requestNumber.toLowerCase())) return false
      if (filters.warehouse && row.warehouse !== filters.warehouse) return false
      if (filters.companyName && row.companyName !== filters.companyName) return false
      if (filters.requestType && row.requestType !== filters.requestType) return false
      if (filters.serviceLevel && row.serviceLevel !== filters.serviceLevel) return false
      if (filters.status && row.status !== filters.status) return false
      if (filters.createdDateFrom && row.createdDate < filters.createdDateFrom) return false
      if (filters.createdDateTo && row.createdDate > filters.createdDateTo) return false
      return true
    })
    .map((row) => ({
      ...row,
      searchText: `${row.requestNumber} ${row.companyName} ${row.warehouse}`.toLowerCase(),
    }))
})

const appliedFiltersCount = computed(() => {
  let count = 0
  if (filters.requestNumber) count += 1
  if (filters.warehouse) count += 1
  if (filters.companyName) count += 1
  if (filters.requestType) count += 1
  if (filters.serviceLevel) count += 1
  if (filters.status) count += 1
  if (filters.createdDateFrom || filters.createdDateTo) count += 1
  return count
})

const onView = (row: LocalRequestTableRow) => {
  router.push(`/requests/local/${row.id}`)
}

const onEdit = (row: LocalRequestTableRow) => {
  router.push(`/requests/local/${row.id}/edit`)
}

const columns = computed<ColumnDef<LocalRequestTableRow>[]>(() => createLocalRequestColumns({ onView, onEdit }))

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
    if (isOpen) {
      Object.assign(draftFilters, filters)
    }
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

const goToNewRequest = () => {
  router.push(pageConfig.primaryAction.route)
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
    requestNumber: '',
    warehouse: '',
    companyName: '',
    requestType: '',
    serviceLevel: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
  })
  Object.assign(filters, draftFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const onSelectChange = (key: keyof RequestFilters, event: Event) => {
  const target = event.target as HTMLSelectElement
  draftFilters[key] = target.value
}

const onInputChange = (key: keyof RequestFilters, event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Request Number', 'Warehouse', 'Company Name', 'Request Type', 'Service Level', 'Status', 'Created Date']
  const body = rows.map((row) => [
    row.requestNumber,
    row.warehouse,
    row.companyName,
    row.requestType,
    row.serviceLevel,
    row.status,
    row.createdDate,
  ])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `local-requests-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const onExportExcel = () => {
  console.log('Export Excel (stub) clicked')
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
    showRowNumbers.value = parsed.showRowNumbers ?? true
  } catch {
    wrapText.value = false
    showRowNumbers.value = true
  }
}
</script>
