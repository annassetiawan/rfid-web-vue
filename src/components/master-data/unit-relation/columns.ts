import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import type { RowActionItem } from '@/components/list/RowActionsMenu.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import { getActiveBadgeClass, getUnitCategoryBadgeClass } from '@/lib/statusBadges'

export type UnitRelationTableRow = {
  id: string
  mainUnitId: string
  mainUnitName: string
  accessoryUnitIds: string[]
  accessoryNames: string[]
  status: 'active' | 'inactive'
  updatedAt: string
  updatedBy: string
  searchText: string
}

const rowActions: RowActionItem[] = [
  { key: 'view', label: 'View details' },
  { key: 'edit', label: 'Edit' },
  { key: 'toggle', label: 'Toggle status' },
  { key: 'delete', label: 'Delete', destructive: true },
]

export const createUnitRelationColumns = (handlers: {
  onView: (row: UnitRelationTableRow) => void
  onEdit: (row: UnitRelationTableRow) => void
  onToggle: (row: UnitRelationTableRow) => void
  onDelete: (row: UnitRelationTableRow) => void
}): ColumnDef<UnitRelationTableRow>[] => [
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
    accessorKey: 'mainUnitName',
    header: ({ column }) =>
      h('button', {
        type: 'button',
        class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        'Main Product',
        h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
      ]),
    cell: ({ row }) =>
      h('button', {
        type: 'button',
        class: 'font-medium text-primary underline-offset-4 hover:underline',
        onClick: () => handlers.onView(row.original),
      }, row.original.mainUnitName),
  },
  {
    id: 'accessories',
    accessorFn: (row) => row.accessoryNames.join(', '),
    header: 'Accessories',
    cell: ({ row }) => {
      const preview = row.original.accessoryNames.slice(0, 2)
      const more = row.original.accessoryNames.length - preview.length
      return h('div', { class: 'flex flex-wrap items-center gap-1.5' }, [
        ...preview.map((name) => h(Badge, {
          variant: 'outline',
          class: getUnitCategoryBadgeClass('accessory'),
        }, () => name)),
        ...(more > 0 ? [h(Badge, { variant: 'secondary' }, () => `+${more} more`)] : []),
      ])
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) =>
      h('button', {
        type: 'button',
        class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        'Updated',
        h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
      ]),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(Badge, { variant: 'outline', class: getActiveBadgeClass(row.original.status) }, () =>
        row.original.status === 'active' ? 'Active' : 'Inactive',
      ),
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
            if (key === 'toggle') handlers.onToggle(row.original)
            if (key === 'delete') handlers.onDelete(row.original)
          },
        }),
      ]),
  },
]
