import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import { getActiveBadgeClass } from '@/lib/statusBadges';
const rowActions = [
    { key: 'view', label: 'View details' },
    { key: 'edit', label: 'Edit' },
    { key: 'toggle', label: 'Toggle status' },
    { key: 'delete', label: 'Delete', destructive: true },
];
export const createWarehouseColumns = (handlers) => [
    {
        id: 'number',
        enableSorting: false,
        enableHiding: true,
        header: () => h('div', { class: 'w-10 text-center' }, '#'),
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const number = pageIndex * pageSize + row.index + 1;
            return h('div', { class: 'w-10 text-center text-muted-foreground tabular-nums' }, String(number));
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
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            'Warehouse',
            h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
        ]),
        cell: ({ row }) => h('button', {
            type: 'button',
            class: 'block w-full text-left font-medium text-primary underline-offset-4 hover:underline',
            onClick: () => handlers.onView(row.original),
        }, row.original.name),
    },
    { accessorKey: 'code', header: 'Code' },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => h('span', { class: 'block max-w-[320px] truncate', title: row.original.address }, row.original.address),
    },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'zipCode', header: 'Zip Code' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, { variant: 'outline', class: getActiveBadgeClass(row.original.status) }, () => row.original.status === 'active' ? 'Active' : 'Inactive'),
    },
    { accessorKey: 'updatedAt', header: 'Updated At' },
    {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => h('div', { class: 'flex justify-end' }, [
            h(RowActionsMenu, {
                actions: rowActions,
                onSelect: (key) => {
                    if (key === 'view')
                        handlers.onView(row.original);
                    if (key === 'edit')
                        handlers.onEdit(row.original);
                    if (key === 'toggle')
                        handlers.onToggle(row.original);
                    if (key === 'delete')
                        handlers.onDelete(row.original);
                },
            }),
        ]),
    },
];
