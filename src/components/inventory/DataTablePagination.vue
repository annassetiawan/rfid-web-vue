<template>
  <div class="flex items-center justify-between px-4 py-4">
    <div class="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
      <span class="whitespace-nowrap">Rows per page</span>
      <Select
        :value="String(table.getState().pagination.pageSize)"
        class="h-8 w-[72px]"
        @change="onPageSizeChange"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </Select>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">Page</span>
      <Badge variant="outline">{{ pageLabel }}</Badge>
      <span class="text-sm text-muted-foreground">of {{ totalPages }}</span>

      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!table.getCanPreviousPage()"
        @click="table.setPageIndex(0)"
      >
        <ChevronsLeft class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!table.getCanNextPage()"
        @click="table.setPageIndex(totalPages - 1)"
      >
        <ChevronsRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Table } from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'

type Density = 'comfortable' | 'compact'

const props = defineProps<{
  table: Table<any>
  density: Density
  totalRows: number
}>()

const totalPages = computed(() => props.table.getPageCount())
const pageLabel = computed(() => props.table.getState().pagination.pageIndex + 1)

const onPageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  props.table.setPageSize(Number(target.value))
}
</script>

