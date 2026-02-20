<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Customers</p>
      <PageHeader title="Customers" description="Manage customer profiles used in requests and shipments.">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="onExportCsv">
              <Download class="h-4 w-4" />
              Export
            </Button>
            <Button @click="openCreate">
              <Plus class="h-4 w-4" />
              Add New Customer
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
              <p class="text-sm text-muted-foreground">Total Customers</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Users class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All customer profiles in master list.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Active</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.active }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Customers available for active requests.</CardContent>
      </Card>
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Inactive</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.inactive }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <UserX class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Profiles paused or no longer in use.</CardContent>
      </Card>
    </div>

    <ListCard title="Customer List" description="Unified customer master with filters and row actions." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search company, contact, email, country..."
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
        empty-title="No customers found"
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
      title="Customer Filters"
      description="Refine customers by status, location, and contact profile."
      reset-label="Clear"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Status</label>
        <Select :value="draftFilters.status" @change="onSelectChange('status', $event)">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Country</label>
        <Select :value="draftFilters.country" @change="onSelectChange('country', $event)">
          <option value="all">All</option>
          <option v-for="item in countryOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Company Name</label>
        <Input :value="draftFilters.companyName" @input="onInputChange('companyName', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Contact Name</label>
        <Input :value="draftFilters.contactName" @input="onInputChange('contactName', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email</label>
        <Input :value="draftFilters.email" @input="onInputChange('email', $event)" />
      </div>
    </FilterSheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Customer' : 'Add New Customer' }}</h2>
          <p class="text-sm text-muted-foreground">Manage customer profile used in requests and shipments.</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Company Name *</label>
          <Input :value="formValues.companyName" placeholder="Enter company name" @input="onFormInput('companyName', $event)" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Address</label>
          <Input :value="formValues.address" placeholder="Enter address" @input="onFormInput('address', $event)" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Zip Code</label>
            <Input :value="formValues.zipCode" placeholder="Zip code" @input="onFormInput('zipCode', $event)" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Country</label>
            <Select :value="formValues.country" @change="onFormSelect('country', $event)">
              <option value="">Select country</option>
              <option v-for="item in countryOptions" :key="item" :value="item">{{ item }}</option>
            </Select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Contact Name</label>
            <Input :value="formValues.contactName" placeholder="Contact name" @input="onFormInput('contactName', $event)" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Contact Phone</label>
            <Input :value="formValues.contactPhone" placeholder="Contact phone" @input="onFormInput('contactPhone', $event)" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Contact Email</label>
          <Input :value="formValues.contactEmail" type="email" placeholder="Contact email" @input="onFormInput('contactEmail', $event)" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Status</label>
          <Select :value="formValues.status" @change="onFormSelect('status', $event)">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveCustomer">{{ formMode === 'edit' ? 'Save Changes' : 'Create Customer' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Delete Customer</h2>
          <p class="text-sm text-muted-foreground">
            Delete {{ deleteCandidate?.companyName || 'selected customer' }}? This action is mock and cannot be undone.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </div>
      </div>
    </Dialog>

    <Sheet v-model="detailOpen">
      <div v-if="selectedCustomer" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">{{ selectedCustomer.companyName }}</h2>
          <div class="flex items-center gap-2">
            <p class="text-sm text-muted-foreground">{{ selectedCustomer.country || '-' }}</p>
            <Badge variant="outline" :class="getActiveBadgeClass(selectedCustomer.status)">
              {{ selectedCustomer.status === 'active' ? 'Active' : 'Inactive' }}
            </Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Company</h3>
            <p class="mt-2 text-xs text-muted-foreground">Address</p>
            <p class="whitespace-pre-wrap">{{ selectedCustomer.address || '-' }}</p>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Zip Code</p>
                <p>{{ selectedCustomer.zipCode || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Country</p>
                <p>{{ selectedCustomer.country || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Contact</h3>
            <div class="mt-3 space-y-2">
              <div>
                <p class="text-xs text-muted-foreground">Contact Name</p>
                <p>{{ selectedCustomer.contactName || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Contact Phone</p>
                <p>{{ selectedCustomer.contactPhone || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Contact Email</p>
                <p>{{ selectedCustomer.contactEmail || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Metadata</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Created At</p>
                <p>{{ selectedCustomer.createdAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated At</p>
                <p>{{ selectedCustomer.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button @click="openEdit(selectedCustomer)">Edit</Button>
          <Button variant="outline" @click="toggleStatus(selectedCustomer)">
            {{ selectedCustomer.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
          <Button variant="destructive" @click="openDelete(selectedCustomer)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Customer not found.</div>
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
import { Download, Plus, UserCheck, UserX, Users } from 'lucide-vue-next'
import { createCustomerColumns, type CustomerTableRow } from '@/components/customers/columns'
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
import { getActiveBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { customerMock, type Customer, type CustomerStatus } from '@/mock/customers'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'
type FilterState = {
  status: 'all' | CustomerStatus
  country: string
  companyName: string
  contactName: string
  email: string
}

type FormState = {
  companyName: string
  address: string
  zipCode: string
  country: string
  contactName: string
  contactPhone: string
  contactEmail: string
  status: CustomerStatus
}

const DENSITY_STORAGE_KEY = 'table-density:customers'
const VIEW_STORAGE_KEY = 'table-view:customers'

const defaultFilters: FilterState = {
  status: 'all',
  country: 'all',
  companyName: '',
  contactName: '',
  email: '',
}

const defaultForm: FormState = {
  companyName: '',
  address: '',
  zipCode: '',
  country: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  status: 'active',
}

const customers = ref<Customer[]>([...customerMock])
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
const selectedCustomerId = ref<string | null>(null)

const deleteOpen = ref(false)
const deleteCandidate = ref<Customer | null>(null)

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false

const countryOptions = computed(() => Array.from(new Set(customers.value.map((item) => item.country))).sort((a, b) => a.localeCompare(b)))

const filteredRows = computed<CustomerTableRow[]>(() => {
  return customers.value
    .filter((customer) => {
      if (filters.status !== 'all' && customer.status !== filters.status) return false
      if (filters.country !== 'all' && customer.country !== filters.country) return false
      if (filters.companyName.trim() && !customer.companyName.toLowerCase().includes(filters.companyName.toLowerCase().trim())) return false
      if (filters.contactName.trim() && !customer.contactName.toLowerCase().includes(filters.contactName.toLowerCase().trim())) return false
      if (filters.email.trim() && !customer.contactEmail.toLowerCase().includes(filters.email.toLowerCase().trim())) return false
      return true
    })
    .map((customer) => ({
      ...customer,
      searchText: `${customer.companyName} ${customer.contactName} ${customer.contactEmail} ${customer.country} ${customer.address}`.toLowerCase(),
    }))
})

const kpi = computed(() => ({
  total: customers.value.length,
  active: customers.value.filter((item) => item.status === 'active').length,
  inactive: customers.value.filter((item) => item.status === 'inactive').length,
}))

const appliedFiltersCount = computed(() =>
  (filters.status !== 'all' ? 1 : 0)
  + (filters.country !== 'all' ? 1 : 0)
  + (filters.companyName.trim() ? 1 : 0)
  + (filters.contactName.trim() ? 1 : 0)
  + (filters.email.trim() ? 1 : 0),
)

const selectedCustomer = computed(() =>
  customers.value.find((item) => item.id === selectedCustomerId.value) ?? null,
)

const onView = (row: CustomerTableRow) => {
  selectedCustomerId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<Customer, 'id' | 'companyName' | 'address' | 'zipCode' | 'country' | 'contactName' | 'contactPhone' | 'contactEmail' | 'status'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formValues, {
    companyName: row.companyName,
    address: row.address,
    zipCode: row.zipCode,
    country: row.country,
    contactName: row.contactName,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    status: row.status,
  })
  formError.value = ''
  formOpen.value = true
}

const toggleStatus = (row: Pick<Customer, 'id' | 'status' | 'companyName'>) => {
  const nextStatus: CustomerStatus = row.status === 'active' ? 'inactive' : 'active'
  customers.value = customers.value.map((item) => item.id === row.id ? { ...item, status: nextStatus, updatedAt: today() } : item)
}

const openDelete = (row: Customer) => {
  deleteCandidate.value = row
  deleteOpen.value = true
}

const onDelete = (row: CustomerTableRow) => {
  const original = customers.value.find((item) => item.id === row.id)
  if (!original) return
  openDelete(original)
}

const columns = computed<ColumnDef<CustomerTableRow>[]>(() => createCustomerColumns({
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

const onInputChange = (key: 'companyName' | 'contactName' | 'email', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: keyof Omit<FormState, 'status'>, event: Event) => {
  const target = event.target as HTMLInputElement
  formValues[key] = target.value
}

const onFormSelect = (key: 'country' | 'status', event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (key === 'status') {
    formValues.status = value as CustomerStatus
    return
  }
  formValues.country = value
}

const saveCustomer = () => {
  if (!formValues.companyName.trim()) {
    formError.value = 'Company Name is required.'
    return
  }

  const now = today()

  if (formMode.value === 'edit' && editingId.value) {
    customers.value = customers.value.map((item) =>
      item.id === editingId.value
        ? {
            ...item,
            ...formValues,
            companyName: formValues.companyName.trim(),
            updatedAt: now,
          }
        : item,
    )
  } else {
    const maxId = customers.value.reduce((max, item) => {
      const parsed = Number(item.id.split('-').pop() ?? '0')
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)

    const customer: Customer = {
      id: `CUS-${String(maxId + 1).padStart(3, '0')}`,
      companyName: formValues.companyName.trim(),
      address: formValues.address.trim(),
      zipCode: formValues.zipCode.trim(),
      country: formValues.country.trim(),
      contactName: formValues.contactName.trim(),
      contactPhone: formValues.contactPhone.trim(),
      contactEmail: formValues.contactEmail.trim(),
      status: formValues.status,
      createdAt: now,
      updatedAt: now,
    }

    customers.value = [customer, ...customers.value]
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

  customers.value = customers.value.filter((item) => item.id !== deleteCandidate.value?.id)
  if (selectedCustomerId.value === deleteCandidate.value.id) {
    selectedCustomerId.value = null
    detailOpen.value = false
  }
  deleteOpen.value = false
  deleteCandidate.value = null
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Company Name', 'Address', 'Zip Code', 'Country', 'Contact Name', 'Contact Phone', 'Contact Email', 'Status', 'Created At', 'Updated At']
  const body = rows.map((row) => [
    row.companyName,
    row.address,
    row.zipCode,
    row.country,
    row.contactName,
    row.contactPhone,
    row.contactEmail,
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
  link.download = `customers-${today()}.csv`
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
