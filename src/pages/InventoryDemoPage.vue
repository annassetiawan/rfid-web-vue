<template>
  <AppShell :items="navItems" :active-path="route.path" title="Inventory Demo">
    <div class="space-y-6">
      <PageHeader
        title="Inventory (Demo)"
        description="Reusable table page pattern for RFID inventory records."
      >
        <template #meta>
          Last synced: 2026-02-16 17:40
        </template>
        <template #actions>
          <Button variant="outline">Export</Button>
          <Button variant="outline">Filters</Button>
        </template>
      </PageHeader>

      <DataTableShell
        title="Tagged Assets"
        description="Showing sample rows for inventory management."
        :columns="columns"
        :rows="rows"
        empty-title="No assets found"
        empty-desc="Adjust your query or clear filters."
        @update:search="onSearch"
        @update:filters="onFilters"
        @update:columns-visible="onColumnsVisible"
        @update:density="onDensity"
        @click:export="onExport"
        @row:click="onRowClick"
      >
        <template #row-actions="{ row }">
          <Button variant="ghost" class="px-2" @click.stop="onRowAction(row)">
            ...
          </Button>
        </template>
      </DataTableShell>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { Archive, Boxes, ClipboardList, PackageSearch } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import DataTableShell from '@/components/data/DataTableShell.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import Button from '@/components/ui/Button.vue'
import AppShell from '@/layouts/AppShell.vue'

type DemoRow = {
  id: number
  name: string
  serialNumber: string
  rfidCode: string
  inventoryStatus: string
  location: string
  taggedDate: string
  status: string
}

const route = useRoute()

const navItems = [
  { label: 'Overview', to: '/dashboard/overview', icon: Archive, group: 'Dashboard' },
  { label: 'Requests', to: '/requests/local', icon: ClipboardList, group: 'Operations' },
  { label: 'Inventory', to: '/inventory', icon: Boxes, group: 'Operations' },
  { label: 'Inventory (Demo)', to: '/demo/inventory', icon: PackageSearch, group: 'Demo' },
]

const columns = [
  { key: 'name', label: 'Name', hideable: true },
  { key: 'serialNumber', label: 'Serial Number', hideable: true },
  { key: 'rfidCode', label: 'RFID Code', hideable: true },
  { key: 'inventoryStatus', label: 'Inventory Status', hideable: true },
  { key: 'location', label: 'Location', hideable: true },
  { key: 'taggedDate', label: 'Tagged Date', hideable: true },
  { key: 'status', label: 'Status', hideable: true },
]

const rows: DemoRow[] = [
  { id: 1, name: 'Pallet Sensor A', serialNumber: 'SN-1001', rfidCode: 'RFID-A12X', inventoryStatus: 'In Stock', location: 'WH-A / Rack 01', taggedDate: '2026-01-06', status: 'Active' },
  { id: 2, name: 'Container Seal B', serialNumber: 'SN-1002', rfidCode: 'RFID-B13Y', inventoryStatus: 'In Transit', location: 'Dock 2', taggedDate: '2026-01-09', status: 'Active' },
  { id: 3, name: 'Forklift Tag C', serialNumber: 'SN-1003', rfidCode: 'RFID-C14Z', inventoryStatus: 'In Stock', location: 'WH-B / Lane 03', taggedDate: '2026-01-10', status: 'Active' },
  { id: 4, name: 'Return Bin D', serialNumber: 'SN-1004', rfidCode: 'RFID-D15Q', inventoryStatus: 'Reserved', location: 'WH-A / Rack 11', taggedDate: '2026-01-13', status: 'Pending' },
  { id: 5, name: 'Asset Crate E', serialNumber: 'SN-1005', rfidCode: 'RFID-E16R', inventoryStatus: 'In Stock', location: 'WH-C / Zone 2', taggedDate: '2026-01-15', status: 'Active' },
  { id: 6, name: 'Spare Parts F', serialNumber: 'SN-1006', rfidCode: 'RFID-F17S', inventoryStatus: 'Cycle Count', location: 'WH-B / Rack 05', taggedDate: '2026-01-20', status: 'Flagged' },
  { id: 7, name: 'Packaging Unit G', serialNumber: 'SN-1007', rfidCode: 'RFID-G18T', inventoryStatus: 'In Transit', location: 'Outbound Bay', taggedDate: '2026-01-21', status: 'Active' },
  { id: 8, name: 'Dispatch Tag H', serialNumber: 'SN-1008', rfidCode: 'RFID-H19U', inventoryStatus: 'Reserved', location: 'WH-C / Zone 4', taggedDate: '2026-01-25', status: 'Pending' },
  { id: 9, name: 'Inbound Kit I', serialNumber: 'SN-1009', rfidCode: 'RFID-I20V', inventoryStatus: 'In Stock', location: 'WH-A / Rack 06', taggedDate: '2026-01-29', status: 'Active' },
  { id: 10, name: 'Repair Item J', serialNumber: 'SN-1010', rfidCode: 'RFID-J21W', inventoryStatus: 'Hold', location: 'QA Room', taggedDate: '2026-02-01', status: 'Inactive' },
]

const onSearch = (value: string) => console.log('search:', value)
const onFilters = () => console.log('filters clicked')
const onColumnsVisible = (value: string[]) => console.log('columns visible:', value)
const onDensity = (value: 'comfortable' | 'compact') => console.log('density:', value)
const onExport = () => console.log('export clicked')
const onRowClick = (row: Record<string, unknown>) => console.log('row clicked:', row)
const onRowAction = (row: Record<string, unknown>) => console.log('row action:', row)
</script>
