import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import type { RowActionItem } from '@/components/list/RowActionsMenu.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import { getScannerStateBadgeClass } from '@/lib/statusBadges'
import type { Scanner, ScannerState } from '@/mock/scanners'

export type ScannerTableRow = Scanner & { searchText: string }

const rowActions: RowActionItem[] = [
  { key: 'view', label: 'View details' },
  { key: 'edit', label: 'Edit' },
  { key: 'working', label: 'Mark as Working' },
  { key: 'faulty', label: 'Mark as Faulty' },
  { key: 'test', label: 'Mark as Test' },
  { key: 'copy', label: 'Copy Serial' },
  { key: 'delete', label: 'Delete', destructive: true },
]

export const createScannerColumns = (handlers: {
  onView: (row: ScannerTableRow) => void
  onEdit: (row: ScannerTableRow) => void
  onSetState: (row: ScannerTableRow, state: ScannerState) => void
  onCopy: (row: ScannerTableRow) => void
  onDelete: (row: ScannerTableRow) => void
}): ColumnDef<ScannerTableRow>[] => [
  {
    id: 'number',
    enableSorting: false,
    enableHiding: true,
    header: () => h('div', { class: 'w-10 text-center' }, '#'),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      const number = pageIndex * pageSize + row.index + 1
      return h('div', { class: 'w-10 text-center text-muted-foreground tabular-nums' }, String(number))
    },
  },
  {
    accessorKey: 'searchText',
    enableSorting: false,
    enableHiding: false,
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: 'serialNumber',
    header: ({ column }) =>
      h('button', {
        type: 'button',
        class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        'Serial Number',
        h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
      ]),
    cell: ({ row }) =>
      h('button', {
        type: 'button',
        class: 'font-mono text-primary underline-offset-4 hover:underline',
        onClick: () => handlers.onView(row.original),
      }, row.original.serialNumber),
  },
  { accessorKey: 'modelName', header: 'Model Name' },
  { accessorKey: 'brand', header: 'Brand' },
  { accessorKey: 'location', header: 'Location' },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) =>
      h('span', { class: 'block max-w-[320px] truncate', title: row.original.description }, row.original.description || '-'),
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) =>
      h(Badge, { variant: 'outline', class: getScannerStateBadgeClass(row.original.state) }, () => formatState(row.original.state)),
  },
  { accessorKey: 'updatedAt', header: 'Updated At' },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-end' }, [
        h(RowActionsMenu, {
          actions: rowActions,
          onSelect: (key: string) => {
            if (key === 'view') handlers.onView(row.original)
            if (key === 'edit') handlers.onEdit(row.original)
            if (key === 'working') handlers.onSetState(row.original, 'working')
            if (key === 'faulty') handlers.onSetState(row.original, 'faulty')
            if (key === 'test') handlers.onSetState(row.original, 'test')
            if (key === 'copy') handlers.onCopy(row.original)
            if (key === 'delete') handlers.onDelete(row.original)
          },
        }),
      ]),
  },
]

function formatState(state: ScannerState) {
  if (state === 'new') return 'New'
  if (state === 'working') return 'Working'
  if (state === 'faulty') return 'Faulty'
  return 'Test'
}

