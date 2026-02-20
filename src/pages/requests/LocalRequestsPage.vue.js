import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { CircleCheckBig, ListChecks, LoaderCircle, Plus, SlidersHorizontal } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import FilterSheet from '@/components/list/FilterSheet.vue';
import ListCard from '@/components/list/ListCard.vue';
import PageHeader from '@/components/list/PageHeader.vue';
import { createLocalRequestColumns } from '@/components/requests/columns';
import Badge from '@/components/ui/Badge.vue';
import DataTable from '@/components/inventory/DataTable.vue';
import DataTablePagination from '@/components/inventory/DataTablePagination.vue';
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import Sheet from '@/components/ui/Sheet.vue';
import { getAdminPageConfig } from '@/config/pages';
import { getRequestStatusBadgeClass } from '@/lib/requestBadges';
import { valueUpdater } from '@/lib/utils';
import { localRequestsMock } from '@/mock/requests';
const DENSITY_STORAGE_KEY = 'table-density:local-requests';
const VIEW_STORAGE_KEY = 'table-view:local-requests';
const router = useRouter();
const pageConfig = getAdminPageConfig('requests') ?? {
    title: 'Requests',
    description: 'Track and process local RFID requests from operations teams.',
    primaryAction: { label: 'New Request', route: '/requests/local/new' },
};
const baseRows = localRequestsMock;
const density = ref(loadDensity());
const wrapText = ref(false);
const showRowNumbers = ref(true);
const filtersOpen = ref(false);
const detailOpen = ref(false);
const selectedRequest = ref(null);
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
});
const filters = reactive({
    requestNumber: '',
    warehouse: '',
    companyName: '',
    requestType: '',
    serviceLevel: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
});
const draftFilters = reactive({
    requestNumber: '',
    warehouse: '',
    companyName: '',
    requestType: '',
    serviceLevel: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
});
loadViewState();
columnVisibility.value.number = showRowNumbers.value;
columnVisibility.value.searchText = false;
const filterOptions = computed(() => ({
    warehouse: Array.from(new Set(baseRows.map((item) => item.warehouse))),
    companyName: Array.from(new Set(baseRows.map((item) => item.companyName))),
    requestType: Array.from(new Set(baseRows.map((item) => item.requestType))),
    serviceLevel: Array.from(new Set(baseRows.map((item) => item.serviceLevel))),
    status: Array.from(new Set(baseRows.map((item) => item.status))),
}));
const filteredRows = computed(() => {
    return baseRows
        .filter((row) => {
        if (filters.requestNumber && !row.requestNumber.toLowerCase().includes(filters.requestNumber.toLowerCase()))
            return false;
        if (filters.warehouse && row.warehouse !== filters.warehouse)
            return false;
        if (filters.companyName && row.companyName !== filters.companyName)
            return false;
        if (filters.requestType && row.requestType !== filters.requestType)
            return false;
        if (filters.serviceLevel && row.serviceLevel !== filters.serviceLevel)
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
        searchText: `${row.requestNumber} ${row.companyName} ${row.warehouse}`.toLowerCase(),
    }));
});
const appliedFiltersCount = computed(() => {
    let count = 0;
    if (filters.requestNumber)
        count += 1;
    if (filters.warehouse)
        count += 1;
    if (filters.companyName)
        count += 1;
    if (filters.requestType)
        count += 1;
    if (filters.serviceLevel)
        count += 1;
    if (filters.status)
        count += 1;
    if (filters.createdDateFrom || filters.createdDateTo)
        count += 1;
    return count;
});
const requestSummary = computed(() => ({
    total: filteredRows.value.length,
    inProgress: filteredRows.value.filter((row) => row.status === 'in-progress').length,
    approved: filteredRows.value.filter((row) => row.status === 'approved').length,
}));
const onView = (row) => {
    selectedRequest.value = row;
    detailOpen.value = true;
};
const onEdit = (row) => {
    router.push(`/requests/local/${row.id}/edit`);
};
const selectedTimeline = computed(() => (selectedRequest.value ? buildTimeline(selectedRequest.value) : []));
const getRequestTypeBadgeClass = (requestType) => {
    if (requestType === 'Tagging')
        return 'border bg-violet-50 text-violet-700 border-violet-200/70';
    if (requestType === 'Transfer')
        return 'border bg-blue-50 text-blue-700 border-blue-200/70';
    if (requestType === 'Retagging')
        return 'border bg-indigo-50 text-indigo-700 border-indigo-200/70';
    return 'border bg-amber-50 text-amber-700 border-amber-200/70';
};
const formatStatus = (status) => {
    return status
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};
const buildTimeline = (row) => {
    return [
        { label: 'Packing list generated', time: `${row.createdDate} 19:21`, actor: 'apk' },
        { label: 'Invoice uploaded', time: `${row.requestDate} 18:30`, actor: 'apk' },
        { label: `Request processed`, time: `${row.requestDate} 17:05`, actor: 'kamal' },
    ];
};
const getRequestNote = (row) => {
    if (row.serviceLevel === 'Express')
        return 'Urgent shipment - fast lane processing.';
    if (row.serviceLevel === 'Priority')
        return 'Priority shipment - handle with care.';
    return 'Standard shipment - follow regular flow.';
};
const getUnitMeta = (row) => {
    return {
        header: `1. PAN-PA-M-${String(row.id).padStart(3, '0')} (SN${String(9000 + row.id)})`,
        category: row.requestType === 'Transfer' ? 'Transfer' : 'Accessories',
        accessory: row.requestType === 'Reprint' ? 'Reprint Label' : 'Power Cord',
        rfidLabel: `RFID-${String(100 + row.id)}`,
    };
};
const getCustomerMeta = (row) => {
    const byWarehouse = {
        'Warehouse A': { zipCode: '08589', country: 'South Korea', city: 'Seoul', contactName: 'Chaeun Seong', contactPhone: '+82-1062815221' },
        'Warehouse B': { zipCode: '30115', country: 'Indonesia', city: 'Jakarta', contactName: 'Rizal Mahendra', contactPhone: '+62-81122334455' },
        'Warehouse C': { zipCode: '70221', country: 'Singapore', city: 'Singapore', contactName: 'Nadia Putri', contactPhone: '+65-99887766' },
        'Dock 1': { zipCode: '45301', country: 'Japan', city: 'Osaka', contactName: 'Ayu Pratama', contactPhone: '+81-9087654321' },
        'Dock 2': { zipCode: '40012', country: 'Taiwan', city: 'Taipei', contactName: 'Kevin Hsi', contactPhone: '+886-912345678' },
        'Staging Area': { zipCode: '50210', country: 'Malaysia', city: 'Kuala Lumpur', contactName: 'Farhan Setiawan', contactPhone: '+60-123456789' },
        'Packing Zone': { zipCode: '11510', country: 'Thailand', city: 'Bangkok', contactName: 'Dina Salsabila', contactPhone: '+66-81234567' },
    };
    const fallback = { zipCode: '00000', country: '-', city: '-', contactName: '-', contactPhone: '-' };
    const detail = byWarehouse[row.warehouse] ?? fallback;
    return {
        ...detail,
        contactEmail: `logistics@${row.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
        address: `1101-ho 11F Smartgate, 70 Gasan digital 2-ro, ${detail.city}`,
    };
};
const columns = computed(() => createLocalRequestColumns({ onView, onEdit }));
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
    if (isOpen) {
        Object.assign(draftFilters, filters);
    }
});
watch(() => density.value, (value) => {
    localStorage.setItem(DENSITY_STORAGE_KEY, value);
});
watch(() => [wrapText.value, showRowNumbers.value], () => {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ wrapText: wrapText.value, showRowNumbers: showRowNumbers.value }));
});
const goToNewRequest = () => {
    router.push(pageConfig.primaryAction.route);
};
const goToAdditionalDelivery = () => {
    router.push(pageConfig.primaryAction.route);
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
        requestNumber: '',
        warehouse: '',
        companyName: '',
        requestType: '',
        serviceLevel: '',
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
    const header = ['Request Number', 'Warehouse', 'Company Name', 'Request Type', 'Service Level', 'Status', 'Created Date'];
    const body = rows.map((row) => [
        row.requestNumber,
        row.warehouse,
        row.companyName,
        row.requestType,
        row.serviceLevel,
        row.status,
        row.createdDate,
    ]);
    const csv = [header, ...body]
        .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `local-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
const onExportExcel = () => {
    console.log('Export Excel (stub) clicked');
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
        showRowNumbers.value = parsed.showRowNumbers ?? true;
    }
    catch {
        wrapText.value = false;
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
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onClick: (__VLS_ctx.goToNewRequest)
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
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (__VLS_ctx.goToAdditionalDelivery)
    };
    __VLS_16.slots.default;
    const __VLS_21 = {}.SlidersHorizontal;
    /** @type {[typeof __VLS_components.SlidersHorizontal, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    var __VLS_16;
}
var __VLS_2;
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 md:grid-cols-3" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_29 = __VLS_28({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_32 = __VLS_31({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
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
(__VLS_ctx.requestSummary.total);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_34 = {}.ListChecks;
/** @type {[typeof __VLS_components.ListChecks, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_36 = __VLS_35({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
var __VLS_33;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_39 = __VLS_38({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
var __VLS_40;
var __VLS_30;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_42 = __VLS_41({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_45 = __VLS_44({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
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
(__VLS_ctx.requestSummary.inProgress);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_47 = {}.LoaderCircle;
/** @type {[typeof __VLS_components.LoaderCircle, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_49 = __VLS_48({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
var __VLS_46;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_52 = __VLS_51({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
var __VLS_53;
var __VLS_43;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "pb-2" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
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
(__VLS_ctx.requestSummary.approved);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_60 = {}.CircleCheckBig;
/** @type {[typeof __VLS_components.CircleCheckBig, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_62 = __VLS_61({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_59;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_65 = __VLS_64({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
var __VLS_66;
var __VLS_56;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Local Requests",
    description: "Monitor and manage submitted local requests across all warehouses.",
    compact: true,
}));
const __VLS_68 = __VLS_67({
    title: "Local Requests",
    description: "Monitor and manage submitted local requests across all warehouses.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search request number, company, warehouse...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}));
const __VLS_71 = __VLS_70({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search request number, company, warehouse...",
    viewOptions: ([
        { key: 'wrapText', label: 'Wrap text', checked: __VLS_ctx.wrapText },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_77 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_78 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_79 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_80 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_72;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    emptyTitle: "No requests found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_82 = __VLS_81({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (__VLS_ctx.wrapText),
    emptyTitle: "No requests found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_85 = __VLS_84({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
var __VLS_69;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Filters",
    description: "Apply advanced request filters.",
    resetLabel: "Reset",
}));
const __VLS_88 = __VLS_87({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Filters",
    description: "Apply advanced request filters.",
    resetLabel: "Reset",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_90;
let __VLS_91;
let __VLS_92;
const __VLS_93 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_94 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_89.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.requestNumber),
}));
const __VLS_96 = __VLS_95({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.requestNumber),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_98;
let __VLS_99;
let __VLS_100;
const __VLS_101 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('requestNumber', $event);
    }
};
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
    value: (__VLS_ctx.draftFilters.warehouse),
}));
const __VLS_103 = __VLS_102({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.warehouse),
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_105;
let __VLS_106;
let __VLS_107;
const __VLS_108 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('warehouse', $event);
    }
};
__VLS_104.slots.default;
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
    value: (__VLS_ctx.draftFilters.companyName),
}));
const __VLS_110 = __VLS_109({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.companyName),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_112;
let __VLS_113;
let __VLS_114;
const __VLS_115 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('companyName', $event);
    }
};
__VLS_111.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.companyName))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_111;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.requestType),
}));
const __VLS_117 = __VLS_116({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.requestType),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_119;
let __VLS_120;
let __VLS_121;
const __VLS_122 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('requestType', $event);
    }
};
__VLS_118.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.requestType))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_118;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.serviceLevel),
}));
const __VLS_124 = __VLS_123({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.serviceLevel),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
let __VLS_126;
let __VLS_127;
let __VLS_128;
const __VLS_129 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('serviceLevel', $event);
    }
};
__VLS_125.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filterOptions.serviceLevel))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_125;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}));
const __VLS_131 = __VLS_130({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
let __VLS_133;
let __VLS_134;
let __VLS_135;
const __VLS_136 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('status', $event);
    }
};
__VLS_132.slots.default;
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
var __VLS_132;
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
const __VLS_137 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateFrom),
    type: "date",
}));
const __VLS_138 = __VLS_137({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateFrom),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_140;
let __VLS_141;
let __VLS_142;
const __VLS_143 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('createdDateFrom', $event);
    }
};
var __VLS_139;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateTo),
    type: "date",
}));
const __VLS_145 = __VLS_144({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.createdDateTo),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
let __VLS_147;
let __VLS_148;
let __VLS_149;
const __VLS_150 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('createdDateTo', $event);
    }
};
var __VLS_146;
var __VLS_89;
/** @type {[typeof Sheet, typeof Sheet, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(Sheet, new Sheet({
    modelValue: (__VLS_ctx.detailOpen),
}));
const __VLS_152 = __VLS_151({
    modelValue: (__VLS_ctx.detailOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
if (__VLS_ctx.selectedRequest) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-full flex-col gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 space-y-5 overflow-y-auto pr-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "rounded-lg border border-border/60 p-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-start justify-between gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xl font-semibold leading-none" },
    });
    (__VLS_ctx.selectedRequest.requestNumber);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getRequestTypeBadgeClass(__VLS_ctx.selectedRequest.requestType)) },
    }));
    const __VLS_155 = __VLS_154({
        variant: "outline",
        ...{ class: (__VLS_ctx.getRequestTypeBadgeClass(__VLS_ctx.selectedRequest.requestType)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    __VLS_156.slots.default;
    (__VLS_ctx.selectedRequest.requestType);
    var __VLS_156;
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getRequestStatusBadgeClass(__VLS_ctx.selectedRequest.status)) },
    }));
    const __VLS_158 = __VLS_157({
        variant: "outline",
        ...{ class: (__VLS_ctx.getRequestStatusBadgeClass(__VLS_ctx.selectedRequest.status)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    (__VLS_ctx.formatStatus(__VLS_ctx.selectedRequest.status));
    var __VLS_159;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4 grid grid-cols-2 gap-4 text-sm [&>div]:min-w-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedRequest.warehouse);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedRequest.serviceLevel);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedRequest.requestType);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "break-words font-medium" },
    });
    (__VLS_ctx.getRequestNote(__VLS_ctx.selectedRequest));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold leading-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overflow-hidden rounded-lg border border-border/60" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getUnitMeta(__VLS_ctx.selectedRequest).header);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    (__VLS_ctx.getUnitMeta(__VLS_ctx.selectedRequest).category);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-4 gap-3 border-b border-border/60 px-4 py-2 text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-4 gap-3 px-4 py-3 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.getUnitMeta(__VLS_ctx.selectedRequest).accessory);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.getUnitMeta(__VLS_ctx.selectedRequest).rfidLabel);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: "border-violet-200/70 bg-violet-50 text-violet-700" },
    }));
    const __VLS_161 = __VLS_160({
        variant: "outline",
        ...{ class: "border-violet-200/70 bg-violet-50 text-violet-700" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    __VLS_162.slots.default;
    var __VLS_162;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold leading-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rounded-lg border border-border/60 p-4 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 gap-4 [&>div]:min-w-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedRequest.companyName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).zipCode);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).country);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).contactName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).city);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "break-all font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).contactEmail);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "break-words font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).address);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs uppercase tracking-wide text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getCustomerMeta(__VLS_ctx.selectedRequest).contactPhone);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold leading-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-3 rounded-lg border border-border/60 p-4" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.selectedTimeline))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.time + item.label),
            ...{ class: "flex gap-3 text-sm" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-col items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
            ...{ class: "mt-1 h-2 w-2 rounded-full bg-primary/80" },
        });
        if (index < __VLS_ctx.selectedTimeline.length - 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
                ...{ class: "h-8 w-px bg-border" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium" },
        });
        (item.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-muted-foreground" },
        });
        (item.time);
        (item.actor);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_166;
    let __VLS_167;
    let __VLS_168;
    const __VLS_169 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedRequest))
                return;
            __VLS_ctx.detailOpen = false;
        }
    };
    __VLS_165.slots.default;
    var __VLS_165;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedRequest))
                return;
            __VLS_ctx.onEdit(__VLS_ctx.selectedRequest);
        }
    };
    __VLS_172.slots.default;
    var __VLS_172;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-2 text-sm text-muted-foreground" },
    });
}
var __VLS_153;
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
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['[&>div]:min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border-violet-200/70']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-violet-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-violet-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['[&>div]:min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary/80']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
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
            ListChecks: ListChecks,
            LoaderCircle: LoaderCircle,
            Plus: Plus,
            SlidersHorizontal: SlidersHorizontal,
            FilterSheet: FilterSheet,
            ListCard: ListCard,
            PageHeader: PageHeader,
            Badge: Badge,
            DataTable: DataTable,
            DataTablePagination: DataTablePagination,
            DataTableToolbar: DataTableToolbar,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Sheet: Sheet,
            getRequestStatusBadgeClass: getRequestStatusBadgeClass,
            pageConfig: pageConfig,
            density: density,
            wrapText: wrapText,
            showRowNumbers: showRowNumbers,
            filtersOpen: filtersOpen,
            detailOpen: detailOpen,
            selectedRequest: selectedRequest,
            draftFilters: draftFilters,
            filterOptions: filterOptions,
            appliedFiltersCount: appliedFiltersCount,
            requestSummary: requestSummary,
            onEdit: onEdit,
            selectedTimeline: selectedTimeline,
            getRequestTypeBadgeClass: getRequestTypeBadgeClass,
            formatStatus: formatStatus,
            getRequestNote: getRequestNote,
            getUnitMeta: getUnitMeta,
            getCustomerMeta: getCustomerMeta,
            table: table,
            goToNewRequest: goToNewRequest,
            goToAdditionalDelivery: goToAdditionalDelivery,
            onDensityChange: onDensityChange,
            onToggleViewOption: onToggleViewOption,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
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
