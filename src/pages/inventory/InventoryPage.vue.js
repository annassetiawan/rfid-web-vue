import { computed, ref } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import DataTable from '@/components/inventory/DataTable.vue';
import DataTablePagination from '@/components/inventory/DataTablePagination.vue';
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue';
import InventoryFiltersSheet from '@/components/inventory/InventoryFiltersSheet.vue';
import ListCard from '@/components/list/ListCard.vue';
import PageHeader from '@/components/list/PageHeader.vue';
import { createInventoryColumns } from '@/components/inventory/columns';
import { valueUpdater } from '@/lib/utils';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Separator from '@/components/ui/Separator.vue';
import Tabs from '@/components/ui/Tabs.vue';
import TabsContent from '@/components/ui/TabsContent.vue';
import TabsList from '@/components/ui/TabsList.vue';
import TabsTrigger from '@/components/ui/TabsTrigger.vue';
const rows = ref([
    { id: 1, category: 'products', name: 'Pallet Sensor A', serialNumber: 'SN-9001', rfidCode: 'RFID-A1X2', inventoryStatus: 'In Stock', location: 'Warehouse A', taggedDate: '2026-01-04', status: 'active', condition: 'Good', stagingStatus: 'Received', warehouseLocation: 'A-R01' },
    { id: 2, category: 'products', name: 'Crate Tag B', serialNumber: 'SN-9002', rfidCode: 'RFID-B2Y3', inventoryStatus: 'In Transit', location: 'Dock 2', taggedDate: '2026-01-09', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-02' },
    { id: 3, category: 'products', name: 'Bin Marker C', serialNumber: 'SN-9003', rfidCode: 'RFID-C3Z4', inventoryStatus: 'Reserved', location: 'Warehouse B', taggedDate: '2026-01-12', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R04' },
    { id: 4, category: 'products', name: 'Asset Cart D', serialNumber: 'SN-9004', rfidCode: 'RFID-D4Q5', inventoryStatus: 'Assigned', location: 'Packing', taggedDate: '2026-01-16', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'P-11' },
    { id: 5, category: 'products', name: 'Tool Kit E', serialNumber: 'SN-9005', rfidCode: 'RFID-E5W6', inventoryStatus: 'In Stock', location: 'Warehouse C', taggedDate: '2026-01-18', status: 'active', condition: 'Refurbished', stagingStatus: 'Received', warehouseLocation: 'C-R09' },
    { id: 6, category: 'products', name: 'Module Unit F', serialNumber: 'SN-9006', rfidCode: 'RFID-F6R7', inventoryStatus: 'In Transit', location: 'Staging Area', taggedDate: '2026-01-21', status: 'inactive', condition: 'Good', stagingStatus: 'Inbound', warehouseLocation: 'S-03' },
    { id: 7, category: 'accessories', name: 'Tag Bundle G', serialNumber: 'SN-9007', rfidCode: 'RFID-G7T8', inventoryStatus: 'Reserved', location: 'Warehouse A', taggedDate: '2026-01-26', status: 'active', condition: 'Good', stagingStatus: 'Reserved', warehouseLocation: 'A-R08' },
    { id: 8, category: 'accessories', name: 'Spare Label H', serialNumber: 'SN-9008', rfidCode: 'RFID-H8U9', inventoryStatus: 'Assigned', location: 'QC Room', taggedDate: '2026-01-30', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'Q-01' },
    { id: 9, category: 'accessories', name: 'Return Bin I', serialNumber: 'SN-9009', rfidCode: 'RFID-I9V0', inventoryStatus: 'In Stock', location: 'Warehouse B', taggedDate: '2026-02-01', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R02' },
    { id: 10, category: 'accessories', name: 'Transit Box J', serialNumber: 'SN-9010', rfidCode: 'RFID-J0W1', inventoryStatus: 'In Transit', location: 'Dock 1', taggedDate: '2026-02-05', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-01' },
    { id: 11, category: 'accessories', name: 'Rack Sensor K', serialNumber: 'SN-9011', rfidCode: 'RFID-K1X2', inventoryStatus: 'Reserved', location: 'Warehouse C', taggedDate: '2026-02-08', status: 'active', condition: 'Refurbished', stagingStatus: 'Reserved', warehouseLocation: 'C-R11' },
    { id: 12, category: 'accessories', name: 'Batch Item L', serialNumber: 'SN-9012', rfidCode: 'RFID-L2Y3', inventoryStatus: 'Assigned', location: 'Dispatch', taggedDate: '2026-02-10', status: 'inactive', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'DS-07' },
]);
const activeTab = ref('products');
const filtersOpen = ref(false);
const density = ref('compact');
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
});
const filters = ref({
    inventoryStatus: '',
    location: '',
    condition: '',
    stagingStatus: '',
    warehouseLocation: '',
    dateFrom: '',
    dateTo: '',
});
const rowsByTab = computed(() => rows.value.filter((row) => row.category === activeTab.value));
const filteredRows = computed(() => {
    return rowsByTab.value.filter((row) => {
        if (filters.value.inventoryStatus && row.inventoryStatus !== filters.value.inventoryStatus)
            return false;
        if (filters.value.location && row.location !== filters.value.location)
            return false;
        if (filters.value.condition && row.condition !== filters.value.condition)
            return false;
        if (filters.value.stagingStatus && row.stagingStatus !== filters.value.stagingStatus)
            return false;
        if (filters.value.warehouseLocation && row.warehouseLocation !== filters.value.warehouseLocation)
            return false;
        if (filters.value.dateFrom && row.taggedDate < filters.value.dateFrom)
            return false;
        if (filters.value.dateTo && row.taggedDate > filters.value.dateTo)
            return false;
        return true;
    });
});
const filterOptions = computed(() => ({
    inventoryStatus: ['In Stock', 'In Transit', 'Reserved', 'Assigned'],
    location: Array.from(new Set(rowsByTab.value.map((row) => row.location))),
    condition: Array.from(new Set(rowsByTab.value.map((row) => row.condition))),
    stagingStatus: Array.from(new Set(rowsByTab.value.map((row) => row.stagingStatus))),
    warehouseLocation: Array.from(new Set(rowsByTab.value.map((row) => row.warehouseLocation))),
}));
const appliedFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.inventoryStatus)
        count += 1;
    if (filters.value.location)
        count += 1;
    if (filters.value.condition)
        count += 1;
    if (filters.value.stagingStatus)
        count += 1;
    if (filters.value.warehouseLocation)
        count += 1;
    if (filters.value.dateFrom || filters.value.dateTo)
        count += 1;
    return count;
});
const onEdit = (row) => {
    const nextName = window.prompt('Edit item name', row.name);
    if (!nextName)
        return;
    const value = nextName.trim();
    if (!value)
        return;
    rows.value = rows.value.map((item) => (item.id === row.id ? { ...item, name: value } : item));
};
const onDeactivate = (row) => {
    rows.value = rows.value.map((item) => item.id === row.id
        ? {
            ...item,
            status: 'inactive',
        }
        : item);
};
const columns = computed(() => createInventoryColumns({
    onEdit,
    onDeactivate,
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
    enableRowSelection: true,
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
const normalized = (value) => value.trim().toLowerCase().replace(/\s+/g, '_');
const visibleItems = computed(() => table.getFilteredRowModel().rows.map((row) => row.original));
const kpis = computed(() => {
    const totalItems = visibleItems.value.length;
    const availableCount = visibleItems.value.filter((item) => normalized(item.inventoryStatus) === 'in_stock').length;
    const inTransitCount = visibleItems.value.filter((item) => normalized(item.inventoryStatus) === 'in_transit').length;
    const issuesCount = visibleItems.value.filter((item) => {
        const isDamaged = normalized(item.condition) === 'damaged';
        const isHold = normalized(item.stagingStatus) === 'hold';
        return isDamaged || isHold;
    }).length;
    return {
        totalItems,
        availableCount,
        inTransitCount,
        issuesCount,
    };
});
const applyFilters = (nextFilters) => {
    filters.value = { ...nextFilters };
    table.setPageIndex(0);
};
const clearFilters = () => {
    filters.value = {
        inventoryStatus: '',
        location: '',
        condition: '',
        stagingStatus: '',
        warehouseLocation: '',
        dateFrom: '',
        dateTo: '',
    };
    table.setPageIndex(0);
};
const onExportCsv = () => console.log('Export CSV clicked');
const onExportExcel = () => console.log('Export Excel clicked');
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
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "Inventory List",
    description: "Track products and accessories across warehouse locations.",
}));
const __VLS_1 = __VLS_0({
    title: "Inventory List",
    description: "Track products and accessories across warehouse locations.",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof Tabs, typeof Tabs, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(Tabs, new Tabs({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "space-y-4" },
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "space-y-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof TabsList, typeof TabsList, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(TabsList, new TabsList({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "products",
}));
const __VLS_13 = __VLS_12({
    value: "products",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
var __VLS_14;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "accessories",
}));
const __VLS_16 = __VLS_15({
    value: "accessories",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
var __VLS_17;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "space-y-1 pb-2" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "space-y-1 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-3xl font-semibold leading-none" },
});
(__VLS_ctx.kpis.totalItems);
var __VLS_23;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
var __VLS_26;
var __VLS_20;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_28 = __VLS_27({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "space-y-1 pb-2" },
}));
const __VLS_31 = __VLS_30({
    ...{ class: "space-y-1 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-3xl font-semibold leading-none" },
});
(__VLS_ctx.kpis.availableCount);
var __VLS_32;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
var __VLS_29;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_37 = __VLS_36({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "space-y-1 pb-2" },
}));
const __VLS_40 = __VLS_39({
    ...{ class: "space-y-1 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-3xl font-semibold leading-none" },
});
(__VLS_ctx.kpis.inTransitCount);
var __VLS_41;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_43 = __VLS_42({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
var __VLS_44;
var __VLS_38;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: (['rounded-lg', __VLS_ctx.kpis.issuesCount > 0 ? 'border-destructive/30 bg-destructive/5' : '']) },
}));
const __VLS_46 = __VLS_45({
    ...{ class: (['rounded-lg', __VLS_ctx.kpis.issuesCount > 0 ? 'border-destructive/30 bg-destructive/5' : '']) },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "space-y-1 pb-2" },
}));
const __VLS_49 = __VLS_48({
    ...{ class: "space-y-1 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
if (__VLS_ctx.kpis.issuesCount > 0) {
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: "border-destructive/40 text-destructive" },
    }));
    const __VLS_52 = __VLS_51({
        variant: "outline",
        ...{ class: "border-destructive/40 text-destructive" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    __VLS_53.slots.default;
    var __VLS_53;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-3xl font-semibold leading-none" },
});
(__VLS_ctx.kpis.issuesCount);
var __VLS_50;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "pt-0 text-sm text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
var __VLS_56;
var __VLS_47;
/** @type {[typeof TabsContent, typeof TabsContent, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(TabsContent, new TabsContent({
    value: "products",
}));
const __VLS_58 = __VLS_57({
    value: "products",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Products",
    description: "Monitor RFID-tagged products across warehouse locations, status, and lifecycle stages.",
    compact: true,
}));
const __VLS_61 = __VLS_60({
    title: "Products",
    description: "Monitor RFID-tagged products across warehouse locations, status, and lifecycle stages.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
}));
const __VLS_64 = __VLS_63({
    ...{ 'onOpenFilters': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
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
    'onUpdate:density': (...[$event]) => {
        __VLS_ctx.density = $event;
    }
};
const __VLS_71 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_72 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_65;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
}));
const __VLS_74 = __VLS_73({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_77 = __VLS_76({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
var __VLS_62;
var __VLS_59;
/** @type {[typeof TabsContent, typeof TabsContent, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(TabsContent, new TabsContent({
    value: "accessories",
}));
const __VLS_80 = __VLS_79({
    value: "accessories",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Accessories",
    description: "Track accessory items, availability, and movement details with the same operational controls.",
    compact: true,
}));
const __VLS_83 = __VLS_82({
    title: "Accessories",
    description: "Track accessory items, availability, and movement details with the same operational controls.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
}));
const __VLS_86 = __VLS_85({
    ...{ 'onOpenFilters': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_92 = {
    'onUpdate:density': (...[$event]) => {
        __VLS_ctx.density = $event;
    }
};
const __VLS_93 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_94 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_87;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
}));
const __VLS_96 = __VLS_95({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_99 = __VLS_98({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
var __VLS_84;
var __VLS_81;
var __VLS_8;
/** @type {[typeof InventoryFiltersSheet, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(InventoryFiltersSheet, new InventoryFiltersSheet({
    ...{ 'onApply': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    filters: (__VLS_ctx.filters),
    options: (__VLS_ctx.filterOptions),
}));
const __VLS_102 = __VLS_101({
    ...{ 'onApply': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    filters: (__VLS_ctx.filters),
    options: (__VLS_ctx.filterOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_108 = {
    onClear: (__VLS_ctx.clearFilters)
};
var __VLS_103;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['border-destructive/40']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DataTable: DataTable,
            DataTablePagination: DataTablePagination,
            DataTableToolbar: DataTableToolbar,
            InventoryFiltersSheet: InventoryFiltersSheet,
            ListCard: ListCard,
            PageHeader: PageHeader,
            Badge: Badge,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Separator: Separator,
            Tabs: Tabs,
            TabsContent: TabsContent,
            TabsList: TabsList,
            TabsTrigger: TabsTrigger,
            activeTab: activeTab,
            filtersOpen: filtersOpen,
            density: density,
            filters: filters,
            filterOptions: filterOptions,
            appliedFiltersCount: appliedFiltersCount,
            table: table,
            kpis: kpis,
            applyFilters: applyFilters,
            clearFilters: clearFilters,
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
