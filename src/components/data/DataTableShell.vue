<template>
  <section class="space-y-4">
    <div v-if="title || description" class="space-y-1">
      <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
      <Input
        v-model="localSearch"
        type="search"
        placeholder="Search..."
        class="w-full sm:max-w-xs"
      />
      <Button variant="outline" @click="$emit('update:filters')">Filters</Button>

      <DropdownMenu>
        <template #trigger>
          <Button variant="outline">Columns</Button>
        </template>
        <label
          v-for="col in columns"
          :key="col.key"
          class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        >
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-border"
            :checked="isColumnVisible(col.key)"
            :disabled="col.hideable === false"
            @change="toggleColumn(col)"
          />
          <span>{{ col.label }}</span>
        </label>
      </DropdownMenu>

      <DropdownMenu>
        <template #trigger>
          <Button variant="outline">Density</Button>
        </template>
        <button
          type="button"
          class="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
          :class="density === 'comfortable' ? 'bg-muted' : ''"
          @click="setDensity('comfortable')"
        >
          Comfortable
        </button>
        <button
          type="button"
          class="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
          :class="density === 'compact' ? 'bg-muted' : ''"
          @click="setDensity('compact')"
        >
          Compact
        </button>
      </DropdownMenu>

      <Button variant="outline" @click="$emit('click:export')">Export</Button>
    </div>

    <div class="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in visibleColumns" :key="col.key">
              {{ col.label }}
            </TableHead>
            <TableHead v-if="hasActionsSlot" class="w-[88px] text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell :colspan="visibleColumns.length + (hasActionsSlot ? 1 : 0)">
              <div class="py-8 text-center text-sm text-muted-foreground">Loading...</div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="paginatedRows.length === 0">
            <TableCell :colspan="visibleColumns.length + (hasActionsSlot ? 1 : 0)">
              <div class="py-8 text-center">
                <p class="font-medium">{{ emptyTitleText }}</p>
                <p class="text-sm text-muted-foreground">{{ emptyDescText }}</p>
              </div>
            </TableCell>
          </TableRow>
          <TableRow
            v-for="row in paginatedRows"
            v-else
            :key="rowKey(row)"
            class="cursor-pointer"
            @click="$emit('row:click', row)"
          >
            <TableCell
              v-for="col in visibleColumns"
              :key="`${rowKey(row)}-${col.key}`"
              :class="densityClass"
            >
              {{ row[col.key] ?? '-' }}
            </TableCell>
            <TableCell v-if="hasActionsSlot" class="text-right" :class="densityClass">
              <slot name="row-actions" :row="row" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select :model-value="String(rowsPerPage)" @change="setRowsPerPage">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">
          Prev
        </Button>
        <Button
          v-for="page in totalPages"
          :key="page"
          :variant="page === currentPage ? 'default' : 'outline'"
          class="min-w-10"
          @click="setPage(page)"
        >
          {{ page }}
        </Button>
        <Button variant="outline" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">
          Next
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Table from '@/components/ui/Table.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableCell from '@/components/ui/TableCell.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableRow from '@/components/ui/TableRow.vue'

type DataColumn = {
  key: string
  label: string
  hideable?: boolean
}

type DataRow = Record<string, unknown>
type Density = 'comfortable' | 'compact'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    columns: DataColumn[]
    rows: DataRow[]
    loading?: boolean
    emptyTitle?: string
    emptyDesc?: string
  }>(),
  {
    loading: false,
    emptyTitle: 'No records found',
    emptyDesc: 'Try adjusting search, filters, or column visibility.',
  },
)

const emit = defineEmits<{
  'update:search': [value: string]
  'click:export': []
  'update:filters': []
  'update:columnsVisible': [value: string[]]
  'update:density': [value: Density]
  'row:click': [row: DataRow]
}>()

const slots = useSlots()
const hasActionsSlot = computed(() => Boolean(slots['row-actions']))

const localSearch = ref('')
const density = ref<Density>('comfortable')
const rowsPerPage = ref(10)
const currentPage = ref(1)
const visibleColumnKeys = ref<string[]>(props.columns.map((col) => col.key))

watch(
  () => props.columns,
  (nextColumns) => {
    const nextKeys = nextColumns.map((col) => col.key)
    visibleColumnKeys.value = visibleColumnKeys.value.filter((key) => nextKeys.includes(key))
    for (const key of nextKeys) {
      if (!visibleColumnKeys.value.includes(key)) {
        visibleColumnKeys.value.push(key)
      }
    }
  },
  { deep: true },
)

watch(localSearch, (value) => {
  currentPage.value = 1
  emit('update:search', value)
})

const visibleColumns = computed(() => props.columns.filter((col) => visibleColumnKeys.value.includes(col.key)))

const filteredRows = computed(() => {
  const keyword = localSearch.value.trim().toLowerCase()
  if (!keyword) return props.rows

  return props.rows.filter((row) =>
    props.columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(keyword)),
  )
})

const totalPages = computed(() => {
  const pages = Math.ceil(filteredRows.value.length / rowsPerPage.value)
  return pages > 0 ? pages : 1
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredRows.value.slice(start, start + rowsPerPage.value)
})

const densityClass = computed(() => (density.value === 'comfortable' ? 'py-3 text-sm' : 'py-1.5 text-xs'))
const emptyTitleText = computed(() => props.emptyTitle)
const emptyDescText = computed(() => props.emptyDesc)

const rowKey = (row: DataRow) => {
  const maybeId = row.id ?? row.serialNumber ?? row.rfidCode ?? row.name
  return String(maybeId ?? JSON.stringify(row))
}

const isColumnVisible = (key: string) => visibleColumnKeys.value.includes(key)

const toggleColumn = (column: DataColumn) => {
  if (column.hideable === false) return
  const key = column.key
  if (isColumnVisible(key)) {
    visibleColumnKeys.value = visibleColumnKeys.value.filter((value) => value !== key)
  } else {
    visibleColumnKeys.value = [...visibleColumnKeys.value, key]
  }
  emit('update:columnsVisible', [...visibleColumnKeys.value])
}

const setDensity = (value: Density) => {
  density.value = value
  emit('update:density', value)
}

const setRowsPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  rowsPerPage.value = Number(target.value) || 10
  currentPage.value = 1
}

const setPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}
</script>
