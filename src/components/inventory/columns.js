import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import Badge from '@/components/ui/Badge.vue';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import { getActiveBadgeClass, getConditionBadgeClass, getInventoryBadgeClass, getStagingBadgeClass, } from '@/lib/statusBadges';
export const createInventoryColumns = (handlers) => [
    {
        id: 'number',
        enableHiding: false,
        enableSorting: false,
        header: () => h('div', { class: 'w-10 text-center' }, '#'),
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const number = pageIndex * pageSize + row.index + 1;
            return h('div', { class: 'w-10 text-center text-muted-foreground tabular-nums' }, String(number));
        },
    },
    {
        accessorKey: 'name',
        cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.name),
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            'Name',
            h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' }),
        ]),
    },
    {
        accessorKey: 'serialNumber',
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full min-w-0 items-center px-0 text-left text-xs font-medium text-muted-foreground whitespace-nowrap',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, [
            h('span', { class: 'truncate', title: 'Serial Number' }, 'Serial Number'),
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 shrink-0' }),
        ]),
    },
    {
        accessorKey: 'rfidCode',
        header: 'RFID Code',
        cell: ({ row }) => h('span', {
            class: 'block truncate font-mono text-[11px] tracking-wide',
            title: row.original.rfidCode,
        }, row.original.rfidCode),
    },
    {
        accessorKey: 'inventoryStatus',
        header: () => h('span', { class: 'block truncate', title: 'Inventory Status' }, 'Inventory Status'),
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getInventoryBadgeClass(row.original.inventoryStatus),
        }, () => row.original.inventoryStatus),
    },
    {
        accessorKey: 'location',
        header: () => h('span', { class: 'block truncate', title: 'Location' }, 'Location'),
    },
    {
        accessorKey: 'condition',
        header: 'Condition',
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getConditionBadgeClass(row.original.condition),
        }, () => row.original.condition),
    },
    {
        accessorKey: 'stagingStatus',
        header: () => h('span', { class: 'block truncate', title: 'Staging Status' }, 'Staging Status'),
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getStagingBadgeClass(row.original.stagingStatus),
        }, () => row.original.stagingStatus),
    },
    {
        accessorKey: 'warehouseLocation',
        header: () => h('span', { class: 'block truncate', title: 'Warehouse Location' }, 'Warehouse Location'),
    },
    {
        accessorKey: 'taggedDate',
        header: () => h('span', { class: 'block truncate', title: 'Tagged Date' }, 'Tagged Date'),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, {
            variant: 'outline',
            class: getActiveBadgeClass(row.original.status),
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
                    { key: 'edit', label: 'Edit' },
                    { key: 'deactivate', label: 'Deactivate', destructive: true },
                ],
                onSelect: (key) => {
                    if (key === 'edit') {
                        handlers.onEdit(row.original);
                        return;
                    }
                    if (key === 'deactivate') {
                        handlers.onDeactivate(row.original);
                    }
                },
            }),
        ]),
    },
];
