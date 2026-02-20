<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Search</p>
      <PageHeader title="Global Search" description="Find inventory, requests, cycle count, and scanner records instantly." />
      <Separator />
    </section>

    <Card class="rounded-lg">
      <CardContent class="space-y-4 pt-6">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div class="relative flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="draftQuery"
              class="h-10 pl-9"
              placeholder="Search by reference, RFID code, title, or warehouse..."
              @keydown.enter="applySearch"
            />
          </div>
          <Button class="h-10 lg:px-6" @click="applySearch">Search</Button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <Select v-model="typeFilter">
            <option value="all">All Modules</option>
            <option value="inventory">Inventory</option>
            <option value="request">Request</option>
            <option value="cycle-count">Cycle Count</option>
            <option value="scanner">Scanner</option>
          </Select>
          <Select v-model="statusFilter">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Select v-model="warehouseFilter">
            <option value="all">All Warehouse</option>
            <option v-for="warehouse in warehouseOptions" :key="warehouse" :value="warehouse">{{ warehouse }}</option>
          </Select>
          <Button variant="outline" class="h-10 lg:w-auto lg:justify-self-end lg:px-6" @click="resetFilters">Reset Filter</Button>
        </div>
      </CardContent>
    </Card>

    <Tabs v-model="activeTab" class="space-y-0">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="request">Requests</TabsTrigger>
      </TabsList>
    </Tabs>

    <Card class="rounded-lg">
      <CardContent class="space-y-4 pt-6">
        <div
          v-if="showInitialEmptyState"
          class="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 px-6 text-center"
        >
          <Search class="mb-3 h-8 w-8 text-muted-foreground" />
          <p class="text-sm font-medium">Type a keyword to start searching</p>
          <p class="mt-1 max-w-md text-sm text-muted-foreground">
            Try searching by reference, RFID code, title, or warehouse. You can also combine filters for better results.
          </p>
        </div>

        <div
          v-else-if="showNoResultState"
          class="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 px-6 text-center"
        >
          <SearchX class="mb-3 h-8 w-8 text-muted-foreground" />
          <p class="text-sm font-medium">No results found</p>
          <p class="mt-1 max-w-md text-sm text-muted-foreground">
            Try a different keyword, reset filters, or broaden your search scope.
          </p>
        </div>

        <div v-else class="rounded-lg border bg-card overflow-x-auto overflow-y-hidden">
          <Table>
            <TableHeader class="[&_tr]:bg-muted/40">
              <TableRow>
                <TableHead class="w-[110px]">Module</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>RFID Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead class="w-[60px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in pagedRows" :key="row.id" class="hover:bg-muted/30">
                <TableCell>
                  <span class="text-sm font-medium text-foreground">{{ formatModule(row.type) }}</span>
                </TableCell>
                <TableCell class="font-medium">{{ row.reference }}</TableCell>
                <TableCell>{{ row.title }}</TableCell>
                <TableCell>{{ row.warehouse }}</TableCell>
                <TableCell class="font-mono text-xs">{{ row.rfidCode }}</TableCell>
                <TableCell>
                  <Badge variant="outline" :class="getWorkflowStatusBadgeClass(row.status)">{{ formatStatus(row.status) }}</Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ row.updatedAt }}</TableCell>
                <TableCell class="text-right">
                  <RowActionsMenu :actions="rowActions" @select="(action) => onSelectAction(action, row)" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div v-if="!showInitialEmptyState && !showNoResultState" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-muted-foreground">
            Showing {{ startItem }}-{{ endItem }} of {{ filteredRows.length }} results
          </p>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage -= 1">Previous</Button>
            <Badge variant="outline">Page {{ currentPage }} / {{ totalPages }}</Badge>
            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage += 1">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search, SearchX } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/list/PageHeader.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Table from '@/components/ui/Table.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableCell from '@/components/ui/TableCell.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableRow from '@/components/ui/TableRow.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import { getWorkflowStatusBadgeClass } from '@/lib/statusBadges'
import { searchMockData, type SearchRecord, type SearchRecordStatus } from '@/mock/search'

const router = useRouter()
const route = useRoute()
const pageSize = 8

const draftQuery = ref(String(route.query.q ?? ''))
const appliedQuery = ref(String(route.query.q ?? ''))
const activeTab = ref<'all' | 'inventory' | 'request'>('all')
const typeFilter = ref<'all' | SearchRecord['type']>('all')
const statusFilter = ref<'all' | SearchRecordStatus>('all')
const warehouseFilter = ref('all')
const currentPage = ref(1)

const warehouseOptions = Array.from(new Set(searchMockData.map((item) => item.warehouse)))
const rowActions = [
  { key: 'view', label: 'View Detail' },
]

const filteredRows = computed(() =>
  searchMockData.filter((row) => {
    const tabMatch = activeTab.value === 'all' || row.type === activeTab.value
    const typeMatch = typeFilter.value === 'all' || row.type === typeFilter.value
    const statusMatch = statusFilter.value === 'all' || row.status === statusFilter.value
    const warehouseMatch = warehouseFilter.value === 'all' || row.warehouse === warehouseFilter.value
    const keyword = appliedQuery.value.trim().toLowerCase()
    const searchMatch = !keyword
      || row.reference.toLowerCase().includes(keyword)
      || row.title.toLowerCase().includes(keyword)
      || row.rfidCode.toLowerCase().includes(keyword)
      || row.warehouse.toLowerCase().includes(keyword)

    return tabMatch && typeMatch && statusMatch && warehouseMatch && searchMatch
  }),
)

const hasActiveCriteria = computed(() =>
  appliedQuery.value.trim().length > 0
  || activeTab.value !== 'all'
  || typeFilter.value !== 'all'
  || statusFilter.value !== 'all'
  || warehouseFilter.value !== 'all',
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))
const startItem = computed(() => (filteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1))
const endItem = computed(() => Math.min(filteredRows.value.length, currentPage.value * pageSize))
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

watch([activeTab, typeFilter, statusFilter, warehouseFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value
})

const resetFilters = () => {
  draftQuery.value = ''
  appliedQuery.value = ''
  activeTab.value = 'all'
  typeFilter.value = 'all'
  statusFilter.value = 'all'
  warehouseFilter.value = 'all'
  currentPage.value = 1
  router.replace({ query: {} })
}

const applySearch = () => {
  appliedQuery.value = draftQuery.value.trim()
  currentPage.value = 1
  router.replace({
    query: appliedQuery.value ? { ...route.query, q: appliedQuery.value } : Object.fromEntries(Object.entries(route.query).filter(([key]) => key !== 'q')),
  })
}

const showInitialEmptyState = computed(() => !hasActiveCriteria.value)
const showNoResultState = computed(() => hasActiveCriteria.value && filteredRows.value.length === 0)

const formatStatus = (status: SearchRecordStatus) => {
  if (status === 'in-progress') return 'In Progress'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatModule = (type: SearchRecord['type']) => {
  if (type === 'cycle-count') return 'Cycle Count'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const onSelectAction = (action: string, row: SearchRecord) => {
  if (action !== 'view') return

  if (row.type === 'request') {
    router.push('/requests/local')
    return
  }

  if (row.type === 'inventory') {
    router.push('/inventory')
    return
  }

  if (row.type === 'cycle-count') {
    router.push('/cycle-count')
    return
  }

  router.push('/scanner')
}
</script>
