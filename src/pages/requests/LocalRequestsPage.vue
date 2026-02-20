<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
      <PageHeader :title="pageConfig.title" :description="pageConfig.description">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button @click="goToNewRequest">
              <Plus class="h-4 w-4" />
              Add New Request
            </Button>
            <Button variant="outline" @click="goToAdditionalDelivery">
              <SlidersHorizontal class="h-4 w-4" />
              Create Additional Delivery
            </Button>
          </div>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid gap-4 md:grid-cols-3">
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Total Requests</p>
              <p class="text-4xl font-semibold leading-none">{{ requestSummary.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <ListChecks class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All requests in current result set.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-4xl font-semibold leading-none">{{ requestSummary.inProgress }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <LoaderCircle class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Requests currently being processed.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Approved</p>
              <p class="text-4xl font-semibold leading-none">{{ requestSummary.approved }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Requests approved and ready for execution.</CardContent>
      </Card>
    </div>

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

    <Sheet v-model="detailOpen">
      <div v-if="selectedRequest" class="flex h-full flex-col gap-4">
        <div class="flex-1 space-y-5 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs uppercase tracking-wide text-muted-foreground">Request Detail</p>
                <p class="text-xl font-semibold leading-none">{{ selectedRequest.requestNumber }}</p>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline" :class="getRequestTypeBadgeClass(selectedRequest.requestType)">
                  {{ selectedRequest.requestType }}
                </Badge>
                <Badge variant="outline" :class="getRequestStatusBadgeClass(selectedRequest.status)">
                  {{ formatStatus(selectedRequest.status) }}
                </Badge>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 text-sm [&>div]:min-w-0">
              <div>
                <p class="text-xs uppercase tracking-wide text-muted-foreground">Ship From</p>
                <p class="font-medium">{{ selectedRequest.warehouse }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-muted-foreground">Service Level</p>
                <p class="font-medium">{{ selectedRequest.serviceLevel }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-muted-foreground">Request Type</p>
                <p class="font-medium">{{ selectedRequest.requestType }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-muted-foreground">Note</p>
                <p class="break-words font-medium">{{ getRequestNote(selectedRequest) }}</p>
              </div>
            </div>
          </section>

          <section class="space-y-2">
            <h3 class="text-lg font-semibold leading-none">Unit</h3>
            <div class="overflow-hidden rounded-lg border border-border/60">
              <div class="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
                <p class="font-medium">{{ getUnitMeta(selectedRequest).header }}</p>
                <p class="text-sm text-muted-foreground">{{ getUnitMeta(selectedRequest).category }}</p>
              </div>
              <div class="grid grid-cols-4 gap-3 border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
                <p>No</p>
                <p>Accessories</p>
                <p>RFID Label</p>
                <p>Type</p>
              </div>
              <div class="grid grid-cols-4 gap-3 px-4 py-3 text-sm">
                <p>1</p>
                <p>{{ getUnitMeta(selectedRequest).accessory }}</p>
                <p>{{ getUnitMeta(selectedRequest).rfidLabel }}</p>
                <div>
                  <Badge variant="outline" class="border-violet-200/70 bg-violet-50 text-violet-700">Mandatory</Badge>
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-2">
            <h3 class="text-lg font-semibold leading-none">Customer</h3>
            <div class="rounded-lg border border-border/60 p-4 text-sm">
              <div class="grid grid-cols-2 gap-4 [&>div]:min-w-0">
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Customer Company</p>
                  <p class="font-medium">{{ selectedRequest.companyName }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Zip Code</p>
                  <p class="font-medium">{{ getCustomerMeta(selectedRequest).zipCode }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Country</p>
                  <p class="font-medium">{{ getCustomerMeta(selectedRequest).country }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Contact Name</p>
                  <p class="font-medium">{{ getCustomerMeta(selectedRequest).contactName }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">City</p>
                  <p class="font-medium">{{ getCustomerMeta(selectedRequest).city }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Contact Email</p>
                  <p class="break-all font-medium">{{ getCustomerMeta(selectedRequest).contactEmail }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Address</p>
                  <p class="break-words font-medium">{{ getCustomerMeta(selectedRequest).address }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Contact Phone</p>
                  <p class="font-medium">{{ getCustomerMeta(selectedRequest).contactPhone }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-2">
            <h3 class="text-lg font-semibold leading-none">History</h3>
            <div class="space-y-3 rounded-lg border border-border/60 p-4">
              <div
                v-for="(item, index) in selectedTimeline"
                :key="item.time + item.label"
                class="flex gap-3 text-sm"
              >
                <div class="flex flex-col items-center">
                  <span class="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                  <span v-if="index < selectedTimeline.length - 1" class="h-8 w-px bg-border" />
                </div>
                <div>
                  <p class="font-medium">{{ item.label }}</p>
                  <p class="text-xs text-muted-foreground">{{ item.time }} · By {{ item.actor }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button variant="outline" @click="detailOpen = false">Close</Button>
          <Button @click="onEdit(selectedRequest)">Edit</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Request not found.</div>
    </Sheet>
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
import { CircleCheckBig, ListChecks, LoaderCircle, Plus, SlidersHorizontal } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import { createLocalRequestColumns, type LocalRequestTableRow } from '@/components/requests/columns'
import Badge from '@/components/ui/Badge.vue'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'
import { getAdminPageConfig } from '@/config/pages'
import { getRequestStatusBadgeClass } from '@/lib/requestBadges'
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
const detailOpen = ref(false)
const selectedRequest = ref<LocalRequestTableRow | null>(null)

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

const requestSummary = computed(() => ({
  total: filteredRows.value.length,
  inProgress: filteredRows.value.filter((row) => row.status === 'in-progress').length,
  approved: filteredRows.value.filter((row) => row.status === 'approved').length,
}))

const onView = (row: LocalRequestTableRow) => {
  selectedRequest.value = row
  detailOpen.value = true
}

const onEdit = (row: LocalRequestTableRow) => {
  router.push(`/requests/local/${row.id}/edit`)
}

const selectedTimeline = computed(() => (selectedRequest.value ? buildTimeline(selectedRequest.value) : []))

const getRequestTypeBadgeClass = (requestType: LocalRequestTableRow['requestType']) => {
  if (requestType === 'Tagging') return 'border bg-violet-50 text-violet-700 border-violet-200/70'
  if (requestType === 'Transfer') return 'border bg-blue-50 text-blue-700 border-blue-200/70'
  if (requestType === 'Retagging') return 'border bg-indigo-50 text-indigo-700 border-indigo-200/70'
  return 'border bg-amber-50 text-amber-700 border-amber-200/70'
}

const formatStatus = (status: string) => {
  return status
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const buildTimeline = (row: LocalRequestTableRow) => {
  return [
    { label: 'Packing list generated', time: `${row.createdDate} 19:21`, actor: 'apk' },
    { label: 'Invoice uploaded', time: `${row.requestDate} 18:30`, actor: 'apk' },
    { label: `Request processed`, time: `${row.requestDate} 17:05`, actor: 'kamal' },
  ]
}

const getRequestNote = (row: LocalRequestTableRow) => {
  if (row.serviceLevel === 'Express') return 'Urgent shipment - fast lane processing.'
  if (row.serviceLevel === 'Priority') return 'Priority shipment - handle with care.'
  return 'Standard shipment - follow regular flow.'
}

const getUnitMeta = (row: LocalRequestTableRow) => {
  return {
    header: `1. PAN-PA-M-${String(row.id).padStart(3, '0')} (SN${String(9000 + row.id)})`,
    category: row.requestType === 'Transfer' ? 'Transfer' : 'Accessories',
    accessory: row.requestType === 'Reprint' ? 'Reprint Label' : 'Power Cord',
    rfidLabel: `RFID-${String(100 + row.id)}`,
  }
}

const getCustomerMeta = (row: LocalRequestTableRow) => {
  const byWarehouse: Record<string, { zipCode: string; country: string; city: string; contactName: string; contactPhone: string }> = {
    'Warehouse A': { zipCode: '08589', country: 'South Korea', city: 'Seoul', contactName: 'Chaeun Seong', contactPhone: '+82-1062815221' },
    'Warehouse B': { zipCode: '30115', country: 'Indonesia', city: 'Jakarta', contactName: 'Rizal Mahendra', contactPhone: '+62-81122334455' },
    'Warehouse C': { zipCode: '70221', country: 'Singapore', city: 'Singapore', contactName: 'Nadia Putri', contactPhone: '+65-99887766' },
    'Dock 1': { zipCode: '45301', country: 'Japan', city: 'Osaka', contactName: 'Ayu Pratama', contactPhone: '+81-9087654321' },
    'Dock 2': { zipCode: '40012', country: 'Taiwan', city: 'Taipei', contactName: 'Kevin Hsi', contactPhone: '+886-912345678' },
    'Staging Area': { zipCode: '50210', country: 'Malaysia', city: 'Kuala Lumpur', contactName: 'Farhan Setiawan', contactPhone: '+60-123456789' },
    'Packing Zone': { zipCode: '11510', country: 'Thailand', city: 'Bangkok', contactName: 'Dina Salsabila', contactPhone: '+66-81234567' },
  }

  const fallback = { zipCode: '00000', country: '-', city: '-', contactName: '-', contactPhone: '-' }
  const detail = byWarehouse[row.warehouse] ?? fallback

  return {
    ...detail,
    contactEmail: `logistics@${row.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
    address: `1101-ho 11F Smartgate, 70 Gasan digital 2-ro, ${detail.city}`,
  }
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

const goToAdditionalDelivery = () => {
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
