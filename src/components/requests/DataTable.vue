<template>
  <div class="rounded-lg border bg-card overflow-hidden">
    <div class="overflow-x-auto">
      <Table class="min-w-[980px]">
        <TableHeader class="bg-muted/40">
          <TableRow>
            <TableHead
              v-for="column in visibleColumns"
              :key="column.id"
              class="h-10 px-3 text-xs text-muted-foreground"
            >
              {{ column.label }}
            </TableHead>
            <TableHead class="h-10 px-3 text-right text-xs text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.id" class="hover:bg-muted/30">
            <TableCell
              v-for="column in visibleColumns"
              :key="`${row.id}-${column.id}`"
              class="px-3 py-2"
            >
              <template v-if="column.id === 'requestNumber'">
                <Button
                  variant="link"
                  class="h-auto p-0 font-medium"
                  @click="$emit('open', row)"
                >
                  {{ row.requestNumber }}
                </Button>
              </template>
              <template v-else-if="column.id === 'status'">
                <Badge variant="outline" :class="getRequestStatusBadgeClass(row.status)">{{ row.status }}</Badge>
              </template>
              <template v-else>
                {{ getCellValue(row, column.id) }}
              </template>
            </TableCell>
            <TableCell class="px-3 py-2 text-right">
              <RowActionsMenu :actions="rowActions" @select="$emit('action', { action: $event, row })" />
            </TableCell>
          </TableRow>

          <TableRow v-if="rows.length === 0">
            <TableCell :colspan="visibleColumns.length + 1" class="py-10 text-center text-sm text-muted-foreground">
              No requests found. Try adjusting filters.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PageTableColumn } from '@/config/pages'
import type { RowActionItem } from '@/components/list/RowActionsMenu.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Table from '@/components/ui/Table.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableCell from '@/components/ui/TableCell.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableRow from '@/components/ui/TableRow.vue'
import { getRequestStatusBadgeClass } from '@/lib/requestBadges'
import type { LocalRequest } from '@/mock/requests'

defineEmits<{
  open: [row: LocalRequest]
  action: [payload: { action: string; row: LocalRequest }]
}>()

const props = defineProps<{
  rows: LocalRequest[]
  columns: PageTableColumn[]
  rowActions: RowActionItem[]
}>()

const visibleColumns = computed(() => props.columns.filter((column) => column.defaultVisible))

const getCellValue = (row: LocalRequest, key: string) => {
  if (key === 'warehouse') return row.warehouse
  if (key === 'companyName') return row.companyName
  if (key === 'requestType') return row.requestType
  if (key === 'serviceLevel') return row.serviceLevel
  if (key === 'createdDate') return row.createdDate
  return ''
}
</script>
