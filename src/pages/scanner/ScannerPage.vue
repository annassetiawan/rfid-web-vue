<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Scanner</p>
      <PageHeader :title="pageConfig.title" :description="pageConfig.description">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="onExportCsv">Export</Button>
            <Button @click="openCreate">
              <Plus class="h-4 w-4" />
              Add Scanner
            </Button>
          </div>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid grid-cols-4 gap-4">
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Total Devices</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <ScanLine class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All registered scanners.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Working</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.working }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Ready for operation.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">New</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.newly }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Sparkles class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Recently added devices.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Faulty</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.faulty }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <TriangleAlert class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Needs maintenance.</CardContent>
      </Card>
    </div>

    <ListCard title="Scanner List" description="Manage RFID scanner devices and operational status." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search serial, model, brand, location..."
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
        empty-title="No scanners found"
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
      title="Scanner Filters"
      description="Filter scanner devices by state, brand, location, and identity."
      reset-label="Clear"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">State</label>
        <Select :value="draftFilters.state" @change="onSelectChange('state', $event)">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="working">Working</option>
          <option value="faulty">Faulty</option>
          <option value="test">Test</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Brand</label>
        <Select :value="draftFilters.brand" @change="onSelectChange('brand', $event)">
          <option value="all">All</option>
          <option v-for="item in brandOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Location</label>
        <Select :value="draftFilters.location" @change="onSelectChange('location', $event)">
          <option value="all">All</option>
          <option v-for="item in locationOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Model Name</label>
        <Input :value="draftFilters.modelName" @input="onInputChange('modelName', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Serial Number</label>
        <Input :value="draftFilters.serialNumber" @input="onInputChange('serialNumber', $event)" />
      </div>
    </FilterSheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Scanner' : 'Add Scanner' }}</h2>
          <p class="text-sm text-muted-foreground">Manage RFID scanner devices and their operational status.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Serial Number *</label>
            <Input :value="formValues.serialNumber" placeholder="Enter serial number" @input="onFormInput('serialNumber', $event)" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Model Name *</label>
            <Input :value="formValues.modelName" placeholder="Enter model name" @input="onFormInput('modelName', $event)" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Brand *</label>
            <Select :value="formValues.brand || ''" @change="onFormInput('brand', $event)">
              <option value="">Select brand</option>
              <option v-for="item in brandOptions" :key="item" :value="item">{{ item }}</option>
            </Select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Location</label>
            <Select :value="formValues.location || ''" @change="onFormInput('location', $event)">
              <option value="">Select location</option>
              <option v-for="item in locationOptions" :key="item" :value="item">{{ item }}</option>
            </Select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">State</label>
          <Select :value="formValues.state" @change="onFormInput('state', $event)">
            <option value="new">New</option>
            <option value="working">Working</option>
            <option value="faulty">Faulty</option>
            <option value="test">Test</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Description</label>
          <Textarea :model-value="formValues.description" placeholder="Enter notes or description" @update:model-value="onFormText" />
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveScanner">{{ formMode === 'edit' ? 'Save Changes' : 'Create Scanner' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Delete Scanner</h2>
          <p class="text-sm text-muted-foreground">
            Delete {{ deleteCandidate?.serialNumber || 'selected scanner' }}? This action is mock and cannot be undone.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </div>
      </div>
    </Dialog>

    <Sheet v-model="detailOpen">
      <div v-if="selectedScanner" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">Serial: {{ selectedScanner.serialNumber }}</h2>
          <div class="flex items-center gap-2">
            <p class="text-sm text-muted-foreground">{{ selectedScanner.modelName }} • {{ selectedScanner.brand }}</p>
            <Badge variant="outline" :class="getScannerStateBadgeClass(selectedScanner.state)">
              {{ formatScannerState(selectedScanner.state) }}
            </Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Device</h3>
            <div class="mt-3 space-y-2">
              <div>
                <p class="text-xs text-muted-foreground">Serial Number</p>
                <p class="font-mono">{{ selectedScanner.serialNumber }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Model Name</p>
                <p>{{ selectedScanner.modelName }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Brand</p>
                <p>{{ selectedScanner.brand }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Assignment</h3>
            <div class="mt-3 space-y-2">
              <div>
                <p class="text-xs text-muted-foreground">Location</p>
                <p>{{ selectedScanner.location || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Description</p>
                <p class="whitespace-pre-wrap">{{ selectedScanner.description || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Metadata</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Created At</p>
                <p>{{ selectedScanner.createdAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated At</p>
                <p>{{ selectedScanner.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button @click="openEdit(selectedScanner)">Edit</Button>
          <Button variant="outline" @click="setScannerState(selectedScanner, 'working')">Mark Working</Button>
          <Button variant="destructive" @click="openDelete(selectedScanner)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Scanner not found.</div>
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
import { CircleCheckBig, Plus, ScanLine, Sparkles, TriangleAlert } from 'lucide-vue-next'
import { createScannerColumns, type ScannerTableRow } from '@/components/scanner/columns'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
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
import Textarea from '@/components/ui/Textarea.vue'
import { getAdminPageConfig } from '@/config/pages'
import { getScannerStateBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { scannersMock, type Scanner as ScannerModel, type ScannerState } from '@/mock/scanners'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'

type FilterState = {
  state: 'all' | ScannerState
  brand: string
  location: string
  modelName: string
  serialNumber: string
}

type FormState = {
  serialNumber: string
  modelName: string
  brand: string
  location: string
  state: ScannerState
  description: string
}

const DENSITY_STORAGE_KEY = 'table-density:scanners'
const VIEW_STORAGE_KEY = 'table-view:scanners'

const pageConfig = getAdminPageConfig('scanner') ?? {
  title: 'Scanner',
  description: 'Access scanner status and quick scan utilities.',
  primaryAction: { label: 'Connect Scanner', route: '/scanner/new' },
}

const defaultFilters: FilterState = {
  state: 'all',
  brand: 'all',
  location: 'all',
  modelName: '',
  serialNumber: '',
}

const defaultForm: FormState = {
  serialNumber: '',
  modelName: '',
  brand: '',
  location: '',
  state: 'new',
  description: '',
}

const scanners = ref<ScannerModel[]>([...scannersMock])
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
const selectedScannerId = ref<string | null>(null)

const deleteOpen = ref(false)
const deleteCandidate = ref<ScannerModel | null>(null)

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false

const brandOptions = computed(() => Array.from(new Set(scanners.value.map((item) => item.brand))).sort((a, b) => a.localeCompare(b)))
const locationOptions = computed(() => Array.from(new Set(scanners.value.map((item) => item.location))).sort((a, b) => a.localeCompare(b)))

const filteredRows = computed<ScannerTableRow[]>(() => {
  return scanners.value
    .filter((scanner) => {
      if (filters.state !== 'all' && scanner.state !== filters.state) return false
      if (filters.brand !== 'all' && scanner.brand !== filters.brand) return false
      if (filters.location !== 'all' && scanner.location !== filters.location) return false
      if (filters.modelName.trim() && !scanner.modelName.toLowerCase().includes(filters.modelName.toLowerCase().trim())) return false
      if (filters.serialNumber.trim() && !scanner.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase().trim())) return false
      return true
    })
    .map((scanner) => ({
      ...scanner,
      searchText: `${scanner.serialNumber} ${scanner.modelName} ${scanner.brand} ${scanner.location} ${scanner.description}`.toLowerCase(),
    }))
})

const kpi = computed(() => ({
  total: scanners.value.length,
  working: scanners.value.filter((item) => item.state === 'working').length,
  newly: scanners.value.filter((item) => item.state === 'new').length,
  faulty: scanners.value.filter((item) => item.state === 'faulty').length,
}))

const appliedFiltersCount = computed(() =>
  (filters.state !== 'all' ? 1 : 0)
  + (filters.brand !== 'all' ? 1 : 0)
  + (filters.location !== 'all' ? 1 : 0)
  + (filters.modelName.trim() ? 1 : 0)
  + (filters.serialNumber.trim() ? 1 : 0),
)

const selectedScanner = computed(() =>
  scanners.value.find((item) => item.id === selectedScannerId.value) ?? null,
)

const onView = (row: ScannerTableRow) => {
  selectedScannerId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<ScannerModel, 'id' | 'serialNumber' | 'modelName' | 'brand' | 'location' | 'state' | 'description'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formValues, {
    serialNumber: row.serialNumber,
    modelName: row.modelName,
    brand: row.brand,
    location: row.location,
    state: row.state,
    description: row.description,
  })
  formError.value = ''
  formOpen.value = true
}

const setScannerState = (row: Pick<ScannerModel, 'id'>, nextState: ScannerState) => {
  scanners.value = scanners.value.map((item) =>
    item.id === row.id
      ? { ...item, state: nextState, updatedAt: today() }
      : item,
  )
}

const openDelete = (row: ScannerModel) => {
  deleteCandidate.value = row
  deleteOpen.value = true
}

const onDelete = (row: ScannerTableRow) => {
  const original = scanners.value.find((item) => item.id === row.id)
  if (!original) return
  openDelete(original)
}

const onCopy = async (row: ScannerTableRow) => {
  try {
    await navigator.clipboard.writeText(row.serialNumber)
  } catch {
    console.log('Copy serial failed')
  }
}

const columns = computed<ColumnDef<ScannerTableRow>[]>(() => createScannerColumns({
  onView,
  onEdit: openEdit,
  onSetState: setScannerState,
  onCopy,
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
  if (key === 'state') {
    draftFilters.state = target.value as FilterState['state']
    return
  }
  draftFilters[key] = target.value
}

const onInputChange = (key: 'modelName' | 'serialNumber', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: keyof FormState, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  if (key === 'state') {
    formValues.state = target.value as ScannerState
    return
  }
  formValues[key] = target.value as never
}

const onFormText = (value: string | number) => {
  formValues.description = String(value)
}

const saveScanner = () => {
  const serialNumber = formValues.serialNumber.trim()
  const modelName = formValues.modelName.trim()
  const brand = formValues.brand.trim()

  if (!serialNumber || !modelName || !brand) {
    formError.value = 'Serial Number, Model Name, and Brand are required.'
    return
  }

  const duplicate = scanners.value.some(
    (scanner) => scanner.serialNumber.toLowerCase() === serialNumber.toLowerCase() && scanner.id !== editingId.value,
  )
  if (duplicate) {
    formError.value = 'Serial Number must be unique.'
    return
  }

  const now = today()
  if (formMode.value === 'edit' && editingId.value) {
    scanners.value = scanners.value.map((item) =>
      item.id === editingId.value
        ? {
            ...item,
            serialNumber,
            modelName,
            brand,
            location: formValues.location.trim(),
            state: formValues.state,
            description: formValues.description.trim(),
            updatedAt: now,
          }
        : item,
    )
  } else {
    const maxId = scanners.value.reduce((max, item) => {
      const parsed = Number(item.id.split('-').pop() ?? '0')
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)

    const scanner: ScannerModel = {
      id: `SC-${String(maxId + 1).padStart(3, '0')}`,
      serialNumber,
      modelName,
      brand,
      location: formValues.location.trim(),
      state: formValues.state,
      description: formValues.description.trim(),
      createdAt: now,
      updatedAt: now,
    }
    scanners.value = [scanner, ...scanners.value]
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

  scanners.value = scanners.value.filter((item) => item.id !== deleteCandidate.value?.id)
  if (selectedScannerId.value === deleteCandidate.value.id) {
    selectedScannerId.value = null
    detailOpen.value = false
  }
  deleteOpen.value = false
  deleteCandidate.value = null
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Serial Number', 'Model Name', 'Brand', 'Location', 'Description', 'State', 'Created At', 'Updated At']
  const body = rows.map((row) => [
    row.serialNumber,
    row.modelName,
    row.brand,
    row.location,
    row.description,
    row.state,
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
  link.download = `scanners-${today()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const onExportExcel = () => {
  console.log('Export Excel (stub) clicked')
}

function formatScannerState(state: ScannerState) {
  if (state === 'new') return 'New'
  if (state === 'working') return 'Working'
  if (state === 'faulty') return 'Faulty'
  return 'Test'
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
