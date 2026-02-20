import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { CircleCheckBig, ListChecks, LoaderCircle, Plus, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { createCycleCountColumns } from '@/components/cycle-count/columns';
import DataTable from '@/components/inventory/DataTable.vue';
import DataTablePagination from '@/components/inventory/DataTablePagination.vue';
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue';
import FilterSheet from '@/components/list/FilterSheet.vue';
import ListCard from '@/components/list/ListCard.vue';
import PageHeader from '@/components/list/PageHeader.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import Textarea from '@/components/ui/Textarea.vue';
import { getAdminPageConfig } from '@/config/pages';
import { cycleCountMock } from '@/mock/cycleCount';
import { valueUpdater } from '@/lib/utils';
const DENSITY_STORAGE_KEY = 'table-density:cycle-count';
const VIEW_STORAGE_KEY = 'table-view:cycle-count';
const router = useRouter();
const pageConfig = getAdminPageConfig('cycle-count') ?? {
    title: 'Cycle Count',
    description: 'Track inventory audit sessions and scan progress.',
    primaryAction: { label: 'Request Cycle Count', route: '/cycle-count/new' },
};
const baseRows = ref(cycleCountMock);
const density = ref(loadDensity());
const wrapText = ref(false);
const showRowNumbers = ref(false);
const filtersOpen = ref(false);
const requestDialogOpen = ref(false);
const requestFormError = ref('');
const requestForm = reactive({
    warehouse: '',
    category: '',
    notes: '',
    operator: '',
    startDate: '',
});
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
});
const filters = reactive({
    countId: '',
    category: '',
    operator: '',
    warehouse: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
});
const draftFilters = reactive({
    countId: '',
    category: '',
    operator: '',
    warehouse: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
});
loadViewState();
columnVisibility.value.number = showRowNumbers.value;
columnVisibility.value.searchText = false;
const filterOptions = computed(() => ({
    category: Array.from(new Set(baseRows.value.map((item) => item.category))),
    operator: Array.from(new Set(baseRows.value.map((item) => item.operator))),
    warehouse: Array.from(new Set(baseRows.value.map((item) => item.warehouse))),
    status: Array.from(new Set(baseRows.value.map((item) => item.status))),
}));
const filteredRows = computed(() => {
    return baseRows.value
        .filter((row) => {
        if (filters.countId && !row.countId.toLowerCase().includes(filters.countId.toLowerCase()))
            return false;
        if (filters.category && row.category !== filters.category)
            return false;
        if (filters.operator && row.operator !== filters.operator)
            return false;
        if (filters.warehouse && row.warehouse !== filters.warehouse)
            return false;
        if (filters.status && row.status !== filters.status)
            return false;
        if (filters.createdDateFrom && row.createdDate < filters.createdDateFrom)
            return false;
        if (filters.createdDateTo && row.createdDate > filters.createdDateTo)
            return false;
        return true;
    })
        .map((row) => ({
        ...row,
        searchText: `${row.countId} ${row.operator} ${row.warehouse}`.toLowerCase(),
    }));
});
const summary = computed(() => ({
    total: filteredRows.value.length,
    inProgress: filteredRows.value.filter((row) => row.status === 'In Progress').length,
    completed: filteredRows.value.filter((row) => row.status === 'Processed').length,
}));
const appliedFiltersCount = computed(() => {
    let count = 0;
    if (filters.countId)
        count += 1;
    if (filters.category)
        count += 1;
    if (filters.operator)
        count += 1;
    if (filters.warehouse)
        count += 1;
    if (filters.status)
        count += 1;
    if (filters.createdDateFrom || filters.createdDateTo)
        count += 1;
    return count;
});
const onView = (row) => {
    router.push(`/cycle-count/${row.id}`);
};
const onStart = (row) => {
    baseRows.value = baseRows.value.map((item) => (item.id === row.id
        ? { ...item, status: 'In Progress' }
        : item));
};
const onClose = (row) => {
    baseRows.value = baseRows.value.map((item) => (item.id === row.id
        ? { ...item, status: 'Cancelled' }
        : item));
};
const columns = computed(() => createCycleCountColumns({ onView, onStart, onClose }));
const table = useVueTable({
    get data() {
        return filteredRows.value;
    },
    get columns() {
        return columns.value;
    },
    state: {
        get rowSelection() {
            return rowSelection.value;
        },
        get columnVisibility() {
            return columnVisibility.value;
        },
        get columnFilters() {
            return columnFilters.value;
        },
        get sorting() {
            return sorting.value;
        },
        get pagination() {
            return pagination.value;
        },
    },
    onRowSelectionChange: (updater) => valueUpdater(updater, rowSelection),
    onColumnVisibilityChange: (updater) => valueUpdater(updater, columnVisibility),
    onColumnFiltersChange: (updater) => valueUpdater(updater, columnFilters),
    onSortingChange: (updater) => valueUpdater(updater, sorting),
    onPaginationChange: (updater) => valueUpdater(updater, pagination),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});
watch(() => filtersOpen.value, (isOpen) => {
    if (isOpen)
        Object.assign(draftFilters, filters);
});
watch(() => density.value, (value) => {
    localStorage.setItem(DENSITY_STORAGE_KEY, value);
});
watch(() => [wrapText.value, showRowNumbers.value], () => {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ wrapText: wrapText.value, showRowNumbers: showRowNumbers.value }));
});
const openRequestDialog = () => {
    requestFormError.value = '';
    requestForm.warehouse = '';
    requestForm.category = '';
    requestForm.notes = '';
    requestForm.operator = '';
    requestForm.startDate = '';
    requestDialogOpen.value = true;
};
const onDensityChange = (value) => {
    density.value = value;
};
const onToggleViewOption = (payload) => {
    if (payload.key === 'wrapText') {
        wrapText.value = payload.value;
        return;
    }
    if (payload.key === 'showRowNumbers') {
        showRowNumbers.value = payload.value;
        table.getColumn('number')?.toggleVisibility(payload.value);
    }
};
const applyFilters = () => {
    Object.assign(filters, draftFilters);
    table.setPageIndex(0);
    filtersOpen.value = false;
};
const resetFilters = () => {
    Object.assign(draftFilters, {
        countId: '',
        category: '',
        operator: '',
        warehouse: '',
        status: '',
        createdDateFrom: '',
        createdDateTo: '',
    });
    Object.assign(filters, draftFilters);
    table.setPageIndex(0);
    filtersOpen.value = false;
};
const onSelectChange = (key, event) => {
    const target = event.target;
    draftFilters[key] = target.value;
};
const onInputChange = (key, event) => {
    const target = event.target;
    draftFilters[key] = target.value;
};
const onExportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    const header = ['ID', 'Category', 'Created Date', 'Operator', 'Warehouse', 'Status'];
    const body = rows.map((row) => [
        row.countId,
        row.category,
        row.createdDate,
        row.operator,
        row.warehouse,
        row.status,
    ]);
    const csv = [header, ...body]
        .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cycle-count-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
const onExportExcel = () => {
    console.log('Export Excel (stub) clicked');
};
const onCreateCycleCountRequest = () => {
    if (!requestForm.warehouse || !requestForm.category) {
        requestFormError.value = 'Warehouse and category are required.';
        return;
    }
    const maxNumericId = baseRows.value.reduce((max, row) => {
        const number = Number(row.countId.split('-').pop() ?? '0');
        return number > max ? number : max;
    }, 0);
    const nextNumericId = maxNumericId + 1;
    const nextRow = {
        id: baseRows.value.length + 1,
        countId: `CC-2026-${String(nextNumericId).padStart(3, '0')}`,
        category: requestForm.category,
        createdDate: requestForm.startDate || new Date().toISOString().slice(0, 10),
        operator: requestForm.operator || 'Unassigned',
        warehouse: requestForm.warehouse,
        status: 'New',
    };
    baseRows.value = [nextRow, ...baseRows.value];
    requestDialogOpen.value = false;
    requestFormError.value = '';
};
function loadDensity() {
    const value = localStorage.getItem(DENSITY_STORAGE_KEY);
    if (value === 'compact' || value === 'comfortable')
        return value;
    return 'comfortable';
}
function loadViewState() {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    if (!raw)
        return;
    try {
        const parsed = JSON.parse(raw);
        wrapText.value = parsed.wrapText ?? false;
        showRowNumbers.value = parsed.showRowNumbers ?? false;
    }
    catch {
        wrapText.value = false;
        showRowNumbers.value = false;
    }
}
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
    title: (__VLS_ctx.pageConfig.title),
    description: (__VLS_ctx.pageConfig.description),
}));
const __VLS_1 = __VLS_0({
    title: (__VLS_ctx.pageConfig.title),
    description: (__VLS_ctx.pageConfig.description),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onClick: (__VLS_ctx.openRequestDialog)
    };
    __VLS_5.slots.default;
    const __VLS_10 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    var __VLS_5;
}
var __VLS_2;
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 md:grid-cols-3" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_21 = __VLS_20({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-start justify-between gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.summary.total);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_23 = {}.ListChecks;
/** @type {[typeof __VLS_components.ListChecks, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_22;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_28 = __VLS_27({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
var __VLS_29;
var __VLS_19;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_31 = __VLS_30({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-start justify-between gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.summary.inProgress);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_36 = {}.LoaderCircle;
/** @type {[typeof __VLS_components.LoaderCircle, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_38 = __VLS_37({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_35;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_41 = __VLS_40({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
var __VLS_42;
var __VLS_32;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_44 = __VLS_43({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_47 = __VLS_46({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-start justify-between gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-4xl font-semibold leading-none" },
});
(__VLS_ctx.summary.completed);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_49 = {}.CircleCheckBig;
/** @type {[typeof __VLS_components.CircleCheckBig, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_48;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_54 = __VLS_53({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
var __VLS_45;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    compact: true,
}));
const __VLS_57 = __VLS_56({
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search cycle count ID, operator, warehouse...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}));
const __VLS_60 = __VLS_59({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search cycle count ID, operator, warehouse...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_62;
let __VLS_63;
let __VLS_64;
const __VLS_65 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_66 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_67 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_68 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_69 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_61;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    tableClass: "min-w-[980px]",
    emptyTitle: "No cycle count sessions found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_71 = __VLS_70({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    tableClass: "min-w-[980px]",
    emptyTitle: "No cycle count sessions found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_74 = __VLS_73({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
var __VLS_58;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Filters",
    description: "Apply cycle count filters.",
    resetLabel: "Reset",
}));
const __VLS_77 = __VLS_76({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Filters",
    description: "Apply cycle count filters.",
    resetLabel: "Reset",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_79;
let __VLS_80;
let __VLS_81;
const __VLS_82 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_83 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_78.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.countId),
}));
const __VLS_85 = __VLS_84({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.countId),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_87;
let __VLS_88;
let __VLS_89;
const __VLS_90 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('countId', $event);
    }
};
var __VLS_86;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}));
const __VLS_92 = __VLS_91({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_94;
let __VLS_95;
let __VLS_96;
const __VLS_97 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('category', $event);
    }
};
__VLS_93.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.category))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_93;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.operator),
}));
const __VLS_99 = __VLS_98({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.operator),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_101;
let __VLS_102;
let __VLS_103;
const __VLS_104 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('operator', $event);
    }
};
__VLS_100.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.operator))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_100;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.warehouse),
}));
const __VLS_106 = __VLS_105({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.warehouse),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('warehouse', $event);
    }
};
__VLS_107.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.warehouse))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_107;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}));
const __VLS_113 = __VLS_112({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_115;
let __VLS_116;
let __VLS_117;
const __VLS_118 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('status', $event);
    }
};
__VLS_114.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.status))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_114;
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
const __VLS_119 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateFrom),
    type: "date",
}));
const __VLS_120 = __VLS_119({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateFrom),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_122;
let __VLS_123;
let __VLS_124;
const __VLS_125 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('createdDateFrom', $event);
    }
};
var __VLS_121;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateTo),
    type: "date",
}));
const __VLS_127 = __VLS_126({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateTo),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_129;
let __VLS_130;
let __VLS_131;
const __VLS_132 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('createdDateTo', $event);
    }
};
var __VLS_128;
var __VLS_78;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.requestDialogOpen),
}));
const __VLS_134 = __VLS_133({
    modelValue: (__VLS_ctx.requestDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-start justify-between gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-2xl font-semibold tracking-tight" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1 text-sm text-muted-foreground" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
}));
const __VLS_137 = __VLS_136({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
let __VLS_139;
let __VLS_140;
let __VLS_141;
const __VLS_142 = {
    onClick: (...[$event]) => {
        __VLS_ctx.requestDialogOpen = false;
    }
};
__VLS_138.slots.default;
const __VLS_143 = {}.X;
/** @type {[typeof __VLS_components.X, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    ...{ class: "h-4 w-4" },
}));
const __VLS_145 = __VLS_144({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
var __VLS_138;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.requestForm.warehouse),
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.requestForm.warehouse),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.warehouse))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_149;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.requestForm.category),
}));
const __VLS_151 = __VLS_150({
    modelValue: (__VLS_ctx.requestForm.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "Product",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "Accessory",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "All",
});
var __VLS_152;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Textarea, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(Textarea, new Textarea({
    modelValue: (__VLS_ctx.requestForm.notes),
    rows: "3",
    placeholder: "Add notes for this request",
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.requestForm.notes),
    rows: "3",
    placeholder: "Add notes for this request",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.requestForm.operator),
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.requestForm.operator),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.operator))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_158;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(Input, new Input({
    modelValue: (__VLS_ctx.requestForm.startDate),
    type: "date",
}));
const __VLS_160 = __VLS_159({
    modelValue: (__VLS_ctx.requestForm.startDate),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
if (__VLS_ctx.requestFormError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-destructive" },
    });
    (__VLS_ctx.requestFormError);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2 pt-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_163 = __VLS_162({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
let __VLS_165;
let __VLS_166;
let __VLS_167;
const __VLS_168 = {
    onClick: (...[$event]) => {
        __VLS_ctx.requestDialogOpen = false;
    }
};
__VLS_164.slots.default;
var __VLS_164;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_170 = __VLS_169({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
let __VLS_172;
let __VLS_173;
let __VLS_174;
const __VLS_175 = {
    onClick: (__VLS_ctx.onCreateCycleCountRequest)
};
__VLS_171.slots.default;
var __VLS_171;
var __VLS_135;
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
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheckBig: CircleCheckBig,
            ListChecks: ListChecks,
            LoaderCircle: LoaderCircle,
            Plus: Plus,
            X: X,
            DataTable: DataTable,
            DataTablePagination: DataTablePagination,
            DataTableToolbar: DataTableToolbar,
            FilterSheet: FilterSheet,
            ListCard: ListCard,
            PageHeader: PageHeader,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Dialog: Dialog,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Textarea: Textarea,
            pageConfig: pageConfig,
            density: density,
            wrapText: wrapText,
            showRowNumbers: showRowNumbers,
            filtersOpen: filtersOpen,
            requestDialogOpen: requestDialogOpen,
            requestFormError: requestFormError,
            requestForm: requestForm,
            draftFilters: draftFilters,
            filterOptions: filterOptions,
            summary: summary,
            appliedFiltersCount: appliedFiltersCount,
            table: table,
            openRequestDialog: openRequestDialog,
            onDensityChange: onDensityChange,
            onToggleViewOption: onToggleViewOption,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
            onExportCsv: onExportCsv,
            onExportExcel: onExportExcel,
            onCreateCycleCountRequest: onCreateCycleCountRequest,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
