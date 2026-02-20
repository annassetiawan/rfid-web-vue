import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import type { RowActionItem } from '@/components/list/RowActionsMenu.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import { getLogisticEmailTypeBadgeClass } from '@/lib/statusBadges'
import type { LogisticEmail } from '@/mock/logisticEmails'

export type LogisticEmailTableRow = LogisticEmail & { searchText: string }

const rowActions: RowActionItem[] = [
  { key: 'view', label: 'View details' },
  { key: 'edit', label: 'Edit' },
  { key: 'copy', label: 'Copy email' },
  { key: 'delete', label: 'Delete', destructive: true },
]

export const typeLabelMap: Record<LogisticEmail['type'], string> = {
  warehouse: 'Warehouse',
  cc: 'CC',
}

export const createLogisticEmailColumns = (handlers: {
  onView: (row: LogisticEmailTableRow) => void
  onEdit: (row: LogisticEmailTableRow) => void
  onCopy: (row: LogisticEmailTableRow) => void
  onDelete: (row: LogisticEmailTableRow) => void
}): ColumnDef<LogisticEmailTableRow>[] => [
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
    accessorKey: 'name',
    header: ({ column }) =>
      h('button', {
        type: 'button',
        class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, ['Name', h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' })]),
    cell: ({ row }) =>
      h('button', {
        type: 'button',
        class: 'font-medium text-primary underline-offset-4 hover:underline',
        onClick: () => handlers.onView(row.original),
      }, row.original.name),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs' }, row.original.email),
  },
  {
    accessorKey: 'warehouseLocation',
    header: 'Warehouse Location',
    cell: ({ row }) => h('span', {
      class: 'block max-w-[260px] truncate',
      title: row.original.warehouseLocation || '-',
    }, row.original.warehouseLocation || '-'),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) =>
      h(Badge, { variant: 'outline', class: getLogisticEmailTypeBadgeClass(row.original.type) }, () =>
        typeLabelMap[row.original.type],
      ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
  },
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
            if (key === 'copy') handlers.onCopy(row.original)
            if (key === 'delete') handlers.onDelete(row.original)
          },
        }),
      ]),
  },
]
