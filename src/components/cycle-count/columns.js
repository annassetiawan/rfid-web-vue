import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import { getCycleCountCategoryBadgeClass, getCycleCountStatusBadgeClass } from '@/lib/statusBadges';
export const createCycleCountColumns = (handlers) => [
    {
        id: 'number',
        enableHiding: true,
        enableSorting: false,
        header: () => h('div', { class: 'w-10 text-center' }, '#'),
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const number = pageIndex * pageSize + row.index + 1;
            return h('div', { class: 'w-10 text-center text-muted-foreground tabular-nums' }, String(number));
        },
    },
    {
        accessorKey: 'countId',
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full min-w-0 items-center px-0 text-left text-xs font-medium text-muted-foreground whitespace-nowrap',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            h('span', { class: 'truncate', title: 'ID' }, 'ID'),
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 shrink-0' }),
        ]),
        cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.countId),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getCycleCountCategoryBadgeClass(row.original.category),
        }, () => row.original.category),
    },
    {
        accessorKey: 'createdDate',
        header: 'Created Date',
    },
    {
        accessorKey: 'operator',
        header: 'Operator',
    },
    {
        accessorKey: 'warehouse',
        header: 'Warehouse',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getCycleCountStatusBadgeClass(row.original.status),
        }, () => row.original.status),
    },
    {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => h('div', { class: 'flex justify-end' }, [
            h(RowActionsMenu, {
                actions: [
                    { key: 'view', label: 'View Detail' },
                    { key: 'start', label: 'Start Count' },
                    { key: 'close', label: 'Cancel Session', destructive: true },
                ],
                onSelect: (key) => {
                    if (key === 'view')
                        handlers.onView(row.original);
                    if (key === 'start')
                        handlers.onStart(row.original);
                    if (key === 'close')
                        handlers.onClose(row.original);
                },
            }),
        ]),
    },
];
