<template>
  <div class="rounded-lg border bg-card">
    <div class="overflow-x-auto overflow-y-visible">
      <Table :class="tableClass">
      <TableHeader class="[&_tr]:border-b [&_th]:sticky [&_th]:top-0 [&_th]:z-10">
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          :class="[headerRowClass, 'bg-muted/40']"
        >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
            class="h-10 px-2 font-medium text-muted-foreground whitespace-nowrap"
            :class="headerCellClass"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b last:border-b-0 hover:bg-muted/30"
            :class="rowClass"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="[cellClass, wrapText ? 'whitespace-normal break-words' : 'whitespace-nowrap']"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell :colspan="table.getAllLeafColumns().length">
            <div class="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <PackageX class="h-8 w-8 text-muted-foreground" />
              <p class="text-sm font-medium">{{ emptyTitle }}</p>
              <p class="text-sm text-muted-foreground">{{ emptyDescription }}</p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FlexRender, type Table as TanStackTable } from '@tanstack/vue-table'
import { PackageX } from 'lucide-vue-next'
import TableBody from '@/components/ui/TableBody.vue'
import TableCell from '@/components/ui/TableCell.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableRow from '@/components/ui/TableRow.vue'
import Table from '@/components/ui/Table.vue'

type Density = 'comfortable' | 'compact'

const props = withDefaults(defineProps<{
  table: TanStackTable<any>
  density: Density
  wrapText?: boolean
  tableClass?: string
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  wrapText: false,
  tableClass: 'max-h-[520px] overflow-auto [&_table]:table-fixed',
  emptyTitle: 'No results',
  emptyDescription: 'Try adjusting filters.',
})

const headerRowClass = computed(() => {
  if (props.density === 'compact') return 'h-8'
  return 'h-11'
})

const headerCellClass = computed(() => {
  if (props.density === 'compact') return 'py-1 text-[11px]'
  return 'py-2 text-xs'
})

const rowClass = computed(() => {
  if (props.density === 'compact') return 'h-8'
  return 'h-12'
})

const cellClass = computed(() => {
  if (props.density === 'compact') return 'px-1.5 py-2 text-xs leading-4'
  return 'px-2 py-3 text-sm leading-5'
})
</script>

