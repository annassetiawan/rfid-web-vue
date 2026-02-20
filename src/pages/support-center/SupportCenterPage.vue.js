import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { Plus } from 'lucide-vue-next';
import { createSupportTicketColumns, ticketPriorityLabelMap, ticketStatusLabelMap, ticketTypeLabelMap } from '@/components/support-center/columns';
import DataTable from '@/components/inventory/DataTable.vue';
import DataTablePagination from '@/components/inventory/DataTablePagination.vue';
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue';
import FilterSheet from '@/components/list/FilterSheet.vue';
import ListCard from '@/components/list/ListCard.vue';
import PageHeader from '@/components/list/PageHeader.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import Sheet from '@/components/ui/Sheet.vue';
import Textarea from '@/components/ui/Textarea.vue';
import { getTicketPriorityBadgeClass, getTicketStatusBadgeClass, getTicketTypeBadgeClass } from '@/lib/statusBadges';
import { valueUpdater } from '@/lib/utils';
import { ticketsMock } from '@/mock/tickets';
import { usersMock } from '@/mock/users';
const DENSITY_STORAGE_KEY = 'table-density:support-tickets';
const VIEW_STORAGE_KEY = 'table-view:support-tickets';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultFilters = { status: 'all', priority: 'all', type: 'all', category: 'all', createdFrom: '', createdTo: '' };
const defaultForm = { subject: '', requestorName: '', requestorEmail: '', type: 'request', category: 'Request', subcategory: '', description: '', priority: 'medium' };
const tickets = ref([...ticketsMock]);
const density = ref(loadDensity());
const showTicketId = ref(true);
const showRequestor = ref(true);
const showType = ref(true);
const showCategory = ref(true);
const showCreated = ref(true);
const showStatus = ref(true);
const showPriority = ref(true);
const showRowNumbers = ref(true);
const filtersOpen = ref(false);
const detailOpen = ref(false);
const formOpen = ref(false);
const deleteOpen = ref(false);
const selectedTicketId = ref(null);
const deleteCandidate = ref(null);
const formMode = ref('create');
const editingId = ref(null);
const formError = ref('');
const commentMessage = ref('');
const commentVisibility = ref('public');
const filters = reactive({ ...defaultFilters });
const draftFilters = reactive({ ...defaultFilters });
const formValues = reactive({ ...defaultForm });
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });
loadViewState();
columnVisibility.value = { number: showRowNumbers.value, searchText: false, id: showTicketId.value, requestor: showRequestor.value, type: showType.value, category: showCategory.value, createdAt: showCreated.value, status: showStatus.value, priority: showPriority.value };
const categories = computed(() => Array.from(new Set(tickets.value.map((t) => t.category))));
const assigneeOptions = computed(() => Array.from(new Set(usersMock.map((u) => u.name))));
const selectedTicket = computed(() => tickets.value.find((t) => t.id === selectedTicketId.value) ?? null);
const filteredRows = computed(() => tickets.value.filter((t) => (filters.status === 'all' || t.status === filters.status) && (filters.priority === 'all' || t.priority === filters.priority) && (filters.type === 'all' || t.type === filters.type) && (filters.category === 'all' || t.category === filters.category) && (!filters.createdFrom || t.createdAt >= filters.createdFrom) && (!filters.createdTo || t.createdAt <= filters.createdTo)).map((t) => ({ ...t, searchText: `${t.id} ${t.subject} ${t.requestorName} ${t.requestorEmail}`.toLowerCase() })));
const appliedFiltersCount = computed(() => (filters.status !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0) + (filters.type !== 'all' ? 1 : 0) + (filters.category !== 'all' ? 1 : 0) + (filters.createdFrom ? 1 : 0) + (filters.createdTo ? 1 : 0));
const kpi = computed(() => ({ open: tickets.value.filter((t) => t.status === 'open').length, inProgress: tickets.value.filter((t) => t.status === 'in-progress').length, resolved: tickets.value.filter((t) => t.status === 'resolved').length, avgResponse: '2h 10m' }));
const viewOptions = computed(() => [{ key: 'showTicketId', label: 'Show ticket ID', checked: showTicketId.value }, { key: 'showRequestor', label: 'Show requestor', checked: showRequestor.value }, { key: 'showType', label: 'Show type', checked: showType.value }, { key: 'showCategory', label: 'Show category', checked: showCategory.value }, { key: 'showCreated', label: 'Show created', checked: showCreated.value }, { key: 'showStatus', label: 'Show status', checked: showStatus.value }, { key: 'showPriority', label: 'Show priority', checked: showPriority.value }, { key: 'showRowNumbers', label: 'Show row numbers', checked: showRowNumbers.value }]);
const onView = (row) => { selectedTicketId.value = row.id; detailOpen.value = true; };
const openCreate = () => { resetForm(); formMode.value = 'create'; formOpen.value = true; };
const openEdit = (row) => { formMode.value = 'edit'; editingId.value = row.id; Object.assign(formValues, row); formError.value = ''; formOpen.value = true; };
const openDelete = (row) => { deleteCandidate.value = row; deleteOpen.value = true; };
const onDelete = (row) => { const found = tickets.value.find((t) => t.id === row.id); if (found)
    openDelete(found); };
const onSetStatus = (row, status) => setTicketStatus(row.id, status);
const columns = computed(() => createSupportTicketColumns({ onView, onEdit: openEdit, onSetStatus, onDelete }));
const table = useVueTable({ get data() { return filteredRows.value; }, get columns() { return columns.value; }, state: { get rowSelection() { return rowSelection.value; }, get columnVisibility() { return columnVisibility.value; }, get columnFilters() { return columnFilters.value; }, get sorting() { return sorting.value; }, get pagination() { return pagination.value; } }, onRowSelectionChange: (u) => valueUpdater(u, rowSelection), onColumnVisibilityChange: (u) => valueUpdater(u, columnVisibility), onColumnFiltersChange: (u) => valueUpdater(u, columnFilters), onSortingChange: (u) => valueUpdater(u, sorting), onPaginationChange: (u) => valueUpdater(u, pagination), getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });
watch(() => filtersOpen.value, (open) => { if (open)
    Object.assign(draftFilters, filters); });
watch(() => density.value, (v) => localStorage.setItem(DENSITY_STORAGE_KEY, v));
watch(() => [showTicketId.value, showRequestor.value, showType.value, showCategory.value, showCreated.value, showStatus.value, showPriority.value, showRowNumbers.value], () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ showTicketId: showTicketId.value, showRequestor: showRequestor.value, showType: showType.value, showCategory: showCategory.value, showCreated: showCreated.value, showStatus: showStatus.value, showPriority: showPriority.value, showRowNumbers: showRowNumbers.value })));
const onToggleViewOption = ({ key, value }) => { if (key === 'showTicketId') {
    showTicketId.value = value;
    table.getColumn('id')?.toggleVisibility(value);
} if (key === 'showRequestor') {
    showRequestor.value = value;
    table.getColumn('requestor')?.toggleVisibility(value);
} if (key === 'showType') {
    showType.value = value;
    table.getColumn('type')?.toggleVisibility(value);
} if (key === 'showCategory') {
    showCategory.value = value;
    table.getColumn('category')?.toggleVisibility(value);
} if (key === 'showCreated') {
    showCreated.value = value;
    table.getColumn('createdAt')?.toggleVisibility(value);
} if (key === 'showStatus') {
    showStatus.value = value;
    table.getColumn('status')?.toggleVisibility(value);
} if (key === 'showPriority') {
    showPriority.value = value;
    table.getColumn('priority')?.toggleVisibility(value);
} if (key === 'showRowNumbers') {
    showRowNumbers.value = value;
    table.getColumn('number')?.toggleVisibility(value);
} };
const onDensityChange = (value) => { density.value = value; };
const applyFilters = () => { Object.assign(filters, draftFilters); table.setPageIndex(0); filtersOpen.value = false; };
const resetFilters = () => { Object.assign(draftFilters, defaultFilters); Object.assign(filters, defaultFilters); table.setPageIndex(0); filtersOpen.value = false; };
const onFilterSelect = (key, event) => { const target = event.target; ; draftFilters[key] = target.value; };
const onFilterInput = (key, event) => { draftFilters[key] = event.target.value; };
const onFormInput = (key, event) => { ; formValues[key] = event.target.value; };
const onFormSelect = (key, event) => { ; formValues[key] = event.target.value; };
const onCommentVisibilityChange = (event) => { commentVisibility.value = event.target.value; };
const onDetailStatusChange = (event) => { if (selectedTicket.value)
    setTicketStatus(selectedTicket.value.id, event.target.value); };
const onDetailAssigneeChange = (event) => { if (selectedTicket.value)
    setTicketAssignee(selectedTicket.value.id, event.target.value === 'unassigned' ? '' : event.target.value); };
const saveTicket = () => {
    const subject = formValues.subject.trim();
    const name = formValues.requestorName.trim();
    const email = formValues.requestorEmail.trim().toLowerCase();
    const desc = formValues.description.trim();
    if (!subject || !name || !email || !desc) {
        formError.value = 'Subject, Requestor Name, Requestor Email, and Description are required.';
        return;
    }
    if (!emailRegex.test(email)) {
        formError.value = 'Requestor Email format is invalid.';
        return;
    }
    const now = today();
    if (formMode.value === 'edit' && editingId.value) {
        tickets.value = tickets.value.map((t) => (t.id === editingId.value ? { ...t, subject, requestorName: name, requestorEmail: email, type: formValues.type, category: formValues.category, subcategory: formValues.subcategory.trim(), description: desc, priority: formValues.priority, updatedAt: now } : t));
    }
    else {
        const max = tickets.value.reduce((m, t) => Math.max(m, Number(t.id.split('-').pop() ?? '0')), 0);
        const id = `TCK-2026-${String(max + 1).padStart(4, '0')}`;
        tickets.value = [{ id, subject, requestorName: name, requestorEmail: email, type: formValues.type, category: formValues.category, subcategory: formValues.subcategory.trim(), description: desc, status: 'open', priority: formValues.priority, createdAt: now, updatedAt: now, comments: [] }, ...tickets.value];
        selectedTicketId.value = id;
        detailOpen.value = true;
    }
    closeForm();
};
const closeForm = () => { formOpen.value = false; resetForm(); };
const resetForm = () => { formMode.value = 'create'; editingId.value = null; Object.assign(formValues, defaultForm); formError.value = ''; };
const setTicketStatus = (id, status) => { tickets.value = tickets.value.map((t) => (t.id === id ? { ...t, status, updatedAt: today() } : t)); };
const setTicketAssignee = (id, assignee) => { tickets.value = tickets.value.map((t) => (t.id === id ? { ...t, assignee: assignee || undefined, updatedAt: today() } : t)); };
const addComment = () => { if (!selectedTicket.value || !commentMessage.value.trim())
    return; const ticketId = selectedTicket.value.id; const msg = commentMessage.value.trim(); tickets.value = tickets.value.map((t) => (t.id === ticketId ? { ...t, comments: [...t.comments, { id: `${t.id}-C${t.comments.length + 1}`, author: 'Current User', message: msg, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '), visibility: commentVisibility.value }], updatedAt: today() } : t)); commentMessage.value = ''; commentVisibility.value = 'public'; };
const confirmDelete = () => { if (!deleteCandidate.value)
    return; tickets.value = tickets.value.filter((t) => t.id !== deleteCandidate.value?.id); if (selectedTicketId.value === deleteCandidate.value.id) {
    selectedTicketId.value = null;
    detailOpen.value = false;
} deleteOpen.value = false; deleteCandidate.value = null; };
const onExportCsv = () => { const rows = table.getFilteredRowModel().rows.map((row) => row.original); const csv = [['Ticket ID', 'Subject', 'Requestor', 'Type', 'Category', 'Status', 'Priority', 'Created'], ...rows.map((r) => [r.id, r.subject, `${r.requestorName} (${r.requestorEmail})`, r.type, `${r.category}/${r.subcategory}`, r.status, r.priority, r.createdAt])].map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `support-tickets-${today()}.csv`; a.click(); URL.revokeObjectURL(url); };
const onExportExcel = () => console.log('Export Excel (stub) clicked');
function today() { return new Date().toISOString().slice(0, 10); }
function loadDensity() { const value = localStorage.getItem(DENSITY_STORAGE_KEY); return value === 'compact' || value === 'comfortable' ? value : 'comfortable'; }
function loadViewState() { const raw = localStorage.getItem(VIEW_STORAGE_KEY); if (!raw)
    return; try {
    const p = JSON.parse(raw);
    showTicketId.value = p.showTicketId ?? true;
    showRequestor.value = p.showRequestor ?? true;
    showType.value = p.showType ?? true;
    showCategory.value = p.showCategory ?? true;
    showCreated.value = p.showCreated ?? true;
    showStatus.value = p.showStatus ?? true;
    showPriority.value = p.showPriority ?? true;
    showRowNumbers.value = p.showRowNumbers ?? true;
}
catch { } }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "container max-w-6xl py-6 space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "space-y-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" },
});
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "Support Center",
    description: "Create and track support tickets for RFID operations.",
}));
const __VLS_1 = __VLS_0({
    title: "Support Center",
    description: "Create and track support tickets for RFID operations.",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onClick: (__VLS_ctx.onExportCsv)
    };
    __VLS_5.slots.default;
    var __VLS_5;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_13;
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_12.slots.default;
    const __VLS_17 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_19 = __VLS_18({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_12;
}
var __VLS_2;
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 md:grid-cols-2 xl:grid-cols-4" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_28 = __VLS_27({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.kpi.open);
var __VLS_29;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_31 = __VLS_30({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
var __VLS_26;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_37 = __VLS_36({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.kpi.inProgress);
var __VLS_38;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_40 = __VLS_39({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
var __VLS_41;
var __VLS_35;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_43 = __VLS_42({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_46 = __VLS_45({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.kpi.resolved);
var __VLS_47;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_49 = __VLS_48({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
var __VLS_50;
var __VLS_44;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_52 = __VLS_51({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.kpi.avgResponse);
var __VLS_56;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
var __VLS_53;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Support Tickets",
    description: "Monitor incidents and support requests.",
    compact: true,
}));
const __VLS_61 = __VLS_60({
    title: "Support Tickets",
    description: "Monitor incidents and support requests.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search ticket, subject, requestor...",
    viewOptions: (__VLS_ctx.viewOptions),
}));
const __VLS_64 = __VLS_63({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search ticket, subject, requestor...",
    viewOptions: (__VLS_ctx.viewOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_66;
let __VLS_67;
let __VLS_68;
const __VLS_69 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_70 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_71 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_72 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_73 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_65;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No tickets found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_75 = __VLS_74({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No tickets found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_78 = __VLS_77({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_62;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Ticket Filters",
    description: "Filter tickets by status, priority, type, category and date.",
    resetLabel: "Reset",
}));
const __VLS_81 = __VLS_80({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Ticket Filters",
    description: "Filter tickets by status, priority, type, category and date.",
    resetLabel: "Reset",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
let __VLS_85;
const __VLS_86 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_87 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_82.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}));
const __VLS_89 = __VLS_88({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
let __VLS_91;
let __VLS_92;
let __VLS_93;
const __VLS_94 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFilterSelect('status', $event);
    }
};
__VLS_90.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "open",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "in-progress",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "resolved",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "closed",
});
var __VLS_90;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.priority),
}));
const __VLS_96 = __VLS_95({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.priority),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_98;
let __VLS_99;
let __VLS_100;
const __VLS_101 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFilterSelect('priority', $event);
    }
};
__VLS_97.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "low",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "medium",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "high",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "urgent",
});
var __VLS_97;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.type),
}));
const __VLS_103 = __VLS_102({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_105;
let __VLS_106;
let __VLS_107;
const __VLS_108 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFilterSelect('type', $event);
    }
};
__VLS_104.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "bug",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "request",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "question",
});
var __VLS_104;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}));
const __VLS_110 = __VLS_109({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_112;
let __VLS_113;
let __VLS_114;
const __VLS_115 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFilterSelect('category', $event);
    }
};
__VLS_111.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_111;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdFrom),
    type: "date",
}));
const __VLS_117 = __VLS_116({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdFrom),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_119;
let __VLS_120;
let __VLS_121;
const __VLS_122 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFilterInput('createdFrom', $event);
    }
};
var __VLS_118;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdTo),
    type: "date",
}));
const __VLS_124 = __VLS_123({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdTo),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
let __VLS_126;
let __VLS_127;
let __VLS_128;
const __VLS_129 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFilterInput('createdTo', $event);
    }
};
var __VLS_125;
var __VLS_82;
/** @type {[typeof Sheet, typeof Sheet, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(Sheet, new Sheet({
    modelValue: (__VLS_ctx.detailOpen),
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.detailOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
if (__VLS_ctx.selectedTicket) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-full flex-col gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2 border-b border-border/60 pb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-semibold" },
    });
    (__VLS_ctx.selectedTicket.id);
    (__VLS_ctx.selectedTicket.subject);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketStatusBadgeClass(__VLS_ctx.selectedTicket.status)) },
    }));
    const __VLS_134 = __VLS_133({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketStatusBadgeClass(__VLS_ctx.selectedTicket.status)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.ticketStatusLabelMap[__VLS_ctx.selectedTicket.status]);
    var __VLS_135;
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketPriorityBadgeClass(__VLS_ctx.selectedTicket.priority)) },
    }));
    const __VLS_137 = __VLS_136({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketPriorityBadgeClass(__VLS_ctx.selectedTicket.priority)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_138.slots.default;
    (__VLS_ctx.ticketPriorityLabelMap[__VLS_ctx.selectedTicket.priority]);
    var __VLS_138;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 space-y-4 overflow-y-auto pr-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "rounded-lg border border-border/60 p-4 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3 grid grid-cols-2 gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketTypeBadgeClass(__VLS_ctx.selectedTicket.type)) },
    }));
    const __VLS_140 = __VLS_139({
        variant: "outline",
        ...{ class: (__VLS_ctx.getTicketTypeBadgeClass(__VLS_ctx.selectedTicket.type)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    __VLS_141.slots.default;
    (__VLS_ctx.ticketTypeLabelMap[__VLS_ctx.selectedTicket.type]);
    var __VLS_141;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedTicket.category);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedTicket.requestorName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedTicket.assignee || 'Unassigned');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-3 text-sm" },
    });
    (__VLS_ctx.selectedTicket.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "rounded-lg border border-border/60 p-4 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3 space-y-3" },
    });
    if (__VLS_ctx.selectedTicket.comments.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-muted-foreground" },
        });
    }
    for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.selectedTicket.comments))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (comment.id),
            ...{ class: "rounded-md border border-border/60 p-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-muted-foreground" },
        });
        (comment.author);
        (comment.createdAt);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-1" },
        });
        (comment.message);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3 space-y-2" },
    });
    /** @type {[typeof Textarea, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(Textarea, new Textarea({
        modelValue: (__VLS_ctx.commentMessage),
        placeholder: "Add comment",
    }));
    const __VLS_143 = __VLS_142({
        modelValue: (__VLS_ctx.commentMessage),
        placeholder: "Add comment",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between gap-2" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.commentVisibility),
        ...{ class: "w-[180px]" },
    }));
    const __VLS_146 = __VLS_145({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.commentVisibility),
        ...{ class: "w-[180px]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_148;
    let __VLS_149;
    let __VLS_150;
    const __VLS_151 = {
        onChange: (__VLS_ctx.onCommentVisibilityChange)
    };
    __VLS_147.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "public",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "internal",
    });
    var __VLS_147;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_153 = __VLS_152({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    let __VLS_155;
    let __VLS_156;
    let __VLS_157;
    const __VLS_158 = {
        onClick: (__VLS_ctx.addComment)
    };
    __VLS_154.slots.default;
    var __VLS_154;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedTicket.status),
        ...{ class: "w-[160px]" },
    }));
    const __VLS_160 = __VLS_159({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedTicket.status),
        ...{ class: "w-[160px]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    let __VLS_162;
    let __VLS_163;
    let __VLS_164;
    const __VLS_165 = {
        onChange: (__VLS_ctx.onDetailStatusChange)
    };
    __VLS_161.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "open",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "in-progress",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "resolved",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "closed",
    });
    var __VLS_161;
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedTicket.assignee || 'unassigned'),
        ...{ class: "w-[190px]" },
    }));
    const __VLS_167 = __VLS_166({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedTicket.assignee || 'unassigned'),
        ...{ class: "w-[190px]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    let __VLS_169;
    let __VLS_170;
    let __VLS_171;
    const __VLS_172 = {
        onChange: (__VLS_ctx.onDetailAssigneeChange)
    };
    __VLS_168.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "unassigned",
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.assigneeOptions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (item),
            value: (item),
        });
        (item);
    }
    var __VLS_168;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_176;
    let __VLS_177;
    let __VLS_178;
    const __VLS_179 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedTicket))
                return;
            __VLS_ctx.openEdit(__VLS_ctx.selectedTicket);
        }
    };
    __VLS_175.slots.default;
    var __VLS_175;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "destructive",
    }));
    const __VLS_181 = __VLS_180({
        ...{ 'onClick': {} },
        variant: "destructive",
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    let __VLS_183;
    let __VLS_184;
    let __VLS_185;
    const __VLS_186 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedTicket))
                return;
            __VLS_ctx.openDelete(__VLS_ctx.selectedTicket);
        }
    };
    __VLS_182.slots.default;
    var __VLS_182;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-2 text-sm text-muted-foreground" },
    });
}
var __VLS_132;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.formOpen),
}));
const __VLS_188 = __VLS_187({
    modelValue: (__VLS_ctx.formOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
__VLS_189.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold" },
});
(__VLS_ctx.formMode === 'edit' ? 'Edit Ticket' : 'Create Ticket');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.subject),
}));
const __VLS_191 = __VLS_190({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.subject),
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
let __VLS_193;
let __VLS_194;
let __VLS_195;
const __VLS_196 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('subject', $event);
    }
};
var __VLS_192;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.requestorName),
}));
const __VLS_198 = __VLS_197({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.requestorName),
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_200;
let __VLS_201;
let __VLS_202;
const __VLS_203 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('requestorName', $event);
    }
};
var __VLS_199;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.requestorEmail),
    type: "email",
}));
const __VLS_205 = __VLS_204({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.requestorEmail),
    type: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
let __VLS_207;
let __VLS_208;
let __VLS_209;
const __VLS_210 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('requestorEmail', $event);
    }
};
var __VLS_206;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.type),
}));
const __VLS_212 = __VLS_211({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
let __VLS_214;
let __VLS_215;
let __VLS_216;
const __VLS_217 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormSelect('type', $event);
    }
};
__VLS_213.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "bug",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "request",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "question",
});
var __VLS_213;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.priority),
}));
const __VLS_219 = __VLS_218({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.priority),
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
let __VLS_221;
let __VLS_222;
let __VLS_223;
const __VLS_224 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormSelect('priority', $event);
    }
};
__VLS_220.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "low",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "medium",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "high",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "urgent",
});
var __VLS_220;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.category),
}));
const __VLS_226 = __VLS_225({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
let __VLS_228;
let __VLS_229;
let __VLS_230;
const __VLS_231 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormSelect('category', $event);
    }
};
__VLS_227.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_227;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.subcategory),
}));
const __VLS_233 = __VLS_232({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.subcategory),
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
let __VLS_235;
let __VLS_236;
let __VLS_237;
const __VLS_238 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('subcategory', $event);
    }
};
var __VLS_234;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Textarea, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(Textarea, new Textarea({
    modelValue: (__VLS_ctx.formValues.description),
}));
const __VLS_240 = __VLS_239({
    modelValue: (__VLS_ctx.formValues.description),
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
if (__VLS_ctx.formError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-destructive" },
    });
    (__VLS_ctx.formError);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_243 = __VLS_242({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
let __VLS_245;
let __VLS_246;
let __VLS_247;
const __VLS_248 = {
    onClick: (__VLS_ctx.closeForm)
};
__VLS_244.slots.default;
var __VLS_244;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_250 = __VLS_249({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
let __VLS_252;
let __VLS_253;
let __VLS_254;
const __VLS_255 = {
    onClick: (__VLS_ctx.saveTicket)
};
__VLS_251.slots.default;
(__VLS_ctx.formMode === 'edit' ? 'Save Changes' : 'Create Ticket');
var __VLS_251;
var __VLS_189;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.deleteOpen),
}));
const __VLS_257 = __VLS_256({
    modelValue: (__VLS_ctx.deleteOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
__VLS_258.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
(__VLS_ctx.deleteCandidate?.id || 'selected ticket');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_260 = __VLS_259({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
let __VLS_262;
let __VLS_263;
let __VLS_264;
const __VLS_265 = {
    onClick: (...[$event]) => {
        __VLS_ctx.deleteOpen = false;
    }
};
__VLS_261.slots.default;
var __VLS_261;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_267 = __VLS_266({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
let __VLS_269;
let __VLS_270;
let __VLS_271;
const __VLS_272 = {
    onClick: (__VLS_ctx.confirmDelete)
};
__VLS_268.slots.default;
var __VLS_268;
var __VLS_258;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.16em]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-[calc(env(safe-area-inset-bottom)+0.5rem)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[160px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[190px]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            ticketPriorityLabelMap: ticketPriorityLabelMap,
            ticketStatusLabelMap: ticketStatusLabelMap,
            ticketTypeLabelMap: ticketTypeLabelMap,
            DataTable: DataTable,
            DataTablePagination: DataTablePagination,
            DataTableToolbar: DataTableToolbar,
            FilterSheet: FilterSheet,
            ListCard: ListCard,
            PageHeader: PageHeader,
            Badge: Badge,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Dialog: Dialog,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Sheet: Sheet,
            Textarea: Textarea,
            getTicketPriorityBadgeClass: getTicketPriorityBadgeClass,
            getTicketStatusBadgeClass: getTicketStatusBadgeClass,
            getTicketTypeBadgeClass: getTicketTypeBadgeClass,
            density: density,
            filtersOpen: filtersOpen,
            detailOpen: detailOpen,
            formOpen: formOpen,
            deleteOpen: deleteOpen,
            deleteCandidate: deleteCandidate,
            formMode: formMode,
            formError: formError,
            commentMessage: commentMessage,
            commentVisibility: commentVisibility,
            draftFilters: draftFilters,
            formValues: formValues,
            categories: categories,
            assigneeOptions: assigneeOptions,
            selectedTicket: selectedTicket,
            appliedFiltersCount: appliedFiltersCount,
            kpi: kpi,
            viewOptions: viewOptions,
            openCreate: openCreate,
            openEdit: openEdit,
            openDelete: openDelete,
            table: table,
            onToggleViewOption: onToggleViewOption,
            onDensityChange: onDensityChange,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onFilterSelect: onFilterSelect,
            onFilterInput: onFilterInput,
            onFormInput: onFormInput,
            onFormSelect: onFormSelect,
            onCommentVisibilityChange: onCommentVisibilityChange,
            onDetailStatusChange: onDetailStatusChange,
            onDetailAssigneeChange: onDetailAssigneeChange,
            saveTicket: saveTicket,
            closeForm: closeForm,
            addComment: addComment,
            confirmDelete: confirmDelete,
            onExportCsv: onExportCsv,
            onExportExcel: onExportExcel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
