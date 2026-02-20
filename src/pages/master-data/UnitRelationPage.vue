<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Master Data</p>
      <PageHeader title="Unit Relation" description="Manage mapping between main products and accessory units.">
        <template #actions>
          <Button @click="openCreate">
            <Plus class="h-4 w-4" />
            Add New Relation
          </Button>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Total Relations</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Network class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Main to accessory mappings in this view.</CardContent>
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
        <CardContent class="pt-0 text-sm text-muted-foreground">Relations enabled for operations.</CardContent>
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
        <CardContent class="pt-0 text-sm text-muted-foreground">Relations currently disabled.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Accessories Linked</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.accessoriesLinked }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Cable class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Unique accessories currently assigned.</CardContent>
      </Card>
    </div>

    <ListCard title="Unit Relations" description="Search, filter, and maintain main-to-accessory mappings." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search main product or accessory..."
        :view-options="[
          { key: 'showAccessories', label: 'Show accessories', checked: showAccessories },
          { key: 'showUpdated', label: 'Show updated', checked: showUpdated },
          { key: 'showStatus', label: 'Show status', checked: showStatus },
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
        empty-title="No relations found"
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
      description="Filter by main product, accessory, status, and updated date."
      reset-label="Clear"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Main Product</label>
        <Select :value="draftFilters.mainUnitId" @change="onSelectChange('mainUnitId', $event)">
          <option value="all">All</option>
          <option v-for="unit in mainUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Accessory</label>
        <Select :value="draftFilters.accessoryUnitId" @change="onSelectChange('accessoryUnitId', $event)">
          <option value="all">All</option>
          <option v-for="unit in accessoryUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
        </Select>
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
      <div v-if="selectedRelation" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">{{ selectedRelation.mainUnitName }}</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline" :class="getUnitCategoryBadgeClass('main')">Main Product</Badge>
            <Badge variant="outline" :class="getActiveBadgeClass(selectedRelation.status)">
              {{ selectedRelation.status === 'active' ? 'Active' : 'Inactive' }}
            </Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Accessories</h3>
            <div class="mt-3 flex flex-wrap gap-2">
              <Badge
                v-for="name in selectedRelation.accessoryNames"
                :key="name"
                variant="outline"
                :class="getUnitCategoryBadgeClass('accessory')"
              >
                {{ name }}
              </Badge>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Metadata</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Relation ID</p>
                <p>{{ selectedRelation.id }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated</p>
                <p>{{ selectedRelation.updatedAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated By</p>
                <p>{{ selectedRelation.updatedBy }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Accessory Count</p>
                <p>{{ selectedRelation.accessoryNames.length }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button variant="outline" @click="openEdit(selectedRelation)">Edit</Button>
          <Button @click="toggleStatus(selectedRelation)">
            {{ selectedRelation.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
          <Button variant="destructive" @click="deleteRelation(selectedRelation)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Relation not found.</div>
    </Sheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Relation' : 'Add New Relation' }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ formMode === 'edit' ? 'Update mapping and relation status.' : 'Create a main product to accessory mapping.' }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Main Product *</label>
          <Select :value="formValues.mainUnitId" @change="onFormSelect('mainUnitId', $event)">
            <option value="all">Select main product</option>
            <option v-for="unit in mainUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Accessories *</label>
          <Input :value="accessorySearch" placeholder="Search accessories..." @input="onAccessorySearchChange" />
          <div class="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-border/60 p-3">
            <label
              v-for="unit in accessoryOptions"
              :key="unit.id"
              class="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/60"
            >
              <span class="text-sm">{{ unit.name }}</span>
              <Checkbox
                :checked="formValues.accessoryUnitIds.includes(unit.id)"
                @update:checked="(checked) => toggleAccessory(unit.id, checked)"
              />
            </label>
            <p v-if="accessoryOptions.length === 0" class="text-sm text-muted-foreground">No accessories found.</p>
          </div>
          <p class="text-xs text-muted-foreground">{{ formValues.accessoryUnitIds.length }} accessories selected</p>
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
          <Button @click="saveRelation">{{ formMode === 'edit' ? 'Save Changes' : 'Save Relation' }}</Button>
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
import { Cable, CircleCheckBig, CirclePause, Network, Plus } from 'lucide-vue-next'
import { createUnitRelationColumns, type UnitRelationTableRow } from '@/components/master-data/unit-relation/columns'
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
import Checkbox from '@/components/ui/Checkbox.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'
import { getActiveBadgeClass, getUnitCategoryBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { masterUnitsMock, type MasterUnitStatus } from '@/mock/masterUnits'
import { unitRelationsMock, type UnitRelation } from '@/mock/unitRelations'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'

type FilterState = {
  mainUnitId: string
  accessoryUnitId: string
  status: 'all' | MasterUnitStatus
  updatedFrom: string
  updatedTo: string
}

type FormState = {
  mainUnitId: string
  accessoryUnitIds: string[]
  status: MasterUnitStatus
}

const DENSITY_STORAGE_KEY = 'table-density:unit-relations'
const VIEW_STORAGE_KEY = 'table-view:unit-relations'

const defaultFilters: FilterState = {
  mainUnitId: 'all',
  accessoryUnitId: 'all',
  status: 'all',
  updatedFrom: '',
  updatedTo: '',
}

const relations = ref<UnitRelation[]>([...unitRelationsMock])
const density = ref<Density>(loadDensity())
const showAccessories = ref(true)
const showUpdated = ref(true)
const showStatus = ref(true)
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
const selectedRelationId = ref<string | null>(null)

const formOpen = ref(false)
const formMode = ref<FormMode>('create')
const editingId = ref<string | null>(null)
const formError = ref('')
const accessorySearch = ref('')
const formValues = reactive<FormState>({
  mainUnitId: 'all',
  accessoryUnitIds: [],
  status: 'active',
})

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false
columnVisibility.value.accessories = showAccessories.value
columnVisibility.value.updatedAt = showUpdated.value
columnVisibility.value.status = showStatus.value

const mainUnits = computed(() => masterUnitsMock.filter((item) => item.category === 'main'))
const accessoryUnits = computed(() => masterUnitsMock.filter((item) => item.category === 'accessory'))

const unitById = computed(() => {
  const map = new Map<string, typeof masterUnitsMock[number]>()
  for (const unit of masterUnitsMock) map.set(unit.id, unit)
  return map
})

const relationRows = computed<UnitRelationTableRow[]>(() =>
  relations.value
    .map((relation) => {
      const mainUnit = unitById.value.get(relation.mainUnitId)
      if (!mainUnit) return null
      const accessoryNames = relation.accessoryUnitIds
        .map((id) => unitById.value.get(id)?.name)
        .filter((name): name is string => Boolean(name))

      return {
        ...relation,
        mainUnitName: mainUnit.name,
        accessoryNames,
        searchText: `${mainUnit.name} ${accessoryNames.join(' ')}`.toLowerCase(),
      }
    })
    .filter((row): row is UnitRelationTableRow => Boolean(row)),
)

const filteredRows = computed<UnitRelationTableRow[]>(() =>
  relationRows.value.filter((row) => {
    if (filters.mainUnitId !== 'all' && row.mainUnitId !== filters.mainUnitId) return false
    if (filters.accessoryUnitId !== 'all' && !row.accessoryUnitIds.includes(filters.accessoryUnitId)) return false
    if (filters.status !== 'all' && row.status !== filters.status) return false
    if (filters.updatedFrom && row.updatedAt < filters.updatedFrom) return false
    if (filters.updatedTo && row.updatedAt > filters.updatedTo) return false
    return true
  }),
)

const kpi = computed(() => ({
  total: filteredRows.value.length,
  active: filteredRows.value.filter((row) => row.status === 'active').length,
  inactive: filteredRows.value.filter((row) => row.status === 'inactive').length,
  accessoriesLinked: new Set(filteredRows.value.flatMap((row) => row.accessoryUnitIds)).size,
}))

const appliedFiltersCount = computed(() =>
  (filters.mainUnitId !== 'all' ? 1 : 0)
  + (filters.accessoryUnitId !== 'all' ? 1 : 0)
  + (filters.status !== 'all' ? 1 : 0)
  + (filters.updatedFrom ? 1 : 0)
  + (filters.updatedTo ? 1 : 0),
)

const selectedRelation = computed(() =>
  filteredRows.value.find((row) => row.id === selectedRelationId.value)
  ?? relationRows.value.find((row) => row.id === selectedRelationId.value)
  ?? null,
)

const onView = (row: UnitRelationTableRow) => {
  selectedRelationId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: UnitRelationTableRow) => {
  formMode.value = 'edit'
  editingId.value = row.id
  formValues.mainUnitId = row.mainUnitId
  formValues.accessoryUnitIds = [...row.accessoryUnitIds]
  formValues.status = row.status
  accessorySearch.value = ''
  formError.value = ''
  formOpen.value = true
}

const toggleStatus = (row: UnitRelationTableRow) => {
  const nextStatus: MasterUnitStatus = row.status === 'active' ? 'inactive' : 'active'
  relations.value = relations.value.map((relation) =>
    relation.id === row.id
      ? { ...relation, status: nextStatus, updatedAt: today(), updatedBy: 'demo.user' }
      : relation,
  )
}

const deleteRelation = (row: Pick<UnitRelationTableRow, 'id'>) => {
  relations.value = relations.value.filter((relation) => relation.id !== row.id)
  if (selectedRelationId.value === row.id) {
    selectedRelationId.value = null
    detailOpen.value = false
  }
}

const columns = computed<ColumnDef<UnitRelationTableRow>[]>(() => createUnitRelationColumns({
  onView,
  onEdit: openEdit,
  onToggle: toggleStatus,
  onDelete: deleteRelation,
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

const accessoryOptions = computed(() => {
  const query = accessorySearch.value.trim().toLowerCase()
  if (!query) return accessoryUnits.value
  return accessoryUnits.value.filter((unit) => unit.name.toLowerCase().includes(query))
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
  () => [showAccessories.value, showUpdated.value, showStatus.value, showRowNumbers.value],
  () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
    showAccessories: showAccessories.value,
    showUpdated: showUpdated.value,
    showStatus: showStatus.value,
    showRowNumbers: showRowNumbers.value,
  })),
)

const onDensityChange = (value: Density) => {
  density.value = value
}

const onToggleViewOption = (payload: { key: string; value: boolean }) => {
  if (payload.key === 'showAccessories') {
    showAccessories.value = payload.value
    table.getColumn('accessories')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showUpdated') {
    showUpdated.value = payload.value
    table.getColumn('updatedAt')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showStatus') {
    showStatus.value = payload.value
    table.getColumn('status')?.toggleVisibility(payload.value)
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
  if (key === 'mainUnitId' || key === 'accessoryUnitId') {
    draftFilters[key] = target.value
  }
}

const onInputChange = (key: 'updatedFrom' | 'updatedTo', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onAccessorySearchChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  accessorySearch.value = target.value
}

const onFormSelect = (key: 'mainUnitId' | 'status', event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'mainUnitId') {
    formValues.mainUnitId = target.value
    return
  }
  formValues.status = target.value as MasterUnitStatus
}

const toggleAccessory = (unitId: string, checked: boolean) => {
  if (checked) {
    if (!formValues.accessoryUnitIds.includes(unitId)) {
      formValues.accessoryUnitIds = [...formValues.accessoryUnitIds, unitId]
    }
    return
  }
  formValues.accessoryUnitIds = formValues.accessoryUnitIds.filter((id) => id !== unitId)
}

const saveRelation = () => {
  if (formValues.mainUnitId === 'all') {
    formError.value = 'Main product is required.'
    return
  }
  if (formValues.accessoryUnitIds.length === 0) {
    formError.value = 'Select at least one accessory.'
    return
  }

  const nextData: Omit<UnitRelation, 'id'> = {
    mainUnitId: formValues.mainUnitId,
    accessoryUnitIds: [...formValues.accessoryUnitIds],
    status: formValues.status,
    updatedAt: today(),
    updatedBy: 'demo.user',
  }

  if (formMode.value === 'edit' && editingId.value) {
    relations.value = relations.value.map((relation) =>
      relation.id === editingId.value ? { ...relation, ...nextData } : relation,
    )
    selectedRelationId.value = editingId.value
  } else {
    const maxNumber = relations.value.reduce((max, relation) => {
      const parsed = Number(relation.id.replace('UR-', ''))
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)
    const nextId = `UR-${String(maxNumber + 1).padStart(3, '0')}`
    relations.value = [{ id: nextId, ...nextData }, ...relations.value]
    selectedRelationId.value = nextId
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
  formValues.mainUnitId = 'all'
  formValues.accessoryUnitIds = []
  formValues.status = 'active'
  formError.value = ''
  accessorySearch.value = ''
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Main Product', 'Accessories', 'Status', 'Updated', 'Updated By']
  const body = rows.map((row) => [
    row.mainUnitName,
    row.accessoryNames.join(' | '),
    row.status,
    row.updatedAt,
    row.updatedBy,
  ])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `unit-relations-${today()}.csv`
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
      showAccessories?: boolean
      showUpdated?: boolean
      showStatus?: boolean
      showRowNumbers?: boolean
    }
    showAccessories.value = parsed.showAccessories ?? true
    showUpdated.value = parsed.showUpdated ?? true
    showStatus.value = parsed.showStatus ?? true
    showRowNumbers.value = parsed.showRowNumbers ?? true
  } catch {
    showAccessories.value = true
    showUpdated.value = true
    showStatus.value = true
    showRowNumbers.value = true
  }
}
</script>
