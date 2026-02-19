<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Inventory</p>
      <PageHeader
        title="Inventory List"
        description="Track products and accessories across warehouse locations."
      />
      <Separator />
    </section>

    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="accessories">Accessories</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <ListCard
          title="Products"
          description="Monitor RFID-tagged products across warehouse locations, status, and lifecycle stages."
          compact
        >
            <DataTableToolbar
              :table="table"
              :density="density"
              :applied-filters-count="appliedFiltersCount"
              @open-filters="filtersOpen = true"
              @update:density="density = $event"
              @export-csv="onExportCsv"
              @export-excel="onExportExcel"
            />
            <p class="text-sm text-muted-foreground">{{ table.getFilteredRowModel().rows.length }} results</p>
            <DataTable :table="table" :density="density" />
            <DataTablePagination
              :table="table"
              :density="density"
              :total-rows="table.getFilteredRowModel().rows.length"
            />
        </ListCard>
      </TabsContent>

      <TabsContent value="accessories">
        <ListCard
          title="Accessories"
          description="Track accessory items, availability, and movement details with the same operational controls."
          compact
        >
            <DataTableToolbar
              :table="table"
              :density="density"
              :applied-filters-count="appliedFiltersCount"
              @open-filters="filtersOpen = true"
              @update:density="density = $event"
              @export-csv="onExportCsv"
              @export-excel="onExportExcel"
            />
            <p class="text-sm text-muted-foreground">{{ table.getFilteredRowModel().rows.length }} results</p>
            <DataTable :table="table" :density="density" />
            <DataTablePagination
              :table="table"
              :density="density"
              :total-rows="table.getFilteredRowModel().rows.length"
            />
        </ListCard>
      </TabsContent>
    </Tabs>

    <InventoryFiltersSheet
      v-model="filtersOpen"
      :filters="filters"
      :options="filterOptions"
      @apply="applyFilters"
      @clear="clearFilters"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type ColumnFiltersState,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useVueTable,
} from '@tanstack/vue-table'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import InventoryFiltersSheet from '@/components/inventory/InventoryFiltersSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import { createInventoryColumns, type InventoryItem } from '@/components/inventory/columns'
import { valueUpdater } from '@/lib/utils'
import Separator from '@/components/ui/Separator.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'

type Density = 'comfortable' | 'compact'
type InventoryTab = 'products' | 'accessories'

type InventoryFilters = {
  inventoryStatus: string
  location: string
  condition: string
  stagingStatus: string
  warehouseLocation: string
  dateFrom: string
  dateTo: string
}

const rows = ref<InventoryItem[]>([
  { id: 1, category: 'products', name: 'Pallet Sensor A', serialNumber: 'SN-9001', rfidCode: 'RFID-A1X2', inventoryStatus: 'In Stock', location: 'Warehouse A', taggedDate: '2026-01-04', status: 'active', condition: 'Good', stagingStatus: 'Received', warehouseLocation: 'A-R01' },
  { id: 2, category: 'products', name: 'Crate Tag B', serialNumber: 'SN-9002', rfidCode: 'RFID-B2Y3', inventoryStatus: 'In Transit', location: 'Dock 2', taggedDate: '2026-01-09', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-02' },
  { id: 3, category: 'products', name: 'Bin Marker C', serialNumber: 'SN-9003', rfidCode: 'RFID-C3Z4', inventoryStatus: 'Reserved', location: 'Warehouse B', taggedDate: '2026-01-12', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R04' },
  { id: 4, category: 'products', name: 'Asset Cart D', serialNumber: 'SN-9004', rfidCode: 'RFID-D4Q5', inventoryStatus: 'Assigned', location: 'Packing', taggedDate: '2026-01-16', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'P-11' },
  { id: 5, category: 'products', name: 'Tool Kit E', serialNumber: 'SN-9005', rfidCode: 'RFID-E5W6', inventoryStatus: 'In Stock', location: 'Warehouse C', taggedDate: '2026-01-18', status: 'active', condition: 'Refurbished', stagingStatus: 'Received', warehouseLocation: 'C-R09' },
  { id: 6, category: 'products', name: 'Module Unit F', serialNumber: 'SN-9006', rfidCode: 'RFID-F6R7', inventoryStatus: 'In Transit', location: 'Staging Area', taggedDate: '2026-01-21', status: 'inactive', condition: 'Good', stagingStatus: 'Inbound', warehouseLocation: 'S-03' },
  { id: 7, category: 'accessories', name: 'Tag Bundle G', serialNumber: 'SN-9007', rfidCode: 'RFID-G7T8', inventoryStatus: 'Reserved', location: 'Warehouse A', taggedDate: '2026-01-26', status: 'active', condition: 'Good', stagingStatus: 'Reserved', warehouseLocation: 'A-R08' },
  { id: 8, category: 'accessories', name: 'Spare Label H', serialNumber: 'SN-9008', rfidCode: 'RFID-H8U9', inventoryStatus: 'Assigned', location: 'QC Room', taggedDate: '2026-01-30', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'Q-01' },
  { id: 9, category: 'accessories', name: 'Return Bin I', serialNumber: 'SN-9009', rfidCode: 'RFID-I9V0', inventoryStatus: 'In Stock', location: 'Warehouse B', taggedDate: '2026-02-01', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R02' },
  { id: 10, category: 'accessories', name: 'Transit Box J', serialNumber: 'SN-9010', rfidCode: 'RFID-J0W1', inventoryStatus: 'In Transit', location: 'Dock 1', taggedDate: '2026-02-05', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-01' },
  { id: 11, category: 'accessories', name: 'Rack Sensor K', serialNumber: 'SN-9011', rfidCode: 'RFID-K1X2', inventoryStatus: 'Reserved', location: 'Warehouse C', taggedDate: '2026-02-08', status: 'active', condition: 'Refurbished', stagingStatus: 'Reserved', warehouseLocation: 'C-R11' },
  { id: 12, category: 'accessories', name: 'Batch Item L', serialNumber: 'SN-9012', rfidCode: 'RFID-L2Y3', inventoryStatus: 'Assigned', location: 'Dispatch', taggedDate: '2026-02-10', status: 'inactive', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'DS-07' },
])

const activeTab = ref<InventoryTab>('products')
const filtersOpen = ref(false)
const density = ref<Density>('compact')
const rowSelection = ref({})
const columnVisibility = ref({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const filters = ref<InventoryFilters>({
  inventoryStatus: '',
  location: '',
  condition: '',
  stagingStatus: '',
  warehouseLocation: '',
  dateFrom: '',
  dateTo: '',
})

const rowsByTab = computed(() => rows.value.filter((row) => row.category === activeTab.value))

const filteredRows = computed(() => {
  return rowsByTab.value.filter((row) => {
    if (filters.value.inventoryStatus && row.inventoryStatus !== filters.value.inventoryStatus) return false
    if (filters.value.location && row.location !== filters.value.location) return false
    if (filters.value.condition && row.condition !== filters.value.condition) return false
    if (filters.value.stagingStatus && row.stagingStatus !== filters.value.stagingStatus) return false
    if (filters.value.warehouseLocation && row.warehouseLocation !== filters.value.warehouseLocation) return false
    if (filters.value.dateFrom && row.taggedDate < filters.value.dateFrom) return false
    if (filters.value.dateTo && row.taggedDate > filters.value.dateTo) return false
    return true
  })
})

const filterOptions = computed(() => ({
  inventoryStatus: ['In Stock', 'In Transit', 'Reserved', 'Assigned'],
  location: Array.from(new Set(rowsByTab.value.map((row) => row.location))),
  condition: Array.from(new Set(rowsByTab.value.map((row) => row.condition))),
  stagingStatus: Array.from(new Set(rowsByTab.value.map((row) => row.stagingStatus))),
  warehouseLocation: Array.from(new Set(rowsByTab.value.map((row) => row.warehouseLocation))),
}))

const appliedFiltersCount = computed(() => {
  let count = 0
  if (filters.value.inventoryStatus) count += 1
  if (filters.value.location) count += 1
  if (filters.value.condition) count += 1
  if (filters.value.stagingStatus) count += 1
  if (filters.value.warehouseLocation) count += 1
  if (filters.value.dateFrom || filters.value.dateTo) count += 1
  return count
})

const onEdit = (row: InventoryItem) => {
  const nextName = window.prompt('Edit item name', row.name)
  if (!nextName) return

  const value = nextName.trim()
  if (!value) return

  rows.value = rows.value.map((item) => (item.id === row.id ? { ...item, name: value } : item))
}

const onDeactivate = (row: InventoryItem) => {
  rows.value = rows.value.map((item) =>
    item.id === row.id
      ? {
          ...item,
          status: 'inactive',
        }
      : item,
  )
}

const columns = computed<ColumnDef<InventoryItem>[]>(() =>
  createInventoryColumns({
    onEdit,
    onDeactivate,
  }),
)

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
  enableRowSelection: true,
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

const applyFilters = (nextFilters: InventoryFilters) => {
  filters.value = { ...nextFilters }
  table.setPageIndex(0)
}

const clearFilters = () => {
  filters.value = {
    inventoryStatus: '',
    location: '',
    condition: '',
    stagingStatus: '',
    warehouseLocation: '',
    dateFrom: '',
    dateTo: '',
  }
  table.setPageIndex(0)
}

const onExportCsv = () => console.log('Export CSV clicked')
const onExportExcel = () => console.log('Export Excel clicked')
</script>
