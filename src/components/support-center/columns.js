import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import { getTicketPriorityBadgeClass, getTicketStatusBadgeClass, getTicketTypeBadgeClass, } from '@/lib/statusBadges';
export const ticketTypeLabelMap = {
    bug: 'Bug',
    request: 'Request',
    question: 'Question',
};
export const ticketStatusLabelMap = {
    open: 'Open',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};
export const ticketPriorityLabelMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};
const rowActions = [
    { key: 'view', label: 'View details' },
    { key: 'edit', label: 'Edit' },
    { key: 'in-progress', label: 'Set In Progress' },
    { key: 'resolved', label: 'Set Resolved' },
    { key: 'delete', label: 'Delete', destructive: true },
];
export const createSupportTicketColumns = (handlers) => [
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
        accessorKey: 'id',
        header: 'Ticket ID',
        cell: ({ row }) => h('span', { class: 'font-mono text-xs' }, row.original.id),
    },
    {
        accessorKey: 'subject',
        header: ({ column }) => h('button', {
            type: 'button',
            class: 'inline-flex h-8 w-full items-center justify-start gap-2 px-0 text-left text-xs font-medium text-muted-foreground',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, ['Subject', h(ArrowUpDown, { class: 'h-3.5 w-3.5 shrink-0' })]),
        cell: ({ row }) => h('button', {
            type: 'button',
            class: 'font-medium text-primary underline-offset-4 hover:underline',
            onClick: () => handlers.onView(row.original),
        }, row.original.subject),
    },
    {
        id: 'requestor',
        header: 'Requestor',
        accessorFn: (row) => `${row.requestorName} ${row.requestorEmail}`,
        cell: ({ row }) => h('div', { class: 'space-y-0.5' }, [
            h('p', row.original.requestorName),
            h('p', { class: 'text-xs text-muted-foreground' }, row.original.requestorEmail),
        ]),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => h(Badge, { variant: 'outline', class: getTicketTypeBadgeClass(row.original.type) }, () => ticketTypeLabelMap[row.original.type]),
    },
    {
        id: 'category',
        header: 'Category/Subcategory',
        accessorFn: (row) => `${row.category} ${row.subcategory}`,
        cell: ({ row }) => h('span', {
            class: 'block max-w-[220px] truncate',
            title: `${row.original.category} / ${row.original.subcategory || '-'}`,
        }, `${row.original.category} / ${row.original.subcategory || '-'}`),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(Badge, { variant: 'outline', class: getTicketStatusBadgeClass(row.original.status) }, () => ticketStatusLabelMap[row.original.status]),
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => h(Badge, { variant: 'outline', class: getTicketPriorityBadgeClass(row.original.priority) }, () => ticketPriorityLabelMap[row.original.priority]),
    },
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
                    if (key === 'in-progress')
                        handlers.onSetStatus(row.original, 'in-progress');
                    if (key === 'resolved')
                        handlers.onSetStatus(row.original, 'resolved');
                    if (key === 'delete')
                        handlers.onDelete(row.original);
                },
            }),
        ]),
    },
];
