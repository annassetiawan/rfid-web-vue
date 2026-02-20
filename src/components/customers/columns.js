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
export const createCustomerColumns = (handlers) => [
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
        accessorKey: 'companyName',
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full max-w-full items-center justify-start gap-1 overflow-hidden px-0 pr-1 text-left text-xs font-medium text-muted-foreground whitespace-nowrap',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            h('span', { class: 'truncate', title: 'Company Name' }, 'Company Name'),
            h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
        ]),
        cell: ({ row }) => h('button', {
            type: 'button',
            class: 'w-full text-left font-medium text-primary underline-offset-4 hover:underline',
            title: row.original.companyName,
            onClick: () => handlers.onView(row.original),
        }, [
            h('span', {
                class: 'block max-w-[260px] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] whitespace-normal leading-5',
            }, row.original.companyName),
        ]),
    },
    { accessorKey: 'address', header: 'Address' },
    { accessorKey: 'zipCode', header: 'Zip Code' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'contactName', header: 'Contact Name' },
    { accessorKey: 'contactPhone', header: 'Contact Phone' },
    { accessorKey: 'contactEmail', header: 'Contact Email' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, { variant: 'outline', class: getActiveBadgeClass(row.original.status) }, () => row.original.status === 'active' ? 'Active' : 'Inactive'),
    },
    {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => h('div', { class: 'min-w-[72px] pr-2 text-right' }, 'Actions'),
        cell: ({ row }) => h('div', { class: 'flex min-w-[72px] justify-end pr-2' }, [
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
