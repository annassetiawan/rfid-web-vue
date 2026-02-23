<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">ASN</p>
      <PageHeader
        title="Advance Shipping Notice"
        description="Track shipment notices before incoming goods are received by warehouse."
      >
        <template #actions>
          <Button @click="router.push('/asn/new')">
            <Plus class="h-4 w-4" />
            Create ASN
          </Button>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <Card class="rounded-lg">
      <ListToolbar>
        <template #search>
          <div class="relative w-full max-w-[420px]">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              class="h-8 w-full pl-9"
              placeholder="Search ASN number, source, tracking..."
            />
          </div>
        </template>

        <template #actions>
          <Button variant="outline" :class="compactToolbarButtonClass" @click="filtersOpen = true">
            <Filter class="h-4 w-4" />
            Filters
            <span
              v-if="appliedFiltersCount > 0"
              class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground"
            >
              {{ appliedFiltersCount }}
            </span>
          </Button>

          <div class="relative">
            <Button variant="outline" :class="compactToolbarButtonClass" @click="densityOpen = !densityOpen">
              <SlidersHorizontal class="h-4 w-4" />
              Density: {{ density === 'compact' ? 'Compact' : 'Comfortable' }}
              <ChevronDown class="h-4 w-4" />
            </Button>
            <div
              v-if="densityOpen"
              class="absolute right-0 z-50 mt-2 min-w-44 rounded-lg border bg-card p-2 text-card-foreground shadow-md"
            >
              <div class="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">Row Density</div>
              <button
                type="button"
                class="inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                :class="density === 'compact' ? 'bg-muted' : ''"
                @click="setDensity('compact')"
              >
                Compact
              </button>
              <button
                type="button"
                class="mt-1 inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                :class="density === 'comfortable' ? 'bg-muted' : ''"
                @click="setDensity('comfortable')"
              >
                Comfortable
              </button>
            </div>
          </div>
        </template>
      </ListToolbar>

      <CardContent class="space-y-4 pt-0">

        <div class="overflow-x-auto overflow-y-hidden rounded-lg border bg-card">
          <table class="w-full min-w-[980px] text-sm">
            <thead class="bg-muted/30">
              <tr class="border-b border-border" :class="headerRowClass">
                <th class="w-[44px] px-2 text-left font-medium text-muted-foreground" :class="headerCellClass">#</th>
                <th class="min-w-[220px] px-2 text-left font-medium text-foreground" :class="headerCellClass">ASN Number</th>
                <th class="min-w-[100px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Source</th>
                <th class="min-w-[220px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Destination Warehouse</th>
                <th class="min-w-[260px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Expected Arrival</th>
                <th class="min-w-[110px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Items</th>
                <th class="min-w-[110px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Status</th>
                <th class="min-w-[110px] px-2 text-left font-medium text-foreground" :class="headerCellClass">Created By</th>
                <th class="w-[60px] px-2 text-right font-medium text-muted-foreground" :class="headerCellClass" />
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredRows.length === 0">
                <td colspan="9" class="px-3 py-10 text-center text-sm text-muted-foreground">
                  No ASN records match the current search/filter.
                </td>
              </tr>

              <tr
                v-for="(row, index) in filteredRows"
                :key="row.id"
                class="border-b border-border/60 transition-colors hover:bg-muted/20"
                :class="bodyRowClass"
              >
                <td :class="cellClass">{{ index + 1 }}</td>
                <td :class="cellClass">
                  <button type="button" class="font-semibold text-primary hover:underline" @click="onView(row)">
                    {{ row.asnNumber }}
                  </button>
                </td>
                <td :class="cellClass">{{ row.source }}</td>
                <td :class="cellClass">{{ row.destinationWarehouse }}</td>
                <td :class="cellClass">{{ row.expectedArrival }}</td>
                <td :class="cellClass">
                  <Badge variant="outline" class="border-slate-300 bg-slate-100 text-slate-700">
                    {{ row.items }} item(s)
                  </Badge>
                </td>
                <td :class="cellClass">
                  <Badge variant="outline" :class="getAsnStatusBadgeClass(row.status)">
                    {{ row.status }}
                  </Badge>
                </td>
                <td :class="cellClass">{{ row.createdBy }}</td>
                <td :class="actionCellClass">
                  <RowActionsMenu :actions="rowActions" @select="(action) => onSelectAction(action, row)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-sm text-muted-foreground">
          Showing {{ resultMeta.start }} to {{ resultMeta.end }} of {{ filteredRows.length }} entries
        </div>
      </CardContent>
    </Card>

    <FilterSheet
      v-model="filtersOpen"
      title="Filters"
      description="Apply ASN filters."
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Status</label>
        <Select v-model="draftFilters.status">
          <option value="all">All Status</option>
          <option value="Created">Created</option>
          <option value="In Transit">In Transit</option>
          <option value="Received">Received</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Source</label>
        <Input v-model="draftFilters.source" placeholder="Filter source..." />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Created By</label>
        <Input v-model="draftFilters.createdBy" placeholder="Filter creator..." />
      </div>
    </FilterSheet>
  </main>

  <Sheet v-model="detailOpen">
    <div v-if="selectedAsn" class="flex h-full flex-col gap-5">
      <div class="space-y-4 border-b border-border/60 pb-4">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">{{ selectedAsn.asnNumber }}</h2>
              <Badge variant="outline" :class="getAsnStatusBadgeClass(selectedAsn.status)">
                {{ selectedAsn.status }}
              </Badge>
            </div>
            <p class="text-sm text-muted-foreground">Advance Shipping Notice detail and item summary.</p>
          </div>
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="detailOpen = false">
            <X class="h-4 w-4" />
          </Button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-muted-foreground">Source Location</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.source }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Destination Warehouse</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.destinationWarehouse }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Carrier</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.carrierName || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Tracking Number</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.trackingNo || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Expected Arrival</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.expectedArrival }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Actual Arrival</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.actualArrival || '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-xs text-muted-foreground">Notes</p>
            <p class="mt-1 text-sm">{{ selectedAsn.notes || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Created By</p>
            <p class="mt-1 text-sm font-medium">{{ selectedAsn.createdBy }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3 overflow-y-auto">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold">Items</h3>
          <Badge variant="outline">{{ selectedAsn.itemsDetail.length }} item(s)</Badge>
        </div>

        <div class="overflow-x-auto overflow-y-hidden rounded-lg border">
          <table class="w-full min-w-[540px] text-sm">
            <thead class="bg-muted/30">
              <tr class="h-10 border-b border-border">
                <th class="px-2 text-left text-xs font-medium">#</th>
                <th class="px-2 text-left text-xs font-medium">Unit</th>
                <th class="px-2 text-left text-xs font-medium">Expected Qty</th>
                <th class="px-2 text-left text-xs font-medium">Received Qty</th>
                <th class="px-2 text-left text-xs font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in selectedAsn.itemsDetail"
                :key="item.id"
                class="border-b border-border/60 last:border-b-0"
              >
                <td class="px-2 py-3 text-sm">{{ index + 1 }}</td>
                <td class="px-2 py-3 text-sm font-medium">{{ item.unit }}</td>
                <td class="px-2 py-3 text-sm">{{ item.expectedQty }}</td>
                <td class="px-2 py-3 text-sm">{{ item.receivedQty }}</td>
                <td class="px-2 py-3 text-sm">{{ item.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4">
        <Button
          v-if="selectedAsn.status === 'Created'"
          variant="outline"
          class="border-violet-300 text-violet-700 hover:bg-violet-50"
          @click="markInTransit(selectedAsn.id)"
        >
          Mark In Transit
        </Button>
        <Button
          v-if="selectedAsn.status !== 'Cancelled'"
          variant="destructive"
          @click="cancelAsn(selectedAsn.id)"
        >
          Cancel
        </Button>
        <Button variant="outline" @click="detailOpen = false">Close</Button>
      </div>
    </div>
  </Sheet>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ChevronDown, Filter, Plus, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListToolbar from '@/components/list/ListToolbar.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'

type AsnStatus = 'Created' | 'In Transit' | 'Received' | 'Cancelled'
type Density = 'compact' | 'comfortable'

type AsnRow = {
  id: string
  asnNumber: string
  source: string
  destinationWarehouse: string
  expectedArrival: string
  items: number
  status: AsnStatus
  createdBy: string
  carrierName: string
  notes: string
  actualArrival?: string
  trackingNo: string
  itemsDetail: Array<{
    id: string
    unit: string
    expectedQty: number
    receivedQty: number
    notes: string
  }>
}

const rows = ref<AsnRow[]>([
  {
    id: 'asn-3',
    asnNumber: 'ASN-202602-0003',
    source: 'zxc',
    destinationWarehouse: 'Teckwah JP',
    expectedArrival: '2026-02-23T00:00:00.000000Z',
    items: 1,
    status: 'Created',
    createdBy: 'hasan',
    carrierName: 'vxcv',
    notes: 'sdf',
    actualArrival: '',
    trackingNo: 'TRK-ASN-0003',
    itemsDetail: [
      { id: 'i-1', unit: 'PAN-WF-500-PWR-AC', expectedQty: 10, receivedQty: 0, notes: '' },
    ],
  },
  {
    id: 'asn-2',
    asnNumber: 'ASN-202602-0002',
    source: 'jepang',
    destinationWarehouse: 'UPS Indonesia',
    expectedArrival: '2027-12-12T00:00:00.000000Z',
    items: 1,
    status: 'Created',
    createdBy: 'hasan',
    carrierName: 'DHL',
    notes: 'Inbound shipment from vendor',
    actualArrival: '',
    trackingNo: 'TRK-ASN-0002',
    itemsDetail: [
      { id: 'i-1', unit: 'RFID Reader Impinj R700', expectedQty: 4, receivedQty: 0, notes: '' },
    ],
  },
  {
    id: 'asn-1',
    asnNumber: 'ASN-202602-0001',
    source: 'asd',
    destinationWarehouse: 'UPS Taiwan',
    expectedArrival: '2026-02-26T00:00:00.000000Z',
    items: 1,
    status: 'In Transit',
    createdBy: 'hasan',
    carrierName: 'JNE',
    notes: 'Handle with care',
    actualArrival: '',
    trackingNo: 'TRK-ASN-0001',
    itemsDetail: [
      { id: 'i-1', unit: 'Printer Zebra ZD421', expectedQty: 2, receivedQty: 0, notes: '' },
    ],
  },
])

const router = useRouter()
const searchQuery = ref('')
const density = ref<Density>('comfortable')
const densityOpen = ref(false)
const filtersOpen = ref(false)
const detailOpen = ref(false)
const selectedAsnId = ref<string | null>(null)
const filters = reactive({
  status: 'all' as 'all' | AsnStatus,
  source: '',
  createdBy: '',
})
const draftFilters = reactive({
  status: 'all' as 'all' | AsnStatus,
  source: '',
  createdBy: '',
})

const rowActions = [
  { key: 'view', label: 'View Detail' },
  { key: 'edit', label: 'Edit ASN' },
  { key: 'cancel', label: 'Cancel ASN', destructive: true },
]

const selectedAsn = computed(() => rows.value.find((row) => row.id === selectedAsnId.value) ?? null)

const filteredRows = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return rows.value.filter((row) => {
    const statusMatch = filters.status === 'all' || row.status === filters.status
    const sourceMatch = !filters.source.trim() || row.source.toLowerCase().includes(filters.source.trim().toLowerCase())
    const createdByMatch =
      !filters.createdBy.trim() || row.createdBy.toLowerCase().includes(filters.createdBy.trim().toLowerCase())
    const searchMatch =
      !keyword ||
      row.asnNumber.toLowerCase().includes(keyword) ||
      row.source.toLowerCase().includes(keyword) ||
      row.destinationWarehouse.toLowerCase().includes(keyword) ||
      row.trackingNo.toLowerCase().includes(keyword)

    return statusMatch && sourceMatch && createdByMatch && searchMatch
  })
})

const appliedFiltersCount = computed(() => {
  let count = 0
  if (filters.status !== 'all') count += 1
  if (filters.source.trim()) count += 1
  if (filters.createdBy.trim()) count += 1
  return count
})

const compactToolbarButtonClass = computed(() => (density.value === 'compact' ? 'h-8 px-2 text-xs' : 'h-8'))
const headerRowClass = computed(() => (density.value === 'compact' ? 'h-8' : 'h-11'))
const headerCellClass = computed(() => (density.value === 'compact' ? 'py-1 text-[11px]' : 'py-2 text-xs'))
const bodyRowClass = computed(() => (density.value === 'compact' ? 'h-8' : 'h-12'))

const resultMeta = computed(() => ({
  start: filteredRows.value.length ? 1 : 0,
  end: filteredRows.value.length,
}))

const cellClass = computed(() =>
  density.value === 'compact'
    ? 'px-1.5 py-2 align-middle text-xs leading-4'
    : 'px-2 py-3 align-middle text-sm leading-5',
)

const actionCellClass = computed(() =>
  density.value === 'compact'
    ? 'px-1.5 py-2 text-right align-middle text-xs leading-4'
    : 'px-2 py-3 text-right align-middle text-sm leading-5',
)

const getAsnStatusBadgeClass = (status: AsnStatus) => {
  if (status === 'Created') return 'border-amber-200/70 bg-amber-50 text-amber-700'
  if (status === 'In Transit') return 'border-blue-200/70 bg-blue-50 text-blue-700'
  if (status === 'Received') return 'border-emerald-200/70 bg-emerald-50 text-emerald-700'
  if (status === 'Cancelled') return 'border-rose-200/70 bg-rose-50 text-rose-700'
  return 'border-slate-200/70 bg-slate-50 text-slate-700'
}

const onView = (row: AsnRow) => {
  selectedAsnId.value = row.id
  detailOpen.value = true
}

const onSelectAction = (action: string, row: AsnRow) => {
  if (action === 'view') {
    onView(row)
    return
  }
  if (action === 'cancel') {
    cancelAsn(row.id)
    return
  }
  if (action === 'edit') {
    router.push('/asn/new')
    return
  }
  console.info('ASN action', action, row.asnNumber)
}

const applyFilters = () => {
  Object.assign(filters, draftFilters)
  filtersOpen.value = false
}

const resetFilters = () => {
  Object.assign(filters, { status: 'all', source: '', createdBy: '' })
  Object.assign(draftFilters, { status: 'all', source: '', createdBy: '' })
  filtersOpen.value = false
}

const setDensity = (value: Density) => {
  density.value = value
  densityOpen.value = false
}

const markInTransit = (id: string) => {
  rows.value = rows.value.map((row) => (row.id === id ? { ...row, status: 'In Transit' } : row))
}

const cancelAsn = (id: string) => {
  rows.value = rows.value.map((row) => (row.id === id ? { ...row, status: 'Cancelled' } : row))
}
</script>
