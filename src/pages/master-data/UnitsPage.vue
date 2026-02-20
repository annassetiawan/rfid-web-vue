<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Master Data</p>
      <PageHeader title="Master Data Unit" description="Manage unit metadata and classification across products.">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="importOpen = true">
              <Upload class="h-4 w-4" />
              Bulk Import
            </Button>
            <Button @click="openCreate">
              <Plus class="h-4 w-4" />
              Add New Unit
            </Button>
          </div>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <Tabs v-model="categoryTab">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="main">Main Product</TabsTrigger>
        <TabsTrigger value="accessory">Accessory</TabsTrigger>
      </TabsList>
      <TabsContent value="all" />
      <TabsContent value="main" />
      <TabsContent value="accessory" />
    </Tabs>

    <ListCard title="Units Table" description="Search, filter, and manage master unit data." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search unit name..."
        :view-options="[
          { key: 'showImage', label: 'Show image', checked: showImage },
          { key: 'showStatus', label: 'Show status', checked: showStatus },
          { key: 'showUpdated', label: 'Show updated', checked: showUpdated },
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
        empty-title="No units found"
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
      title="Advanced Filters"
      description="Filter units by category, status, or date."
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
        <label class="text-sm font-medium">Category</label>
        <Select :value="draftFilters.category" @change="onSelectChange('category', $event)">
          <option value="all">All</option>
          <option value="main">Main Product</option>
          <option value="accessory">Accessory</option>
        </Select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Updated From</label>
          <Input :value="draftFilters.updatedFrom" type="date" @input="onInputChange('updatedFrom', $event)" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Updated To</label>
          <Input :value="draftFilters.updatedTo" type="date" @input="onInputChange('updatedTo', $event)" />
        </div>
      </div>
    </FilterSheet>

    <Sheet v-model="detailOpen">
      <div v-if="selectedUnit" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <div class="flex items-start gap-3">
            <img
              v-if="selectedUnit.imageUrl"
              :src="selectedUnit.imageUrl"
              :alt="selectedUnit.name"
              class="h-14 w-14 shrink-0 rounded-lg border border-border/60 object-cover aspect-square"
            />
            <div
              v-else
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted text-sm font-semibold text-muted-foreground aspect-square"
            >
              {{ selectedUnit.name.slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-lg font-semibold">{{ selectedUnit.name }}</h2>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" :class="getUnitCategoryBadgeClass(selectedUnit.category)">
                  {{ selectedUnit.category === 'main' ? 'Main Product' : 'Accessory' }}
                </Badge>
                <Badge variant="outline" :class="getActiveBadgeClass(selectedUnit.status)">
                  {{ selectedUnit.status === 'active' ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Unit Information</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Unit ID</p>
                <p>{{ selectedUnit.id }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated</p>
                <p>{{ selectedUnit.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button variant="outline" @click="openEdit(selectedUnit)">Edit</Button>
          <Button @click="toggleStatus(selectedUnit)">
            {{ selectedUnit.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Unit not found.</div>
    </Sheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Unit' : 'Add New Unit' }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ formMode === 'edit' ? 'Update unit details and status.' : 'Create a new master unit for products or accessories.' }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Unit Name *</label>
          <Input :value="formValues.name" placeholder="Enter unit name" @input="onFormInput('name', $event)" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Category *</label>
          <Select :value="formValues.category" @change="onFormInput('category', $event)">
            <option value="">Select category</option>
            <option value="main">Main Product</option>
            <option value="accessory">Accessory</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Status</label>
          <Select :value="formValues.status" @change="onFormInput('status', $event)">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Image</label>
          <Input type="file" accept="image/*" @change="onImageChange" />
          <div
            v-if="formValues.imageUrl"
            class="flex items-center gap-3 rounded-lg border border-border/60 p-2"
          >
            <img :src="formValues.imageUrl" alt="Preview" class="h-16 w-16 rounded-md object-cover" />
            <div>
              <p class="text-sm font-medium">Preview</p>
              <p class="text-xs text-muted-foreground">Image ready to upload</p>
            </div>
          </div>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveUnit">{{ formMode === 'edit' ? 'Save Changes' : 'Create Unit' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="importOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Bulk Import Units</h2>
          <p class="text-sm text-muted-foreground">Upload a .csv file to import multiple units at once.</p>
        </div>

        <div class="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
          <p class="font-medium text-foreground">CSV Import (Mock)</p>
          <p class="mt-1 text-xs">Click generate to create preview rows.</p>
          <div class="mt-3">
            <Button variant="outline" @click="generateImportPreview">Generate Mock Rows</Button>
          </div>
        </div>

        <div class="rounded-lg border border-border/60">
          <div class="border-b border-border/60 px-4 py-3 text-sm font-medium">Preview</div>
          <div class="p-4 text-sm">
            <p v-if="importPreview.length === 0" class="text-muted-foreground">No rows parsed yet.</p>
            <ul v-else class="space-y-2">
              <li v-for="row in importPreview" :key="row.id" class="flex items-center justify-between rounded-md border px-3 py-2">
                <span class="font-medium">{{ row.name }}</span>
                <span class="text-xs text-muted-foreground">{{ row.category }} • {{ row.status }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="importOpen = false">Cancel</Button>
          <Button :disabled="importPreview.length === 0" @click="applyImport">Import</Button>
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
import { Plus, Upload } from 'lucide-vue-next'
import { createMasterUnitColumns, type MasterUnitTableRow } from '@/components/master-data/units/columns'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import { getActiveBadgeClass, getUnitCategoryBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { masterUnitsMock, type MasterUnit, type MasterUnitCategory, type MasterUnitStatus } from '@/mock/masterUnits'

type Density = 'compact' | 'comfortable'
type CategoryFilter = 'all' | MasterUnitCategory
type FormMode = 'create' | 'edit'

type FilterState = {
  category: CategoryFilter
  status: 'all' | MasterUnitStatus
  updatedFrom: string
  updatedTo: string
}

type FormState = {
  name: string
  category: '' | MasterUnitCategory
  status: MasterUnitStatus
  imageUrl: string | null
}

const DENSITY_STORAGE_KEY = 'table-density:master-units'
const VIEW_STORAGE_KEY = 'table-view:master-units'

const units = ref<MasterUnit[]>([...masterUnitsMock])
const categoryTab = ref<CategoryFilter>('all')
const density = ref<Density>(loadDensity())
const showImage = ref(true)
const showStatus = ref(true)
const showUpdated = ref(true)
const filtersOpen = ref(false)

const filters = reactive<FilterState>({
  category: 'all',
  status: 'all',
  updatedFrom: '',
  updatedTo: '',
})
const draftFilters = reactive<FilterState>({ ...filters })

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const detailOpen = ref(false)
const selectedUnitId = ref<string | null>(null)

const formOpen = ref(false)
const formMode = ref<FormMode>('create')
const editingId = ref<string | null>(null)
const formError = ref('')
const formValues = reactive<FormState>({
  name: '',
  category: '',
  status: 'active',
  imageUrl: null,
})

const importOpen = ref(false)
const importPreview = ref<MasterUnit[]>([])

loadViewState()
columnVisibility.value.number = true
columnVisibility.value.searchText = false
columnVisibility.value.image = showImage.value
columnVisibility.value.status = showStatus.value
columnVisibility.value.updatedAt = showUpdated.value

const selectedUnit = computed(() => units.value.find((unit) => unit.id === selectedUnitId.value) ?? null)

const filteredRows = computed<MasterUnitTableRow[]>(() => {
  const effectiveCategory = categoryTab.value !== 'all' ? categoryTab.value : filters.category
  return units.value
    .filter((unit) => {
      if (effectiveCategory !== 'all' && unit.category !== effectiveCategory) return false
      if (filters.status !== 'all' && unit.status !== filters.status) return false
      if (filters.updatedFrom && unit.updatedAt < filters.updatedFrom) return false
      if (filters.updatedTo && unit.updatedAt > filters.updatedTo) return false
      return true
    })
    .map((unit) => ({
      ...unit,
      searchText: `${unit.name} ${unit.category} ${unit.status}`.toLowerCase(),
    }))
})

const appliedFiltersCount = computed(() =>
  (filters.category !== 'all' ? 1 : 0)
  + (filters.status !== 'all' ? 1 : 0)
  + (filters.updatedFrom ? 1 : 0)
  + (filters.updatedTo ? 1 : 0),
)

const onView = (row: MasterUnitTableRow) => {
  selectedUnitId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<MasterUnit, 'id' | 'name' | 'category' | 'status' | 'imageUrl'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  formValues.name = row.name
  formValues.category = row.category
  formValues.status = row.status
  formValues.imageUrl = row.imageUrl ?? null
  formError.value = ''
  formOpen.value = true
}

const toggleStatus = (row: Pick<MasterUnit, 'id' | 'status'>) => {
  const nextStatus: MasterUnitStatus = row.status === 'active' ? 'inactive' : 'active'
  units.value = units.value.map((unit) => unit.id === row.id ? { ...unit, status: nextStatus, updatedAt: today() } : unit)
}

const onDelete = (row: MasterUnitTableRow) => {
  units.value = units.value.filter((unit) => unit.id !== row.id)
}

const columns = computed<ColumnDef<MasterUnitTableRow>[]>(() => createMasterUnitColumns({
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
  () => categoryTab.value,
  (value) => {
    filters.category = value
    draftFilters.category = value
    table.setPageIndex(0)
  },
)

watch(
  () => density.value,
  (value) => localStorage.setItem(DENSITY_STORAGE_KEY, value),
)

watch(
  () => [showImage.value, showStatus.value, showUpdated.value],
  () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ showImage: showImage.value, showStatus: showStatus.value, showUpdated: showUpdated.value })),
)

const onDensityChange = (value: Density) => {
  density.value = value
}

const onToggleViewOption = (payload: { key: string; value: boolean }) => {
  if (payload.key === 'showImage') {
    showImage.value = payload.value
    table.getColumn('image')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showStatus') {
    showStatus.value = payload.value
    table.getColumn('status')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showUpdated') {
    showUpdated.value = payload.value
    table.getColumn('updatedAt')?.toggleVisibility(payload.value)
  }
}

const applyFilters = () => {
  Object.assign(filters, draftFilters)
  categoryTab.value = draftFilters.category
  table.setPageIndex(0)
  filtersOpen.value = false
}

const resetFilters = () => {
  Object.assign(draftFilters, {
    category: 'all',
    status: 'all',
    updatedFrom: '',
    updatedTo: '',
  })
  Object.assign(filters, draftFilters)
  categoryTab.value = 'all'
  table.setPageIndex(0)
  filtersOpen.value = false
}

const onSelectChange = (key: keyof FilterState, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'category') draftFilters.category = target.value as CategoryFilter
  if (key === 'status') draftFilters.status = target.value as FilterState['status']
}

const onInputChange = (key: 'updatedFrom' | 'updatedTo', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: keyof FormState, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  if (key === 'category') {
    formValues.category = target.value as FormState['category']
    return
  }
  if (key === 'status') {
    formValues.status = target.value as MasterUnitStatus
    return
  }
  if (key === 'name') {
    formValues.name = target.value
  }
}

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    formValues.imageUrl = null
    return
  }
  formValues.imageUrl = URL.createObjectURL(file)
}

const saveUnit = () => {
  if (!formValues.name.trim() || !formValues.category) {
    formError.value = 'Unit name and category are required.'
    return
  }
  const now = today()
  if (formMode.value === 'edit' && editingId.value) {
    units.value = units.value.map((unit) =>
      unit.id === editingId.value
        ? {
            ...unit,
            name: formValues.name.trim(),
            category: formValues.category as MasterUnitCategory,
            status: formValues.status,
            imageUrl: formValues.imageUrl ?? undefined,
            updatedAt: now,
          }
        : unit,
    )
  } else {
    units.value = [
      {
        id: `MU-${Date.now()}`,
        name: formValues.name.trim(),
        category: formValues.category as MasterUnitCategory,
        status: formValues.status,
        imageUrl: formValues.imageUrl ?? undefined,
        updatedAt: now,
      },
      ...units.value,
    ]
  }
  closeForm()
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const resetForm = () => {
  formValues.name = ''
  formValues.category = ''
  formValues.status = 'active'
  formValues.imageUrl = null
  formError.value = ''
  editingId.value = null
}

const generateImportPreview = () => {
  importPreview.value = [
    { id: 'MU-IMPORT-01', name: 'PAN-PA-2200', category: 'main', status: 'active', updatedAt: today() },
    { id: 'MU-IMPORT-02', name: 'Power Adapter Kit', category: 'accessory', status: 'active', updatedAt: today() },
    { id: 'MU-IMPORT-03', name: 'Console Cable - XL', category: 'accessory', status: 'inactive', updatedAt: today() },
  ]
}

const applyImport = () => {
  if (importPreview.value.length === 0) return
  units.value = [...importPreview.value, ...units.value]
  importPreview.value = []
  importOpen.value = false
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Name', 'Category', 'Status', 'Updated']
  const body = rows.map((row) => [row.name, row.category, row.status, row.updatedAt])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `master-units-${today()}.csv`
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
    const parsed = JSON.parse(raw) as { showImage?: boolean; showStatus?: boolean; showUpdated?: boolean }
    showImage.value = parsed.showImage ?? true
    showStatus.value = parsed.showStatus ?? true
    showUpdated.value = parsed.showUpdated ?? true
  } catch {
    showImage.value = true
    showStatus.value = true
    showUpdated.value = true
  }
}
</script>
