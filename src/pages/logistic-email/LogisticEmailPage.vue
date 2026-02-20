<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Settings/Support</p>
      <PageHeader title="Logistic Emails" description="Manage recipient lists for logistics notifications by warehouse and type.">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="onExportCsv">
              Export
            </Button>
            <Button @click="openCreate">
              <Plus class="h-4 w-4" />
              Add New Email
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
              <p class="text-sm text-muted-foreground">Total Recipients</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Mail class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All notification recipients.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Warehouse Type</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.warehouseType }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Warehouse class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Mapped to warehouse notifications.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">CC Type</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.ccType }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Copy class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Recipients in CC distribution.</CardContent>
      </Card>
    </div>

    <ListCard title="Logistic Email List" description="Manage recipient lists for logistics notifications." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search name, email, warehouse..."
        :view-options="[
          { key: 'showEmail', label: 'Show email', checked: showEmail },
          { key: 'showWarehouse', label: 'Show warehouse', checked: showWarehouse },
          { key: 'showType', label: 'Show type', checked: showType },
          { key: 'showUpdated', label: 'Show updated', checked: showUpdated },
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
        :wrap-text="false"
        empty-title="No recipients found"
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
      title="Logistic Email Filters"
      description="Refine recipients by type, warehouse, domain, and name."
      reset-label="Reset"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Type</label>
        <Select :value="draftFilters.type" @change="onSelectChange('type', $event)">
          <option value="all">All</option>
          <option value="warehouse">Warehouse</option>
          <option value="cc">CC</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Warehouse Location</label>
        <Select :value="draftFilters.warehouseLocation" @change="onSelectChange('warehouseLocation', $event)">
          <option value="all">All</option>
          <option v-for="item in warehouseOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email Domain</label>
        <Input :value="draftFilters.emailDomain" placeholder="paloaltonetworks.com" @input="onInputChange('emailDomain', $event)" />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Name</label>
        <Input :value="draftFilters.name" placeholder="Filter name" @input="onInputChange('name', $event)" />
      </div>
    </FilterSheet>

    <Sheet v-model="detailOpen">
      <div v-if="selectedEmail" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">{{ selectedEmail.name }}</h2>
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-mono text-xs">{{ selectedEmail.email }}</p>
            <Badge variant="outline" :class="getLogisticEmailTypeBadgeClass(selectedEmail.type)">
              {{ typeLabelMap[selectedEmail.type] }}
            </Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Recipient</h3>
            <div class="mt-3 space-y-3">
              <div>
                <p class="text-xs text-muted-foreground">Name</p>
                <p>{{ selectedEmail.name }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Email</p>
                <p class="font-mono text-xs break-all">{{ selectedEmail.email }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Type</p>
                <Badge variant="outline" :class="getLogisticEmailTypeBadgeClass(selectedEmail.type)">
                  {{ typeLabelMap[selectedEmail.type] }}
                </Badge>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Assignment</h3>
            <div class="mt-3">
              <p class="text-xs text-muted-foreground">Warehouse Location</p>
              <p>{{ selectedEmail.warehouseLocation || '-' }}</p>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Metadata</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Created At</p>
                <p>{{ selectedEmail.createdAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated At</p>
                <p>{{ selectedEmail.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button variant="outline" @click="openEdit(selectedEmail)">Edit</Button>
          <Button variant="outline" @click="copyEmail(selectedEmail.email)">Copy Email</Button>
          <Button variant="destructive" @click="openDelete(selectedEmail)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Recipient not found.</div>
    </Sheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Logistic Email' : 'Add New Email' }}</h2>
          <p class="text-sm text-muted-foreground">Manage recipient lists for logistics notifications.</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Name *</label>
          <Input :value="formValues.name" placeholder="Enter recipient name" @input="onFormInput('name', $event)" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Email *</label>
          <Input :value="formValues.email" type="email" placeholder="Enter recipient email" @input="onFormInput('email', $event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Type</label>
            <Select :value="formValues.type" @change="onFormSelect('type', $event)">
              <option value="warehouse">Warehouse</option>
              <option value="cc">CC</option>
            </Select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Warehouse Location</label>
            <Select :value="formValues.warehouseLocation || 'none'" @change="onFormSelect('warehouseLocation', $event)">
              <option value="none">No warehouse</option>
              <option v-for="item in warehouseOptions" :key="item" :value="item">{{ item }}</option>
            </Select>
          </div>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveRecipient">{{ formMode === 'edit' ? 'Save Changes' : 'Create' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Delete Recipient</h2>
          <p class="text-sm text-muted-foreground">
            Delete {{ deleteCandidate?.email || 'selected recipient' }}? This action is mock and cannot be undone.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
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
import { Copy, Mail, Plus, Warehouse } from 'lucide-vue-next'
import { createLogisticEmailColumns, type LogisticEmailTableRow, typeLabelMap } from '@/components/logistic-email/columns'
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
import { getLogisticEmailTypeBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { logisticEmailsMock, type LogisticEmail, type LogisticEmailType } from '@/mock/logisticEmails'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'

type FilterState = {
  type: 'all' | LogisticEmailType
  warehouseLocation: string
  emailDomain: string
  name: string
}

type FormState = {
  name: string
  email: string
  warehouseLocation: string
  type: LogisticEmailType
}

const DENSITY_STORAGE_KEY = 'table-density:logistic-emails'
const VIEW_STORAGE_KEY = 'table-view:logistic-emails'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const defaultFilters: FilterState = {
  type: 'all',
  warehouseLocation: 'all',
  emailDomain: '',
  name: '',
}

const defaultForm: FormState = {
  name: '',
  email: '',
  warehouseLocation: '',
  type: 'warehouse',
}

const emails = ref<LogisticEmail[]>([...logisticEmailsMock])
const density = ref<Density>(loadDensity())
const showEmail = ref(true)
const showWarehouse = ref(true)
const showType = ref(true)
const showUpdated = ref(true)
const showRowNumbers = ref(true)
const filtersOpen = ref(false)

const filters = reactive<FilterState>({ ...defaultFilters })
const draftFilters = reactive<FilterState>({ ...defaultFilters })

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const detailOpen = ref(false)
const selectedId = ref<string | null>(null)

const formOpen = ref(false)
const formMode = ref<FormMode>('create')
const editingId = ref<string | null>(null)
const formError = ref('')
const formValues = reactive<FormState>({ ...defaultForm })

const deleteOpen = ref(false)
const deleteCandidate = ref<LogisticEmail | null>(null)

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false
columnVisibility.value.email = showEmail.value
columnVisibility.value.warehouseLocation = showWarehouse.value
columnVisibility.value.type = showType.value
columnVisibility.value.updatedAt = showUpdated.value

const selectedEmail = computed(() => emails.value.find((item) => item.id === selectedId.value) ?? null)

const warehouseOptions = computed(() =>
  Array.from(new Set(emails.value.map((item) => item.warehouseLocation).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
)

const filteredRows = computed<LogisticEmailTableRow[]>(() =>
  emails.value
    .filter((item) => {
      if (filters.type !== 'all' && item.type !== filters.type) return false
      if (filters.warehouseLocation !== 'all' && item.warehouseLocation !== filters.warehouseLocation) return false
      if (filters.emailDomain.trim() && !item.email.toLowerCase().includes(`@${filters.emailDomain.toLowerCase().trim()}`)) return false
      if (filters.name.trim() && !item.name.toLowerCase().includes(filters.name.toLowerCase().trim())) return false
      return true
    })
    .map((item) => ({
      ...item,
      searchText: `${item.name} ${item.email} ${item.warehouseLocation} ${item.type}`.toLowerCase(),
    })),
)

const kpi = computed(() => ({
  total: emails.value.length,
  warehouseType: emails.value.filter((item) => item.type === 'warehouse').length,
  ccType: emails.value.filter((item) => item.type === 'cc').length,
}))

const appliedFiltersCount = computed(() =>
  (filters.type !== 'all' ? 1 : 0)
  + (filters.warehouseLocation !== 'all' ? 1 : 0)
  + (filters.emailDomain.trim() ? 1 : 0)
  + (filters.name.trim() ? 1 : 0),
)

const onView = (row: LogisticEmailTableRow) => {
  selectedId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<LogisticEmail, 'id' | 'name' | 'email' | 'warehouseLocation' | 'type'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formValues, {
    name: row.name,
    email: row.email,
    warehouseLocation: row.warehouseLocation,
    type: row.type,
  })
  formError.value = ''
  formOpen.value = true
}

const openDelete = (row: LogisticEmail) => {
  deleteCandidate.value = row
  deleteOpen.value = true
}

const onDelete = (row: LogisticEmailTableRow) => {
  const original = emails.value.find((item) => item.id === row.id)
  if (!original) return
  openDelete(original)
}

const copyEmail = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    console.log(`Copy failed for ${value}`)
  }
}

const onCopy = (row: LogisticEmailTableRow) => {
  void copyEmail(row.email)
}

const columns = computed<ColumnDef<LogisticEmailTableRow>[]>(() => createLogisticEmailColumns({
  onView,
  onEdit: openEdit,
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
  () => [showEmail.value, showWarehouse.value, showType.value, showUpdated.value, showRowNumbers.value],
  () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
    showEmail: showEmail.value,
    showWarehouse: showWarehouse.value,
    showType: showType.value,
    showUpdated: showUpdated.value,
    showRowNumbers: showRowNumbers.value,
  })),
)

const onDensityChange = (value: Density) => {
  density.value = value
}

const onToggleViewOption = (payload: { key: string; value: boolean }) => {
  if (payload.key === 'showEmail') {
    showEmail.value = payload.value
    table.getColumn('email')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showWarehouse') {
    showWarehouse.value = payload.value
    table.getColumn('warehouseLocation')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showType') {
    showType.value = payload.value
    table.getColumn('type')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showUpdated') {
    showUpdated.value = payload.value
    table.getColumn('updatedAt')?.toggleVisibility(payload.value)
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
  if (key === 'type') {
    draftFilters.type = target.value as FilterState['type']
    return
  }
  if (key === 'warehouseLocation') {
    draftFilters.warehouseLocation = target.value
  }
}

const onInputChange = (key: 'emailDomain' | 'name', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: 'name' | 'email', event: Event) => {
  const target = event.target as HTMLInputElement
  formValues[key] = target.value
}

const onFormSelect = (key: 'type' | 'warehouseLocation', event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'type') {
    formValues.type = target.value as LogisticEmailType
    return
  }
  formValues.warehouseLocation = target.value === 'none' ? '' : target.value
}

const saveRecipient = () => {
  const name = formValues.name.trim()
  const email = formValues.email.trim().toLowerCase()
  const warehouseLocation = formValues.warehouseLocation.trim()

  if (!name || !email) {
    formError.value = 'Name and Email are required.'
    return
  }
  if (!emailRegex.test(email)) {
    formError.value = 'Email format is invalid.'
    return
  }
  if (formValues.type === 'warehouse' && !warehouseLocation) {
    formError.value = 'Warehouse location is required for Warehouse type.'
    return
  }
  if (emails.value.some((item) =>
    item.id !== editingId.value
    && item.email.toLowerCase() === email
    && item.warehouseLocation.trim().toLowerCase() === warehouseLocation.toLowerCase()
    && item.type === formValues.type,
  )) {
    formError.value = 'Duplicate combination Email + Warehouse + Type.'
    return
  }

  const now = today()

  if (formMode.value === 'edit' && editingId.value) {
    emails.value = emails.value.map((item) =>
      item.id === editingId.value
        ? {
            ...item,
            name,
            email,
            warehouseLocation,
            type: formValues.type,
            updatedAt: now,
          }
        : item,
    )
  } else {
    const maxId = emails.value.reduce((max, item) => {
      const parsed = Number(item.id.split('-').pop() ?? '0')
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)
    emails.value = [
      {
        id: `LE-${String(maxId + 1).padStart(3, '0')}`,
        name,
        email,
        warehouseLocation,
        type: formValues.type,
        createdAt: now,
        updatedAt: now,
      },
      ...emails.value,
    ]
  }

  closeForm()
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const resetForm = () => {
  formMode.value = 'create'
  editingId.value = null
  Object.assign(formValues, defaultForm)
  formError.value = ''
}

const confirmDelete = () => {
  if (!deleteCandidate.value) return
  emails.value = emails.value.filter((item) => item.id !== deleteCandidate.value?.id)
  if (selectedId.value === deleteCandidate.value.id) {
    selectedId.value = null
    detailOpen.value = false
  }
  deleteOpen.value = false
  deleteCandidate.value = null
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Name', 'Email', 'Warehouse', 'Type', 'Created At', 'Updated At']
  const body = rows.map((row) => [
    row.name,
    row.email,
    row.warehouseLocation,
    row.type,
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
  link.download = `logistic-emails-${today()}.csv`
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
    const parsed = JSON.parse(raw) as {
      showEmail?: boolean
      showWarehouse?: boolean
      showType?: boolean
      showUpdated?: boolean
      showRowNumbers?: boolean
    }
    showEmail.value = parsed.showEmail ?? true
    showWarehouse.value = parsed.showWarehouse ?? true
    showType.value = parsed.showType ?? true
    showUpdated.value = parsed.showUpdated ?? true
    showRowNumbers.value = parsed.showRowNumbers ?? true
  } catch {
    showEmail.value = true
    showWarehouse.value = true
    showType.value = true
    showUpdated.value = true
    showRowNumbers.value = true
  }
}
</script>
