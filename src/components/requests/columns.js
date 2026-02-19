import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import { getRequestStatusBadgeClass } from '@/lib/requestBadges';
const rowActions = [
    { key: 'view', label: 'View Detail' },
    { key: 'edit', label: 'Edit' },
];
export const createLocalRequestColumns = (handlers) => [
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
        accessorKey: 'requestNumber',
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            'Request Number',
            h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
        ]),
        cell: ({ row }) => h('button', {
            type: 'button',
            class: 'font-medium text-primary underline-offset-4 hover:underline',
            onClick: () => handlers.onView(row.original),
        }, row.original.requestNumber),
    },
    {
        accessorKey: 'warehouse',
        header: 'Warehouse',
    },
    {
        accessorKey: 'companyName',
        header: 'Company Name',
    },
    {
        accessorKey: 'requestType',
        header: 'Request Type',
    },
    {
        accessorKey: 'serviceLevel',
        header: 'Service Level',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getRequestStatusBadgeClass(row.original.status),
        }, () => row.original.status),
    },
    {
        accessorKey: 'createdDate',
        header: 'Created Date',
    },
    {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => h('div', { class: 'flex justify-end' }, [
            h(RowActionsMenu, {
                actions: rowActions,
                onSelect: (key) => {
                    if (key === 'view') {
                        handlers.onView(row.original);
                        return;
                    }
                    if (key === 'edit') {
                        handlers.onEdit(row.original);
                    }
                },
            }),
        ]),
    },
];
