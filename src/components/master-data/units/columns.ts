import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import type { RowActionItem } from '@/components/list/RowActionsMenu.vue'
import RowActionsMenu from '@/components/list/RowActionsMenu.vue'
import Badge from '@/components/ui/Badge.vue'
import { getActiveBadgeClass, getUnitCategoryBadgeClass } from '@/lib/statusBadges'
import type { MasterUnit } from '@/mock/masterUnits'

export type MasterUnitTableRow = MasterUnit & { searchText: string }

const rowActions: RowActionItem[] = [
  { key: 'view', label: 'View details' },
  { key: 'edit', label: 'Edit' },
  { key: 'toggle', label: 'Toggle status' },
  { key: 'delete', label: 'Delete', destructive: true },
]

export const createMasterUnitColumns = (handlers: {
  onView: (row: MasterUnitTableRow) => void
  onEdit: (row: MasterUnitTableRow) => void
  onToggle: (row: MasterUnitTableRow) => void
  onDelete: (row: MasterUnitTableRow) => void
}): ColumnDef<MasterUnitTableRow>[] => [
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
      }, [
        'Name',
        h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
      ]),
    cell: ({ row }) =>
      h('button', {
        type: 'button',
        class: 'font-medium text-primary underline-offset-4 hover:underline',
        onClick: () => handlers.onView(row.original),
      }, row.original.name),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) =>
      h(
        Badge,
        { variant: 'outline', class: getUnitCategoryBadgeClass(row.original.category) },
        () => row.original.category === 'main' ? 'Main Product' : 'Accessory',
      ),
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) =>
      row.original.imageUrl
        ? h('img', { class: 'h-10 w-10 rounded-md border object-cover', src: row.original.imageUrl, alt: row.original.name })
        : h('div', {
          class: 'flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-xs font-semibold text-muted-foreground',
        }, row.original.name.slice(0, 2).toUpperCase()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(Badge, { variant: 'outline', class: getActiveBadgeClass(row.original.status) }, () => row.original.status === 'active' ? 'Active' : 'Inactive'),
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
            if (key === 'toggle') handlers.onToggle(row.original)
            if (key === 'delete') handlers.onDelete(row.original)
          },
        }),
      ]),
  },
]

