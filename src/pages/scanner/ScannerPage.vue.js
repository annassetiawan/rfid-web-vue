import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { CircleCheckBig, Plus, ScanLine, Sparkles, TriangleAlert } from 'lucide-vue-next';
import { createScannerColumns } from '@/components/scanner/columns';
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
import { getAdminPageConfig } from '@/config/pages';
import { getScannerStateBadgeClass } from '@/lib/statusBadges';
import { valueUpdater } from '@/lib/utils';
import { scannersMock } from '@/mock/scanners';
const DENSITY_STORAGE_KEY = 'table-density:scanners';
const VIEW_STORAGE_KEY = 'table-view:scanners';
const pageConfig = getAdminPageConfig('scanner') ?? {
    title: 'Scanner',
    description: 'Access scanner status and quick scan utilities.',
    primaryAction: { label: 'Connect Scanner', route: '/scanner/new' },
};
const defaultFilters = {
    state: 'all',
    brand: 'all',
    location: 'all',
    modelName: '',
    serialNumber: '',
};
const defaultForm = {
    serialNumber: '',
    modelName: '',
    brand: '',
    location: '',
    state: 'new',
    description: '',
};
const scanners = ref([...scannersMock]);
const density = ref(loadDensity());
const wrapText = ref(true);
const showRowNumbers = ref(true);
const filtersOpen = ref(false);
const filters = reactive({ ...defaultFilters });
const draftFilters = reactive({ ...defaultFilters });
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });
const formOpen = ref(false);
const formMode = ref('create');
const formError = ref('');
const editingId = ref(null);
const formValues = reactive({ ...defaultForm });
const detailOpen = ref(false);
const selectedScannerId = ref(null);
const deleteOpen = ref(false);
const deleteCandidate = ref(null);
loadViewState();
columnVisibility.value.number = showRowNumbers.value;
columnVisibility.value.searchText = false;
const brandOptions = computed(() => Array.from(new Set(scanners.value.map((item) => item.brand))).sort((a, b) => a.localeCompare(b)));
const locationOptions = computed(() => Array.from(new Set(scanners.value.map((item) => item.location))).sort((a, b) => a.localeCompare(b)));
const filteredRows = computed(() => {
    return scanners.value
        .filter((scanner) => {
        if (filters.state !== 'all' && scanner.state !== filters.state)
            return false;
        if (filters.brand !== 'all' && scanner.brand !== filters.brand)
            return false;
        if (filters.location !== 'all' && scanner.location !== filters.location)
            return false;
        if (filters.modelName.trim() && !scanner.modelName.toLowerCase().includes(filters.modelName.toLowerCase().trim()))
            return false;
        if (filters.serialNumber.trim() && !scanner.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase().trim()))
            return false;
        return true;
    })
        .map((scanner) => ({
        ...scanner,
        searchText: `${scanner.serialNumber} ${scanner.modelName} ${scanner.brand} ${scanner.location} ${scanner.description}`.toLowerCase(),
    }));
});
const kpi = computed(() => ({
    total: scanners.value.length,
    working: scanners.value.filter((item) => item.state === 'working').length,
    newly: scanners.value.filter((item) => item.state === 'new').length,
    faulty: scanners.value.filter((item) => item.state === 'faulty').length,
}));
const appliedFiltersCount = computed(() => (filters.state !== 'all' ? 1 : 0)
    + (filters.brand !== 'all' ? 1 : 0)
    + (filters.location !== 'all' ? 1 : 0)
    + (filters.modelName.trim() ? 1 : 0)
    + (filters.serialNumber.trim() ? 1 : 0));
const selectedScanner = computed(() => scanners.value.find((item) => item.id === selectedScannerId.value) ?? null);
const onView = (row) => {
    selectedScannerId.value = row.id;
    detailOpen.value = true;
};
const openCreate = () => {
    resetForm();
    formMode.value = 'create';
    formOpen.value = true;
};
const openEdit = (row) => {
    formMode.value = 'edit';
    editingId.value = row.id;
    Object.assign(formValues, {
        serialNumber: row.serialNumber,
        modelName: row.modelName,
        brand: row.brand,
        location: row.location,
        state: row.state,
        description: row.description,
    });
    formError.value = '';
    formOpen.value = true;
};
const setScannerState = (row, nextState) => {
    scanners.value = scanners.value.map((item) => item.id === row.id
        ? { ...item, state: nextState, updatedAt: today() }
        : item);
};
const openDelete = (row) => {
    deleteCandidate.value = row;
    deleteOpen.value = true;
};
const onDelete = (row) => {
    const original = scanners.value.find((item) => item.id === row.id);
    if (!original)
        return;
    openDelete(original);
};
const onCopy = async (row) => {
    try {
        await navigator.clipboard.writeText(row.serialNumber);
    }
    catch {
        console.log('Copy serial failed');
    }
};
const columns = computed(() => createScannerColumns({
    onView,
    onEdit: openEdit,
    onSetState: setScannerState,
    onCopy,
    onDelete,
}));
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
watch(() => density.value, (value) => localStorage.setItem(DENSITY_STORAGE_KEY, value));
watch(() => [wrapText.value, showRowNumbers.value], () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ wrapText: wrapText.value, showRowNumbers: showRowNumbers.value })));
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
    Object.assign(draftFilters, defaultFilters);
    Object.assign(filters, defaultFilters);
    table.setPageIndex(0);
    filtersOpen.value = false;
};
const onSelectChange = (key, event) => {
    const target = event.target;
    if (key === 'state') {
        draftFilters.state = target.value;
        return;
    }
    draftFilters[key] = target.value;
};
const onInputChange = (key, event) => {
    const target = event.target;
    draftFilters[key] = target.value;
};
const onFormInput = (key, event) => {
    const target = event.target;
    if (key === 'state') {
        formValues.state = target.value;
        return;
    }
    formValues[key] = target.value;
};
const onFormText = (value) => {
    formValues.description = String(value);
};
const saveScanner = () => {
    const serialNumber = formValues.serialNumber.trim();
    const modelName = formValues.modelName.trim();
    const brand = formValues.brand.trim();
    if (!serialNumber || !modelName || !brand) {
        formError.value = 'Serial Number, Model Name, and Brand are required.';
        return;
    }
    const duplicate = scanners.value.some((scanner) => scanner.serialNumber.toLowerCase() === serialNumber.toLowerCase() && scanner.id !== editingId.value);
    if (duplicate) {
        formError.value = 'Serial Number must be unique.';
        return;
    }
    const now = today();
    if (formMode.value === 'edit' && editingId.value) {
        scanners.value = scanners.value.map((item) => item.id === editingId.value
            ? {
                ...item,
                serialNumber,
                modelName,
                brand,
                location: formValues.location.trim(),
                state: formValues.state,
                description: formValues.description.trim(),
                updatedAt: now,
            }
            : item);
    }
    else {
        const maxId = scanners.value.reduce((max, item) => {
            const parsed = Number(item.id.split('-').pop() ?? '0');
            return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
        }, 0);
        const scanner = {
            id: `SC-${String(maxId + 1).padStart(3, '0')}`,
            serialNumber,
            modelName,
            brand,
            location: formValues.location.trim(),
            state: formValues.state,
            description: formValues.description.trim(),
            createdAt: now,
            updatedAt: now,
        };
        scanners.value = [scanner, ...scanners.value];
    }
    closeForm();
};
const closeForm = () => {
    formOpen.value = false;
    resetForm();
};
const resetForm = () => {
    Object.assign(formValues, defaultForm);
    formMode.value = 'create';
    formError.value = '';
    editingId.value = null;
};
const confirmDelete = () => {
    if (!deleteCandidate.value)
        return;
    scanners.value = scanners.value.filter((item) => item.id !== deleteCandidate.value?.id);
    if (selectedScannerId.value === deleteCandidate.value.id) {
        selectedScannerId.value = null;
        detailOpen.value = false;
    }
    deleteOpen.value = false;
    deleteCandidate.value = null;
};
const onExportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    const header = ['Serial Number', 'Model Name', 'Brand', 'Location', 'Description', 'State', 'Created At', 'Updated At'];
    const body = rows.map((row) => [
        row.serialNumber,
        row.modelName,
        row.brand,
        row.location,
        row.description,
        row.state,
        row.createdAt,
        row.updatedAt,
    ]);
    const csv = [header, ...body]
        .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scanners-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
const onExportExcel = () => {
    console.log('Export Excel (stub) clicked');
};
function formatScannerState(state) {
    if (state === 'new')
        return 'New';
    if (state === 'working')
        return 'Working';
    if (state === 'faulty')
        return 'Faulty';
    return 'Test';
}
function today() {
    return new Date().toISOString().slice(0, 10);
}
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
        wrapText.value = parsed.wrapText ?? true;
        showRowNumbers.value = parsed.showRowNumbers ?? true;
    }
    catch {
        wrapText.value = true;
        showRowNumbers.value = true;
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
    ...{ class: "grid grid-cols-4 gap-4" },
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
(__VLS_ctx.kpi.total);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_30 = {}.ScanLine;
/** @type {[typeof __VLS_components.ScanLine, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_32 = __VLS_31({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
var __VLS_29;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_35 = __VLS_34({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
var __VLS_36;
var __VLS_26;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_38 = __VLS_37({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_41 = __VLS_40({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
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
(__VLS_ctx.kpi.working);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_43 = {}.CircleCheckBig;
/** @type {[typeof __VLS_components.CircleCheckBig, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_45 = __VLS_44({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_48 = __VLS_47({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
var __VLS_49;
var __VLS_39;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_54 = __VLS_53({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
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
(__VLS_ctx.kpi.newly);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_56 = {}.Sparkles;
/** @type {[typeof __VLS_components.Sparkles, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_55;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_61 = __VLS_60({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
var __VLS_62;
var __VLS_52;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_64 = __VLS_63({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_67 = __VLS_66({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
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
(__VLS_ctx.kpi.faulty);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_69 = {}.TriangleAlert;
/** @type {[typeof __VLS_components.TriangleAlert, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_71 = __VLS_70({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
var __VLS_68;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_74 = __VLS_73({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
var __VLS_75;
var __VLS_65;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Scanner List",
    description: "Manage RFID scanner devices and operational status.",
    compact: true,
}));
const __VLS_77 = __VLS_76({
    title: "Scanner List",
    description: "Manage RFID scanner devices and operational status.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search serial, model, brand, location...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}));
const __VLS_80 = __VLS_79({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search serial, model, brand, location...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_82;
let __VLS_83;
let __VLS_84;
const __VLS_85 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_86 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_87 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_88 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_89 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_81;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    emptyTitle: "No scanners found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_91 = __VLS_90({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    emptyTitle: "No scanners found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_94 = __VLS_93({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
var __VLS_78;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Scanner Filters",
    description: "Filter scanner devices by state, brand, location, and identity.",
    resetLabel: "Clear",
}));
const __VLS_97 = __VLS_96({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Scanner Filters",
    description: "Filter scanner devices by state, brand, location, and identity.",
    resetLabel: "Clear",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
let __VLS_99;
let __VLS_100;
let __VLS_101;
const __VLS_102 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_103 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_98.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.state),
}));
const __VLS_105 = __VLS_104({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.state),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_107;
let __VLS_108;
let __VLS_109;
const __VLS_110 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('state', $event);
    }
};
__VLS_106.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "new",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "working",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "faulty",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "test",
});
var __VLS_106;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.brand),
}));
const __VLS_112 = __VLS_111({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.brand),
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
let __VLS_114;
let __VLS_115;
let __VLS_116;
const __VLS_117 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('brand', $event);
    }
};
__VLS_113.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.brandOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_113;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.location),
}));
const __VLS_119 = __VLS_118({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.location),
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
let __VLS_121;
let __VLS_122;
let __VLS_123;
const __VLS_124 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('location', $event);
    }
};
__VLS_120.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.locationOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_120;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.modelName),
}));
const __VLS_126 = __VLS_125({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.modelName),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_128;
let __VLS_129;
let __VLS_130;
const __VLS_131 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('modelName', $event);
    }
};
var __VLS_127;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.serialNumber),
}));
const __VLS_133 = __VLS_132({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.serialNumber),
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_135;
let __VLS_136;
let __VLS_137;
const __VLS_138 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('serialNumber', $event);
    }
};
var __VLS_134;
var __VLS_98;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.formOpen),
}));
const __VLS_140 = __VLS_139({
    modelValue: (__VLS_ctx.formOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold" },
});
(__VLS_ctx.formMode === 'edit' ? 'Edit Scanner' : 'Add Scanner');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
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
const __VLS_142 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.serialNumber),
    placeholder: "Enter serial number",
}));
const __VLS_143 = __VLS_142({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.serialNumber),
    placeholder: "Enter serial number",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
let __VLS_145;
let __VLS_146;
let __VLS_147;
const __VLS_148 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('serialNumber', $event);
    }
};
var __VLS_144;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.modelName),
    placeholder: "Enter model name",
}));
const __VLS_150 = __VLS_149({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.modelName),
    placeholder: "Enter model name",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
let __VLS_152;
let __VLS_153;
let __VLS_154;
const __VLS_155 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('modelName', $event);
    }
};
var __VLS_151;
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
const __VLS_156 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.brand || ''),
}));
const __VLS_157 = __VLS_156({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.brand || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
let __VLS_159;
let __VLS_160;
let __VLS_161;
const __VLS_162 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormInput('brand', $event);
    }
};
__VLS_158.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.brandOptions))) {
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
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.location || ''),
}));
const __VLS_164 = __VLS_163({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.location || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
let __VLS_166;
let __VLS_167;
let __VLS_168;
const __VLS_169 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormInput('location', $event);
    }
};
__VLS_165.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.locationOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_165;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.state),
}));
const __VLS_171 = __VLS_170({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.state),
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
let __VLS_173;
let __VLS_174;
let __VLS_175;
const __VLS_176 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormInput('state', $event);
    }
};
__VLS_172.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "new",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "working",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "faulty",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "test",
});
var __VLS_172;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Textarea, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(Textarea, new Textarea({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.formValues.description),
    placeholder: "Enter notes or description",
}));
const __VLS_178 = __VLS_177({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.formValues.description),
    placeholder: "Enter notes or description",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
let __VLS_180;
let __VLS_181;
let __VLS_182;
const __VLS_183 = {
    'onUpdate:modelValue': (__VLS_ctx.onFormText)
};
var __VLS_179;
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
const __VLS_184 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_185 = __VLS_184({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
let __VLS_187;
let __VLS_188;
let __VLS_189;
const __VLS_190 = {
    onClick: (__VLS_ctx.closeForm)
};
__VLS_186.slots.default;
var __VLS_186;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_192 = __VLS_191({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
let __VLS_194;
let __VLS_195;
let __VLS_196;
const __VLS_197 = {
    onClick: (__VLS_ctx.saveScanner)
};
__VLS_193.slots.default;
(__VLS_ctx.formMode === 'edit' ? 'Save Changes' : 'Create Scanner');
var __VLS_193;
var __VLS_141;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.deleteOpen),
}));
const __VLS_199 = __VLS_198({
    modelValue: (__VLS_ctx.deleteOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
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
(__VLS_ctx.deleteCandidate?.serialNumber || 'selected scanner');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_202 = __VLS_201({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_204;
let __VLS_205;
let __VLS_206;
const __VLS_207 = {
    onClick: (...[$event]) => {
        __VLS_ctx.deleteOpen = false;
    }
};
__VLS_203.slots.default;
var __VLS_203;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_209 = __VLS_208({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
let __VLS_211;
let __VLS_212;
let __VLS_213;
const __VLS_214 = {
    onClick: (__VLS_ctx.confirmDelete)
};
__VLS_210.slots.default;
var __VLS_210;
var __VLS_200;
/** @type {[typeof Sheet, typeof Sheet, ]} */ ;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent(Sheet, new Sheet({
    modelValue: (__VLS_ctx.detailOpen),
}));
const __VLS_216 = __VLS_215({
    modelValue: (__VLS_ctx.detailOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
__VLS_217.slots.default;
if (__VLS_ctx.selectedScanner) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-full flex-col gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2 border-b border-border/60 pb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-semibold" },
    });
    (__VLS_ctx.selectedScanner.serialNumber);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    (__VLS_ctx.selectedScanner.modelName);
    (__VLS_ctx.selectedScanner.brand);
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getScannerStateBadgeClass(__VLS_ctx.selectedScanner.state)) },
    }));
    const __VLS_219 = __VLS_218({
        variant: "outline",
        ...{ class: (__VLS_ctx.getScannerStateBadgeClass(__VLS_ctx.selectedScanner.state)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    __VLS_220.slots.default;
    (__VLS_ctx.formatScannerState(__VLS_ctx.selectedScanner.state));
    var __VLS_220;
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
        ...{ class: "mt-3 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-mono" },
    });
    (__VLS_ctx.selectedScanner.serialNumber);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedScanner.modelName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedScanner.brand);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "rounded-lg border border-border/60 p-4 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedScanner.location || '-');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "whitespace-pre-wrap" },
    });
    (__VLS_ctx.selectedScanner.description || '-');
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedScanner.createdAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedScanner.updatedAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_222 = __VLS_221({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    let __VLS_224;
    let __VLS_225;
    let __VLS_226;
    const __VLS_227 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedScanner))
                return;
            __VLS_ctx.openEdit(__VLS_ctx.selectedScanner);
        }
    };
    __VLS_223.slots.default;
    var __VLS_223;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_228 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_229 = __VLS_228({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_228));
    let __VLS_231;
    let __VLS_232;
    let __VLS_233;
    const __VLS_234 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedScanner))
                return;
            __VLS_ctx.setScannerState(__VLS_ctx.selectedScanner, 'working');
        }
    };
    __VLS_230.slots.default;
    var __VLS_230;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "destructive",
    }));
    const __VLS_236 = __VLS_235({
        ...{ 'onClick': {} },
        variant: "destructive",
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    let __VLS_238;
    let __VLS_239;
    let __VLS_240;
    const __VLS_241 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedScanner))
                return;
            __VLS_ctx.openDelete(__VLS_ctx.selectedScanner);
        }
    };
    __VLS_237.slots.default;
    var __VLS_237;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-2 text-sm text-muted-foreground" },
    });
}
var __VLS_217;
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
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-[calc(env(safe-area-inset-bottom)+0.5rem)]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheckBig: CircleCheckBig,
            Plus: Plus,
            ScanLine: ScanLine,
            Sparkles: Sparkles,
            TriangleAlert: TriangleAlert,
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
            getScannerStateBadgeClass: getScannerStateBadgeClass,
            pageConfig: pageConfig,
            density: density,
            wrapText: wrapText,
            showRowNumbers: showRowNumbers,
            filtersOpen: filtersOpen,
            draftFilters: draftFilters,
            formOpen: formOpen,
            formMode: formMode,
            formError: formError,
            formValues: formValues,
            detailOpen: detailOpen,
            deleteOpen: deleteOpen,
            deleteCandidate: deleteCandidate,
            brandOptions: brandOptions,
            locationOptions: locationOptions,
            kpi: kpi,
            appliedFiltersCount: appliedFiltersCount,
            selectedScanner: selectedScanner,
            openCreate: openCreate,
            openEdit: openEdit,
            setScannerState: setScannerState,
            openDelete: openDelete,
            table: table,
            onDensityChange: onDensityChange,
            onToggleViewOption: onToggleViewOption,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
            onFormInput: onFormInput,
            onFormText: onFormText,
            saveScanner: saveScanner,
            closeForm: closeForm,
            confirmDelete: confirmDelete,
            onExportCsv: onExportCsv,
            onExportExcel: onExportExcel,
            formatScannerState: formatScannerState,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
