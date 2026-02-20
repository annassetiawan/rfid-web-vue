<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Warehouses</p>
      <PageHeader :title="pageConfig.title" :description="pageConfig.description">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="onExportCsv">
              Export
            </Button>
            <Button @click="openCreate">
              <Plus class="h-4 w-4" />
              Add New Warehouse
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
              <p class="text-sm text-muted-foreground">Total Warehouses</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Warehouse class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All warehouse hubs in master data.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Active</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.active }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Warehouses available for operations.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Inactive</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.inactive }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CirclePause class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Warehouses currently not in use.</CardContent>
      </Card>
    </div>

    <ListCard title="Warehouse List" description="Manage warehouse hubs and shipping origins used across requests." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search warehouse, code, city, country..."
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
        empty-title="No warehouses found"
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
      title="Warehouse Filters"
      description="Refine warehouse list by location, code, status, and created date."
      reset-label="Clear"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Code</label>
        <Input :value="draftFilters.code" @input="onInputChange('code', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Country</label>
        <Select :value="draftFilters.country" @change="onSelectChange('country', $event)">
          <option value="all">All</option>
          <option v-for="item in countryOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">State</label>
        <Input :value="draftFilters.state" @input="onInputChange('state', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">City</label>
        <Input :value="draftFilters.city" @input="onInputChange('city', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Zip Code</label>
        <Input :value="draftFilters.zipCode" @input="onInputChange('zipCode', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Status</label>
        <Select :value="draftFilters.status" @change="onSelectChange('status', $event)">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Created Date From</label>
          <Input :value="draftFilters.createdFrom" type="date" @input="onInputChange('createdFrom', $event)" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Created Date To</label>
          <Input :value="draftFilters.createdTo" type="date" @input="onInputChange('createdTo', $event)" />
        </div>
      </div>
    </FilterSheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Warehouse' : 'Add New Warehouse' }}</h2>
          <p class="text-sm text-muted-foreground">Manage warehouse hubs and shipping origins used across requests.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Warehouse Name *</label>
            <Input :value="formValues.name" placeholder="Enter warehouse name" @input="onFormInput('name', $event)" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Code *</label>
            <Input :value="formValues.code" placeholder="Enter warehouse code" @input="onFormInput('code', $event)" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Address</label>
          <Input :value="formValues.address" placeholder="Enter address" @input="onFormInput('address', $event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Country</label>
            <Select :value="formValues.country || ''" @change="onFormInput('country', $event)">
              <option value="">Select country</option>
              <option v-for="item in countryOptions" :key="item" :value="item">{{ item }}</option>
            </Select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">State</label>
            <Input :value="formValues.state" placeholder="Enter state" @input="onFormInput('state', $event)" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">City</label>
            <Input :value="formValues.city" placeholder="Enter city" @input="onFormInput('city', $event)" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Zip Code</label>
            <Input :value="formValues.zipCode" placeholder="Enter zip code" @input="onFormInput('zipCode', $event)" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Status</label>
          <Select :value="formValues.status" @change="onFormInput('status', $event)">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveWarehouse">{{ formMode === 'edit' ? 'Save Changes' : 'Create Warehouse' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Delete Warehouse</h2>
          <p class="text-sm text-muted-foreground">
            Delete {{ deleteCandidate?.name || 'selected warehouse' }}? This action is mock and cannot be undone.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </div>
      </div>
    </Dialog>

    <Sheet v-model="detailOpen">
      <div v-if="selectedWarehouse" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">{{ selectedWarehouse.name }}</h2>
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-mono text-xs uppercase tracking-wide text-muted-foreground">{{ selectedWarehouse.code }}</p>
            <Badge variant="outline" :class="getActiveBadgeClass(selectedWarehouse.status)">
              {{ selectedWarehouse.status === 'active' ? 'Active' : 'Inactive' }}
            </Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Location</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Country</p>
                <p>{{ selectedWarehouse.country || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">State</p>
                <p>{{ selectedWarehouse.state || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">City</p>
                <p>{{ selectedWarehouse.city || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Zip Code</p>
                <p>{{ selectedWarehouse.zipCode || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Address</h3>
            <p class="mt-3 whitespace-pre-wrap">{{ selectedWarehouse.address || '-' }}</p>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Metadata</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Created At</p>
                <p>{{ selectedWarehouse.createdAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated At</p>
                <p>{{ selectedWarehouse.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button @click="openEdit(selectedWarehouse)">Edit</Button>
          <Button variant="outline" @click="toggleStatus(selectedWarehouse)">
            {{ selectedWarehouse.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
          <Button variant="destructive" @click="openDelete(selectedWarehouse)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Warehouse not found.</div>
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
import { CircleCheckBig, CirclePause, Plus, Warehouse } from 'lucide-vue-next'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import { createWarehouseColumns, type WarehouseTableRow } from '@/components/warehouses/columns'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'
import { getAdminPageConfig } from '@/config/pages'
import { getActiveBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { warehousesMock, type Warehouse as WarehouseModel, type WarehouseStatus } from '@/mock/warehouses'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'

type FilterState = {
  code: string
  country: string
  state: string
  city: string
  zipCode: string
  status: 'all' | WarehouseStatus
  createdFrom: string
  createdTo: string
}

type FormState = {
  name: string
  code: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  status: WarehouseStatus
}

const DENSITY_STORAGE_KEY = 'table-density:warehouses'
const VIEW_STORAGE_KEY = 'table-view:warehouses'

const pageConfig = getAdminPageConfig('warehouses') ?? {
  title: 'Warehouses',
  description: 'Manage warehouse locations and related RFID settings.',
  primaryAction: { label: 'Add Warehouse', route: '/warehouses/new' },
}

const defaultFilters: FilterState = {
  code: '',
  country: 'all',
  state: '',
  city: '',
  zipCode: '',
  status: 'all',
  createdFrom: '',
  createdTo: '',
}

const defaultForm: FormState = {
  name: '',
  code: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  status: 'active',
}

const warehouses = ref<WarehouseModel[]>([...warehousesMock])
const density = ref<Density>(loadDensity())
const wrapText = ref(true)
const showRowNumbers = ref(true)
const filtersOpen = ref(false)

const filters = reactive<FilterState>({ ...defaultFilters })
const draftFilters = reactive<FilterState>({ ...defaultFilters })

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const formOpen = ref(false)
const formMode = ref<FormMode>('create')
const formError = ref('')
const editingId = ref<string | null>(null)
const formValues = reactive<FormState>({ ...defaultForm })

const detailOpen = ref(false)
const selectedWarehouseId = ref<string | null>(null)

const deleteOpen = ref(false)
const deleteCandidate = ref<WarehouseModel | null>(null)

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false

const countryOptions = computed(() =>
  Array.from(new Set(warehouses.value.map((item) => item.country))).sort((a, b) => a.localeCompare(b)),
)

const filteredRows = computed<WarehouseTableRow[]>(() => {
  return warehouses.value
    .filter((warehouse) => {
      if (filters.code.trim() && !warehouse.code.toLowerCase().includes(filters.code.toLowerCase().trim())) return false
      if (filters.country !== 'all' && warehouse.country !== filters.country) return false
      if (filters.state.trim() && !warehouse.state.toLowerCase().includes(filters.state.toLowerCase().trim())) return false
      if (filters.city.trim() && !warehouse.city.toLowerCase().includes(filters.city.toLowerCase().trim())) return false
      if (filters.zipCode.trim() && !warehouse.zipCode.toLowerCase().includes(filters.zipCode.toLowerCase().trim())) return false
      if (filters.status !== 'all' && warehouse.status !== filters.status) return false
      if (filters.createdFrom && warehouse.createdAt < filters.createdFrom) return false
      if (filters.createdTo && warehouse.createdAt > filters.createdTo) return false
      return true
    })
    .map((warehouse) => ({
      ...warehouse,
      searchText: `${warehouse.name} ${warehouse.code} ${warehouse.city} ${warehouse.country} ${warehouse.address}`.toLowerCase(),
    }))
})

const kpi = computed(() => ({
  total: warehouses.value.length,
  active: warehouses.value.filter((item) => item.status === 'active').length,
  inactive: warehouses.value.filter((item) => item.status === 'inactive').length,
}))

const appliedFiltersCount = computed(() =>
  (filters.code.trim() ? 1 : 0)
  + (filters.country !== 'all' ? 1 : 0)
  + (filters.state.trim() ? 1 : 0)
  + (filters.city.trim() ? 1 : 0)
  + (filters.zipCode.trim() ? 1 : 0)
  + (filters.status !== 'all' ? 1 : 0)
  + (filters.createdFrom ? 1 : 0)
  + (filters.createdTo ? 1 : 0),
)

const selectedWarehouse = computed(() =>
  warehouses.value.find((item) => item.id === selectedWarehouseId.value) ?? null,
)

const onView = (row: WarehouseTableRow) => {
  selectedWarehouseId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<WarehouseModel, 'id' | 'name' | 'code' | 'address' | 'country' | 'state' | 'city' | 'zipCode' | 'status'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formValues, {
    name: row.name,
    code: row.code,
    address: row.address,
    country: row.country,
    state: row.state,
    city: row.city,
    zipCode: row.zipCode,
    status: row.status,
  })
  formError.value = ''
  formOpen.value = true
}

const toggleStatus = (row: Pick<WarehouseModel, 'id' | 'status'>) => {
  const nextStatus: WarehouseStatus = row.status === 'active' ? 'inactive' : 'active'
  warehouses.value = warehouses.value.map((item) => item.id === row.id ? { ...item, status: nextStatus, updatedAt: today() } : item)
}

const openDelete = (row: WarehouseModel) => {
  deleteCandidate.value = row
  deleteOpen.value = true
}

const onDelete = (row: WarehouseTableRow) => {
  const original = warehouses.value.find((item) => item.id === row.id)
  if (!original) return
  openDelete(original)
}

const columns = computed<ColumnDef<WarehouseTableRow>[]>(() => createWarehouseColumns({
  onView,
  onEdit: openEdit,
  onToggle: toggleStatus,
  onDelete,
}))

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
  (value) => localStorage.setItem(DENSITY_STORAGE_KEY, value),
)

watch(
  () => [wrapText.value, showRowNumbers.value],
  () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ wrapText: wrapText.value, showRowNumbers: showRowNumbers.value })),
)

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
  Object.assign(draftFilters, defaultFilters)
  Object.assign(filters, defaultFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const onSelectChange = (key: keyof FilterState, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'status') {
    draftFilters.status = target.value as FilterState['status']
    return
  }
  if (key === 'country') {
    draftFilters.country = target.value
  }
}

const onInputChange = (key: 'code' | 'state' | 'city' | 'zipCode' | 'createdFrom' | 'createdTo', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: keyof FormState, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  if (key === 'status') {
    formValues.status = target.value as WarehouseStatus
    return
  }
  if (key === 'code') {
    formValues.code = target.value.toUpperCase()
    return
  }
  formValues[key] = target.value as never
}

const saveWarehouse = () => {
  const name = formValues.name.trim()
  const code = formValues.code.trim().toUpperCase()

  if (!name || !code) {
    formError.value = 'Warehouse Name and Code are required.'
    return
  }

  const now = today()

  if (formMode.value === 'edit' && editingId.value) {
    warehouses.value = warehouses.value.map((item) =>
      item.id === editingId.value
        ? { ...item, ...formValues, name, code, updatedAt: now }
        : item,
    )
  } else {
    const maxId = warehouses.value.reduce((max, item) => {
      const parsed = Number(item.id.split('-').pop() ?? '0')
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)

    const warehouse: WarehouseModel = {
      id: `WH-${String(maxId + 1).padStart(3, '0')}`,
      name,
      code,
      address: formValues.address.trim(),
      country: formValues.country.trim(),
      state: formValues.state.trim(),
      city: formValues.city.trim(),
      zipCode: formValues.zipCode.trim(),
      status: formValues.status,
      createdAt: now,
      updatedAt: now,
    }

    warehouses.value = [warehouse, ...warehouses.value]
  }

  closeForm()
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formValues, defaultForm)
  formMode.value = 'create'
  formError.value = ''
  editingId.value = null
}

const confirmDelete = () => {
  if (!deleteCandidate.value) return

  warehouses.value = warehouses.value.filter((item) => item.id !== deleteCandidate.value?.id)
  if (selectedWarehouseId.value === deleteCandidate.value.id) {
    selectedWarehouseId.value = null
    detailOpen.value = false
  }
  deleteOpen.value = false
  deleteCandidate.value = null
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Warehouse', 'Code', 'Address', 'Country', 'State', 'City', 'Zip Code', 'Status', 'Created At', 'Updated At']
  const body = rows.map((row) => [
    row.name,
    row.code,
    row.address,
    row.country,
    row.state,
    row.city,
    row.zipCode,
    row.status,
    row.createdAt,
    row.updatedAt,
  ])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `warehouses-${today()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const onExportExcel = () => {
  console.log('Export Excel (stub) clicked')
}

function today() {
  return new Date().toISOString().slice(0, 10)
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
    wrapText.value = parsed.wrapText ?? true
    showRowNumbers.value = parsed.showRowNumbers ?? true
  } catch {
    wrapText.value = true
    showRowNumbers.value = true
  }
}
</script>

