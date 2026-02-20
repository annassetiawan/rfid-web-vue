import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { Plus, Upload } from 'lucide-vue-next';
import { createMasterUnitColumns } from '@/components/master-data/units/columns';
import DataTable from '@/components/inventory/DataTable.vue';
import DataTablePagination from '@/components/inventory/DataTablePagination.vue';
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue';
import FilterSheet from '@/components/list/FilterSheet.vue';
import ListCard from '@/components/list/ListCard.vue';
import PageHeader from '@/components/list/PageHeader.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import Sheet from '@/components/ui/Sheet.vue';
import Tabs from '@/components/ui/Tabs.vue';
import TabsContent from '@/components/ui/TabsContent.vue';
import TabsList from '@/components/ui/TabsList.vue';
import TabsTrigger from '@/components/ui/TabsTrigger.vue';
import { getActiveBadgeClass, getUnitCategoryBadgeClass } from '@/lib/statusBadges';
import { valueUpdater } from '@/lib/utils';
import { masterUnitsMock } from '@/mock/masterUnits';
const DENSITY_STORAGE_KEY = 'table-density:master-units';
const VIEW_STORAGE_KEY = 'table-view:master-units';
const units = ref([...masterUnitsMock]);
const categoryTab = ref('all');
const density = ref(loadDensity());
const showImage = ref(true);
const showStatus = ref(true);
const showUpdated = ref(true);
const filtersOpen = ref(false);
const filters = reactive({
    category: 'all',
    status: 'all',
    updatedFrom: '',
    updatedTo: '',
});
const draftFilters = reactive({ ...filters });
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });
const detailOpen = ref(false);
const selectedUnitId = ref(null);
const formOpen = ref(false);
const formMode = ref('create');
const editingId = ref(null);
const formError = ref('');
const formValues = reactive({
    name: '',
    category: '',
    status: 'active',
    imageUrl: null,
});
const importOpen = ref(false);
const importPreview = ref([]);
loadViewState();
columnVisibility.value.number = true;
columnVisibility.value.searchText = false;
columnVisibility.value.image = showImage.value;
columnVisibility.value.status = showStatus.value;
columnVisibility.value.updatedAt = showUpdated.value;
const selectedUnit = computed(() => units.value.find((unit) => unit.id === selectedUnitId.value) ?? null);
const filteredRows = computed(() => {
    const effectiveCategory = categoryTab.value !== 'all' ? categoryTab.value : filters.category;
    return units.value
        .filter((unit) => {
        if (effectiveCategory !== 'all' && unit.category !== effectiveCategory)
            return false;
        if (filters.status !== 'all' && unit.status !== filters.status)
            return false;
        if (filters.updatedFrom && unit.updatedAt < filters.updatedFrom)
            return false;
        if (filters.updatedTo && unit.updatedAt > filters.updatedTo)
            return false;
        return true;
    })
        .map((unit) => ({
        ...unit,
        searchText: `${unit.name} ${unit.category} ${unit.status}`.toLowerCase(),
    }));
});
const appliedFiltersCount = computed(() => (filters.category !== 'all' ? 1 : 0)
    + (filters.status !== 'all' ? 1 : 0)
    + (filters.updatedFrom ? 1 : 0)
    + (filters.updatedTo ? 1 : 0));
const onView = (row) => {
    selectedUnitId.value = row.id;
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
    formValues.name = row.name;
    formValues.category = row.category;
    formValues.status = row.status;
    formValues.imageUrl = row.imageUrl ?? null;
    formError.value = '';
    formOpen.value = true;
};
const toggleStatus = (row) => {
    const nextStatus = row.status === 'active' ? 'inactive' : 'active';
    units.value = units.value.map((unit) => unit.id === row.id ? { ...unit, status: nextStatus, updatedAt: today() } : unit);
};
const onDelete = (row) => {
    units.value = units.value.filter((unit) => unit.id !== row.id);
};
const columns = computed(() => createMasterUnitColumns({
    onView,
    onEdit: openEdit,
    onToggle: toggleStatus,
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
watch(() => categoryTab.value, (value) => {
    filters.category = value;
    draftFilters.category = value;
    table.setPageIndex(0);
});
watch(() => density.value, (value) => localStorage.setItem(DENSITY_STORAGE_KEY, value));
watch(() => [showImage.value, showStatus.value, showUpdated.value], () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ showImage: showImage.value, showStatus: showStatus.value, showUpdated: showUpdated.value })));
const onDensityChange = (value) => {
    density.value = value;
};
const onToggleViewOption = (payload) => {
    if (payload.key === 'showImage') {
        showImage.value = payload.value;
        table.getColumn('image')?.toggleVisibility(payload.value);
        return;
    }
    if (payload.key === 'showStatus') {
        showStatus.value = payload.value;
        table.getColumn('status')?.toggleVisibility(payload.value);
        return;
    }
    if (payload.key === 'showUpdated') {
        showUpdated.value = payload.value;
        table.getColumn('updatedAt')?.toggleVisibility(payload.value);
    }
};
const applyFilters = () => {
    Object.assign(filters, draftFilters);
    categoryTab.value = draftFilters.category;
    table.setPageIndex(0);
    filtersOpen.value = false;
};
const resetFilters = () => {
    Object.assign(draftFilters, {
        category: 'all',
        status: 'all',
        updatedFrom: '',
        updatedTo: '',
    });
    Object.assign(filters, draftFilters);
    categoryTab.value = 'all';
    table.setPageIndex(0);
    filtersOpen.value = false;
};
const onSelectChange = (key, event) => {
    const target = event.target;
    if (key === 'category')
        draftFilters.category = target.value;
    if (key === 'status')
        draftFilters.status = target.value;
};
const onInputChange = (key, event) => {
    const target = event.target;
    draftFilters[key] = target.value;
};
const onFormInput = (key, event) => {
    const target = event.target;
    if (key === 'category') {
        formValues.category = target.value;
        return;
    }
    if (key === 'status') {
        formValues.status = target.value;
        return;
    }
    if (key === 'name') {
        formValues.name = target.value;
    }
};
const onImageChange = (event) => {
    const target = event.target;
    const file = target.files?.[0];
    if (!file) {
        formValues.imageUrl = null;
        return;
    }
    formValues.imageUrl = URL.createObjectURL(file);
};
const saveUnit = () => {
    if (!formValues.name.trim() || !formValues.category) {
        formError.value = 'Unit name and category are required.';
        return;
    }
    const now = today();
    if (formMode.value === 'edit' && editingId.value) {
        units.value = units.value.map((unit) => unit.id === editingId.value
            ? {
                ...unit,
                name: formValues.name.trim(),
                category: formValues.category,
                status: formValues.status,
                imageUrl: formValues.imageUrl ?? undefined,
                updatedAt: now,
            }
            : unit);
    }
    else {
        units.value = [
            {
                id: `MU-${Date.now()}`,
                name: formValues.name.trim(),
                category: formValues.category,
                status: formValues.status,
                imageUrl: formValues.imageUrl ?? undefined,
                updatedAt: now,
            },
            ...units.value,
        ];
    }
    closeForm();
};
const closeForm = () => {
    formOpen.value = false;
    resetForm();
};
const resetForm = () => {
    formValues.name = '';
    formValues.category = '';
    formValues.status = 'active';
    formValues.imageUrl = null;
    formError.value = '';
    editingId.value = null;
};
const generateImportPreview = () => {
    importPreview.value = [
        { id: 'MU-IMPORT-01', name: 'PAN-PA-2200', category: 'main', status: 'active', updatedAt: today() },
        { id: 'MU-IMPORT-02', name: 'Power Adapter Kit', category: 'accessory', status: 'active', updatedAt: today() },
        { id: 'MU-IMPORT-03', name: 'Console Cable - XL', category: 'accessory', status: 'inactive', updatedAt: today() },
    ];
};
const applyImport = () => {
    if (importPreview.value.length === 0)
        return;
    units.value = [...importPreview.value, ...units.value];
    importPreview.value = [];
    importOpen.value = false;
};
const onExportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    const header = ['Name', 'Category', 'Status', 'Updated'];
    const body = rows.map((row) => [row.name, row.category, row.status, row.updatedAt]);
    const csv = [header, ...body]
        .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `master-units-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
const onExportExcel = () => {
    console.log('Export Excel (stub) clicked');
};
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
        showImage.value = parsed.showImage ?? true;
        showStatus.value = parsed.showStatus ?? true;
        showUpdated.value = parsed.showUpdated ?? true;
    }
    catch {
        showImage.value = true;
        showStatus.value = true;
        showUpdated.value = true;
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
    title: "Master Data Unit",
    description: "Manage unit metadata and classification across products.",
}));
const __VLS_1 = __VLS_0({
    title: "Master Data Unit",
    description: "Manage unit metadata and classification across products.",
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
        onClick: (...[$event]) => {
            __VLS_ctx.importOpen = true;
        }
    };
    __VLS_5.slots.default;
    const __VLS_10 = {}.Upload;
    /** @type {[typeof __VLS_components.Upload, ]} */ ;
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
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_16.slots.default;
    const __VLS_21 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
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
/** @type {[typeof Tabs, typeof Tabs, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(Tabs, new Tabs({
    modelValue: (__VLS_ctx.categoryTab),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.categoryTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
/** @type {[typeof TabsList, typeof TabsList, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(TabsList, new TabsList({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "all",
}));
const __VLS_35 = __VLS_34({
    value: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
var __VLS_36;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "main",
}));
const __VLS_38 = __VLS_37({
    value: "main",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
var __VLS_39;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "accessory",
}));
const __VLS_41 = __VLS_40({
    value: "accessory",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
var __VLS_42;
var __VLS_33;
/** @type {[typeof TabsContent, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(TabsContent, new TabsContent({
    value: "all",
}));
const __VLS_44 = __VLS_43({
    value: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
/** @type {[typeof TabsContent, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(TabsContent, new TabsContent({
    value: "main",
}));
const __VLS_47 = __VLS_46({
    value: "main",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
/** @type {[typeof TabsContent, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(TabsContent, new TabsContent({
    value: "accessory",
}));
const __VLS_50 = __VLS_49({
    value: "accessory",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_30;
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Units Table",
    description: "Search, filter, and manage master unit data.",
    compact: true,
}));
const __VLS_53 = __VLS_52({
    title: "Units Table",
    description: "Search, filter, and manage master unit data.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search unit name...",
    viewOptions: ([
        { key: 'showImage', label: 'Show image', checked: __VLS_ctx.showImage },
        { key: 'showStatus', label: 'Show status', checked: __VLS_ctx.showStatus },
        { key: 'showUpdated', label: 'Show updated', checked: __VLS_ctx.showUpdated },
    ]),
}));
const __VLS_56 = __VLS_55({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search unit name...",
    viewOptions: ([
        { key: 'showImage', label: 'Show image', checked: __VLS_ctx.showImage },
        { key: 'showStatus', label: 'Show status', checked: __VLS_ctx.showStatus },
        { key: 'showUpdated', label: 'Show updated', checked: __VLS_ctx.showUpdated },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_58;
let __VLS_59;
let __VLS_60;
const __VLS_61 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_62 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_63 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_64 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_65 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_57;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No units found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_67 = __VLS_66({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No units found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_70 = __VLS_69({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
var __VLS_54;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Advanced Filters",
    description: "Filter units by category, status, or date.",
    resetLabel: "Clear",
}));
const __VLS_73 = __VLS_72({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Advanced Filters",
    description: "Filter units by category, status, or date.",
    resetLabel: "Clear",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
let __VLS_75;
let __VLS_76;
let __VLS_77;
const __VLS_78 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_79 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_74.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}));
const __VLS_81 = __VLS_80({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
let __VLS_85;
const __VLS_86 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('status', $event);
    }
};
__VLS_82.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "active",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "inactive",
});
var __VLS_82;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}));
const __VLS_88 = __VLS_87({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_90;
let __VLS_91;
let __VLS_92;
const __VLS_93 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('category', $event);
    }
};
__VLS_89.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "main",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "accessory",
});
var __VLS_89;
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
const __VLS_94 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.updatedFrom),
    type: "date",
}));
const __VLS_95 = __VLS_94({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.updatedFrom),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_97;
let __VLS_98;
let __VLS_99;
const __VLS_100 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('updatedFrom', $event);
    }
};
var __VLS_96;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.updatedTo),
    type: "date",
}));
const __VLS_102 = __VLS_101({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.updatedTo),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('updatedTo', $event);
    }
};
var __VLS_103;
var __VLS_74;
/** @type {[typeof Sheet, typeof Sheet, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(Sheet, new Sheet({
    modelValue: (__VLS_ctx.detailOpen),
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.detailOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
if (__VLS_ctx.selectedUnit) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-full flex-col gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2 border-b border-border/60 pb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-start gap-3" },
    });
    if (__VLS_ctx.selectedUnit.imageUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.selectedUnit.imageUrl),
            alt: (__VLS_ctx.selectedUnit.name),
            ...{ class: "h-14 w-14 shrink-0 rounded-lg border border-border/60 object-cover aspect-square" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted text-sm font-semibold text-muted-foreground aspect-square" },
        });
        (__VLS_ctx.selectedUnit.name.slice(0, 2).toUpperCase());
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    (__VLS_ctx.selectedUnit.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2 flex flex-wrap items-center gap-2" },
    });
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getUnitCategoryBadgeClass(__VLS_ctx.selectedUnit.category)) },
    }));
    const __VLS_112 = __VLS_111({
        variant: "outline",
        ...{ class: (__VLS_ctx.getUnitCategoryBadgeClass(__VLS_ctx.selectedUnit.category)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    (__VLS_ctx.selectedUnit.category === 'main' ? 'Main Product' : 'Accessory');
    var __VLS_113;
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getActiveBadgeClass(__VLS_ctx.selectedUnit.status)) },
    }));
    const __VLS_115 = __VLS_114({
        variant: "outline",
        ...{ class: (__VLS_ctx.getActiveBadgeClass(__VLS_ctx.selectedUnit.status)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    (__VLS_ctx.selectedUnit.status === 'active' ? 'Active' : 'Inactive');
    var __VLS_116;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedUnit.id);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedUnit.updatedAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedUnit))
                return;
            __VLS_ctx.openEdit(__VLS_ctx.selectedUnit);
        }
    };
    __VLS_119.slots.default;
    var __VLS_119;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_125 = __VLS_124({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_127;
    let __VLS_128;
    let __VLS_129;
    const __VLS_130 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedUnit))
                return;
            __VLS_ctx.toggleStatus(__VLS_ctx.selectedUnit);
        }
    };
    __VLS_126.slots.default;
    (__VLS_ctx.selectedUnit.status === 'active' ? 'Deactivate' : 'Activate');
    var __VLS_126;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-2 text-sm text-muted-foreground" },
    });
}
var __VLS_110;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.formOpen),
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.formOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
__VLS_133.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold" },
});
(__VLS_ctx.formMode === 'edit' ? 'Edit Unit' : 'Add New Unit');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
(__VLS_ctx.formMode === 'edit' ? 'Update unit details and status.' : 'Create a new master unit for products or accessories.');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.name),
    placeholder: "Enter unit name",
}));
const __VLS_135 = __VLS_134({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.name),
    placeholder: "Enter unit name",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_137;
let __VLS_138;
let __VLS_139;
const __VLS_140 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('name', $event);
    }
};
var __VLS_136;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.category),
}));
const __VLS_142 = __VLS_141({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.category),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_144;
let __VLS_145;
let __VLS_146;
const __VLS_147 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormInput('category', $event);
    }
};
__VLS_143.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "main",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "accessory",
});
var __VLS_143;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.status),
}));
const __VLS_149 = __VLS_148({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
let __VLS_151;
let __VLS_152;
let __VLS_153;
const __VLS_154 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormInput('status', $event);
    }
};
__VLS_150.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "active",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "inactive",
});
var __VLS_150;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onChange': {} },
    type: "file",
    accept: "image/*",
}));
const __VLS_156 = __VLS_155({
    ...{ 'onChange': {} },
    type: "file",
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_158;
let __VLS_159;
let __VLS_160;
const __VLS_161 = {
    onChange: (__VLS_ctx.onImageChange)
};
var __VLS_157;
if (__VLS_ctx.formValues.imageUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-3 rounded-lg border border-border/60 p-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.formValues.imageUrl),
        alt: "Preview",
        ...{ class: "h-16 w-16 rounded-md object-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
}
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
    onClick: (__VLS_ctx.closeForm)
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
    onClick: (__VLS_ctx.saveUnit)
};
__VLS_171.slots.default;
(__VLS_ctx.formMode === 'edit' ? 'Save Changes' : 'Create Unit');
var __VLS_171;
var __VLS_133;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.importOpen),
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.importOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1 text-xs" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-3" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_180 = __VLS_179({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
let __VLS_182;
let __VLS_183;
let __VLS_184;
const __VLS_185 = {
    onClick: (__VLS_ctx.generateImportPreview)
};
__VLS_181.slots.default;
var __VLS_181;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-lg border border-border/60" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-b border-border/60 px-4 py-3 text-sm font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 text-sm" },
});
if (__VLS_ctx.importPreview.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-muted-foreground" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "space-y-2" },
    });
    for (const [row] of __VLS_getVForSourceType((__VLS_ctx.importPreview))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (row.id),
            ...{ class: "flex items-center justify-between rounded-md border px-3 py-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (row.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-muted-foreground" },
        });
        (row.category);
        (row.status);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_187 = __VLS_186({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
let __VLS_189;
let __VLS_190;
let __VLS_191;
const __VLS_192 = {
    onClick: (...[$event]) => {
        __VLS_ctx.importOpen = false;
    }
};
__VLS_188.slots.default;
var __VLS_188;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.importPreview.length === 0),
}));
const __VLS_194 = __VLS_193({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.importPreview.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_196;
let __VLS_197;
let __VLS_198;
const __VLS_199 = {
    onClick: (__VLS_ctx.applyImport)
};
__VLS_195.slots.default;
var __VLS_195;
var __VLS_178;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
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
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
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
            Upload: Upload,
            DataTable: DataTable,
            DataTablePagination: DataTablePagination,
            DataTableToolbar: DataTableToolbar,
            FilterSheet: FilterSheet,
            ListCard: ListCard,
            PageHeader: PageHeader,
            Badge: Badge,
            Button: Button,
            Dialog: Dialog,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Sheet: Sheet,
            Tabs: Tabs,
            TabsContent: TabsContent,
            TabsList: TabsList,
            TabsTrigger: TabsTrigger,
            getActiveBadgeClass: getActiveBadgeClass,
            getUnitCategoryBadgeClass: getUnitCategoryBadgeClass,
            categoryTab: categoryTab,
            density: density,
            showImage: showImage,
            showStatus: showStatus,
            showUpdated: showUpdated,
            filtersOpen: filtersOpen,
            draftFilters: draftFilters,
            detailOpen: detailOpen,
            formOpen: formOpen,
            formMode: formMode,
            formError: formError,
            formValues: formValues,
            importOpen: importOpen,
            importPreview: importPreview,
            selectedUnit: selectedUnit,
            appliedFiltersCount: appliedFiltersCount,
            openCreate: openCreate,
            openEdit: openEdit,
            toggleStatus: toggleStatus,
            table: table,
            onDensityChange: onDensityChange,
            onToggleViewOption: onToggleViewOption,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
            onFormInput: onFormInput,
            onImageChange: onImageChange,
            saveUnit: saveUnit,
            closeForm: closeForm,
            generateImportPreview: generateImportPreview,
            applyImport: applyImport,
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
