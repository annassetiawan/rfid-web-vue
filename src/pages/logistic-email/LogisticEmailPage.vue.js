import { computed, reactive, ref, watch } from 'vue';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { Copy, Mail, Plus, Warehouse } from 'lucide-vue-next';
import { createLogisticEmailColumns, typeLabelMap } from '@/components/logistic-email/columns';
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
import { getLogisticEmailTypeBadgeClass } from '@/lib/statusBadges';
import { valueUpdater } from '@/lib/utils';
import { logisticEmailsMock } from '@/mock/logisticEmails';
const DENSITY_STORAGE_KEY = 'table-density:logistic-emails';
const VIEW_STORAGE_KEY = 'table-view:logistic-emails';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultFilters = {
    type: 'all',
    warehouseLocation: 'all',
    emailDomain: '',
    name: '',
};
const defaultForm = {
    name: '',
    email: '',
    warehouseLocation: '',
    type: 'warehouse',
};
const emails = ref([...logisticEmailsMock]);
const density = ref(loadDensity());
const showEmail = ref(true);
const showWarehouse = ref(true);
const showType = ref(true);
const showUpdated = ref(true);
const showRowNumbers = ref(true);
const filtersOpen = ref(false);
const filters = reactive({ ...defaultFilters });
const draftFilters = reactive({ ...defaultFilters });
const rowSelection = ref({});
const columnVisibility = ref({});
const columnFilters = ref([]);
const sorting = ref([]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });
const detailOpen = ref(false);
const selectedId = ref(null);
const formOpen = ref(false);
const formMode = ref('create');
const editingId = ref(null);
const formError = ref('');
const formValues = reactive({ ...defaultForm });
const deleteOpen = ref(false);
const deleteCandidate = ref(null);
loadViewState();
columnVisibility.value.number = showRowNumbers.value;
columnVisibility.value.searchText = false;
columnVisibility.value.email = showEmail.value;
columnVisibility.value.warehouseLocation = showWarehouse.value;
columnVisibility.value.type = showType.value;
columnVisibility.value.updatedAt = showUpdated.value;
const selectedEmail = computed(() => emails.value.find((item) => item.id === selectedId.value) ?? null);
const warehouseOptions = computed(() => Array.from(new Set(emails.value.map((item) => item.warehouseLocation).filter(Boolean))).sort((a, b) => a.localeCompare(b)));
const filteredRows = computed(() => emails.value
    .filter((item) => {
    if (filters.type !== 'all' && item.type !== filters.type)
        return false;
    if (filters.warehouseLocation !== 'all' && item.warehouseLocation !== filters.warehouseLocation)
        return false;
    if (filters.emailDomain.trim() && !item.email.toLowerCase().includes(`@${filters.emailDomain.toLowerCase().trim()}`))
        return false;
    if (filters.name.trim() && !item.name.toLowerCase().includes(filters.name.toLowerCase().trim()))
        return false;
    return true;
})
    .map((item) => ({
    ...item,
    searchText: `${item.name} ${item.email} ${item.warehouseLocation} ${item.type}`.toLowerCase(),
})));
const kpi = computed(() => ({
    total: emails.value.length,
    warehouseType: emails.value.filter((item) => item.type === 'warehouse').length,
    ccType: emails.value.filter((item) => item.type === 'cc').length,
}));
const appliedFiltersCount = computed(() => (filters.type !== 'all' ? 1 : 0)
    + (filters.warehouseLocation !== 'all' ? 1 : 0)
    + (filters.emailDomain.trim() ? 1 : 0)
    + (filters.name.trim() ? 1 : 0));
const onView = (row) => {
    selectedId.value = row.id;
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
        name: row.name,
        email: row.email,
        warehouseLocation: row.warehouseLocation,
        type: row.type,
    });
    formError.value = '';
    formOpen.value = true;
};
const openDelete = (row) => {
    deleteCandidate.value = row;
    deleteOpen.value = true;
};
const onDelete = (row) => {
    const original = emails.value.find((item) => item.id === row.id);
    if (!original)
        return;
    openDelete(original);
};
const copyEmail = async (value) => {
    try {
        await navigator.clipboard.writeText(value);
    }
    catch {
        console.log(`Copy failed for ${value}`);
    }
};
const onCopy = (row) => {
    void copyEmail(row.email);
};
const columns = computed(() => createLogisticEmailColumns({
    onView,
    onEdit: openEdit,
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
watch(() => [showEmail.value, showWarehouse.value, showType.value, showUpdated.value, showRowNumbers.value], () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
    showEmail: showEmail.value,
    showWarehouse: showWarehouse.value,
    showType: showType.value,
    showUpdated: showUpdated.value,
    showRowNumbers: showRowNumbers.value,
})));
const onDensityChange = (value) => {
    density.value = value;
};
const onToggleViewOption = (payload) => {
    if (payload.key === 'showEmail') {
        showEmail.value = payload.value;
        table.getColumn('email')?.toggleVisibility(payload.value);
        return;
    }
    if (payload.key === 'showWarehouse') {
        showWarehouse.value = payload.value;
        table.getColumn('warehouseLocation')?.toggleVisibility(payload.value);
        return;
    }
    if (payload.key === 'showType') {
        showType.value = payload.value;
        table.getColumn('type')?.toggleVisibility(payload.value);
        return;
    }
    if (payload.key === 'showUpdated') {
        showUpdated.value = payload.value;
        table.getColumn('updatedAt')?.toggleVisibility(payload.value);
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
    if (key === 'type') {
        draftFilters.type = target.value;
        return;
    }
    if (key === 'warehouseLocation') {
        draftFilters.warehouseLocation = target.value;
    }
};
const onInputChange = (key, event) => {
    const target = event.target;
    draftFilters[key] = target.value;
};
const onFormInput = (key, event) => {
    const target = event.target;
    formValues[key] = target.value;
};
const onFormSelect = (key, event) => {
    const target = event.target;
    if (key === 'type') {
        formValues.type = target.value;
        return;
    }
    formValues.warehouseLocation = target.value === 'none' ? '' : target.value;
};
const saveRecipient = () => {
    const name = formValues.name.trim();
    const email = formValues.email.trim().toLowerCase();
    const warehouseLocation = formValues.warehouseLocation.trim();
    if (!name || !email) {
        formError.value = 'Name and Email are required.';
        return;
    }
    if (!emailRegex.test(email)) {
        formError.value = 'Email format is invalid.';
        return;
    }
    if (formValues.type === 'warehouse' && !warehouseLocation) {
        formError.value = 'Warehouse location is required for Warehouse type.';
        return;
    }
    if (emails.value.some((item) => item.id !== editingId.value
        && item.email.toLowerCase() === email
        && item.warehouseLocation.trim().toLowerCase() === warehouseLocation.toLowerCase()
        && item.type === formValues.type)) {
        formError.value = 'Duplicate combination Email + Warehouse + Type.';
        return;
    }
    const now = today();
    if (formMode.value === 'edit' && editingId.value) {
        emails.value = emails.value.map((item) => item.id === editingId.value
            ? {
                ...item,
                name,
                email,
                warehouseLocation,
                type: formValues.type,
                updatedAt: now,
            }
            : item);
    }
    else {
        const maxId = emails.value.reduce((max, item) => {
            const parsed = Number(item.id.split('-').pop() ?? '0');
            return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
        }, 0);
        emails.value = [
            {
                id: `LE-${String(maxId + 1).padStart(3, '0')}`,
                name,
                email,
                warehouseLocation,
                type: formValues.type,
                createdAt: now,
                updatedAt: now,
            },
            ...emails.value,
        ];
    }
    closeForm();
};
const closeForm = () => {
    formOpen.value = false;
    resetForm();
};
const resetForm = () => {
    formMode.value = 'create';
    editingId.value = null;
    Object.assign(formValues, defaultForm);
    formError.value = '';
};
const confirmDelete = () => {
    if (!deleteCandidate.value)
        return;
    emails.value = emails.value.filter((item) => item.id !== deleteCandidate.value?.id);
    if (selectedId.value === deleteCandidate.value.id) {
        selectedId.value = null;
        detailOpen.value = false;
    }
    deleteOpen.value = false;
    deleteCandidate.value = null;
};
const onExportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    const header = ['Name', 'Email', 'Warehouse', 'Type', 'Created At', 'Updated At'];
    const body = rows.map((row) => [
        row.name,
        row.email,
        row.warehouseLocation,
        row.type,
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
    link.download = `logistic-emails-${today()}.csv`;
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
        showEmail.value = parsed.showEmail ?? true;
        showWarehouse.value = parsed.showWarehouse ?? true;
        showType.value = parsed.showType ?? true;
        showUpdated.value = parsed.showUpdated ?? true;
        showRowNumbers.value = parsed.showRowNumbers ?? true;
    }
    catch {
        showEmail.value = true;
        showWarehouse.value = true;
        showType.value = true;
        showUpdated.value = true;
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
    title: "Logistic Emails",
    description: "Manage recipient lists for logistics notifications by warehouse and type.",
}));
const __VLS_1 = __VLS_0({
    title: "Logistic Emails",
    description: "Manage recipient lists for logistics notifications by warehouse and type.",
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
    ...{ class: "grid gap-4 md:grid-cols-3" },
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
const __VLS_30 = {}.Mail;
/** @type {[typeof __VLS_components.Mail, ]} */ ;
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
(__VLS_ctx.kpi.warehouseType);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_43 = {}.Warehouse;
/** @type {[typeof __VLS_components.Warehouse, ]} */ ;
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
(__VLS_ctx.kpi.ccType);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
});
const __VLS_56 = {}.Copy;
/** @type {[typeof __VLS_components.Copy, ]} */ ;
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
/** @type {[typeof ListCard, typeof ListCard, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(ListCard, new ListCard({
    title: "Logistic Email List",
    description: "Manage recipient lists for logistics notifications.",
    compact: true,
}));
const __VLS_64 = __VLS_63({
    title: "Logistic Email List",
    description: "Manage recipient lists for logistics notifications.",
    compact: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
/** @type {[typeof DataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(DataTableToolbar, new DataTableToolbar({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search name, email, warehouse...",
    viewOptions: ([
        { key: 'showEmail', label: 'Show email', checked: __VLS_ctx.showEmail },
        { key: 'showWarehouse', label: 'Show warehouse', checked: __VLS_ctx.showWarehouse },
        { key: 'showType', label: 'Show type', checked: __VLS_ctx.showType },
        { key: 'showUpdated', label: 'Show updated', checked: __VLS_ctx.showUpdated },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}));
const __VLS_67 = __VLS_66({
    ...{ 'onOpenFilters': {} },
    ...{ 'onToggle:viewOption': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onExportCsv': {} },
    ...{ 'onExportExcel': {} },
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    appliedFiltersCount: (__VLS_ctx.appliedFiltersCount),
    searchColumnId: "searchText",
    searchPlaceholder: "Search name, email, warehouse...",
    viewOptions: ([
        { key: 'showEmail', label: 'Show email', checked: __VLS_ctx.showEmail },
        { key: 'showWarehouse', label: 'Show warehouse', checked: __VLS_ctx.showWarehouse },
        { key: 'showType', label: 'Show type', checked: __VLS_ctx.showType },
        { key: 'showUpdated', label: 'Show updated', checked: __VLS_ctx.showUpdated },
        { key: 'showRowNumbers', label: 'Show row numbers', checked: __VLS_ctx.showRowNumbers },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onOpenFilters: (...[$event]) => {
        __VLS_ctx.filtersOpen = true;
    }
};
const __VLS_73 = {
    'onToggle:viewOption': (__VLS_ctx.onToggleViewOption)
};
const __VLS_74 = {
    'onUpdate:density': (__VLS_ctx.onDensityChange)
};
const __VLS_75 = {
    onExportCsv: (__VLS_ctx.onExportCsv)
};
const __VLS_76 = {
    onExportExcel: (__VLS_ctx.onExportExcel)
};
var __VLS_68;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-4 pb-2 text-sm text-muted-foreground" },
});
(__VLS_ctx.table.getFilteredRowModel().rows.length);
/** @type {[typeof DataTable, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(DataTable, new DataTable({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No recipients found",
    emptyDescription: "Try adjusting filters.",
}));
const __VLS_78 = __VLS_77({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    wrapText: (false),
    emptyTitle: "No recipients found",
    emptyDescription: "Try adjusting filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
/** @type {[typeof DataTablePagination, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(DataTablePagination, new DataTablePagination({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}));
const __VLS_81 = __VLS_80({
    table: (__VLS_ctx.table),
    density: (__VLS_ctx.density),
    totalRows: (__VLS_ctx.table.getFilteredRowModel().rows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
var __VLS_65;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Logistic Email Filters",
    description: "Refine recipients by type, warehouse, domain, and name.",
    resetLabel: "Reset",
}));
const __VLS_84 = __VLS_83({
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    title: "Logistic Email Filters",
    description: "Refine recipients by type, warehouse, domain, and name.",
    resetLabel: "Reset",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_86;
let __VLS_87;
let __VLS_88;
const __VLS_89 = {
    onApply: (__VLS_ctx.applyFilters)
};
const __VLS_90 = {
    onReset: (__VLS_ctx.resetFilters)
};
__VLS_85.slots.default;
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
    value: (__VLS_ctx.draftFilters.type),
}));
const __VLS_92 = __VLS_91({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_94;
let __VLS_95;
let __VLS_96;
const __VLS_97 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('type', $event);
    }
};
__VLS_93.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "warehouse",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cc",
});
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
    value: (__VLS_ctx.draftFilters.warehouseLocation),
}));
const __VLS_99 = __VLS_98({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draftFilters.warehouseLocation),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_101;
let __VLS_102;
let __VLS_103;
const __VLS_104 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('warehouseLocation', $event);
    }
};
__VLS_100.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.warehouseOptions))) {
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
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.emailDomain),
    placeholder: "paloaltonetworks.com",
}));
const __VLS_106 = __VLS_105({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.emailDomain),
    placeholder: "paloaltonetworks.com",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('emailDomain', $event);
    }
};
var __VLS_107;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.name),
    placeholder: "Filter name",
}));
const __VLS_113 = __VLS_112({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draftFilters.name),
    placeholder: "Filter name",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_115;
let __VLS_116;
let __VLS_117;
const __VLS_118 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('name', $event);
    }
};
var __VLS_114;
var __VLS_85;
/** @type {[typeof Sheet, typeof Sheet, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(Sheet, new Sheet({
    modelValue: (__VLS_ctx.detailOpen),
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.detailOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
if (__VLS_ctx.selectedEmail) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-full flex-col gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2 border-b border-border/60 pb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-semibold" },
    });
    (__VLS_ctx.selectedEmail.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap items-center gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-mono text-xs" },
    });
    (__VLS_ctx.selectedEmail.email);
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getLogisticEmailTypeBadgeClass(__VLS_ctx.selectedEmail.type)) },
    }));
    const __VLS_123 = __VLS_122({
        variant: "outline",
        ...{ class: (__VLS_ctx.getLogisticEmailTypeBadgeClass(__VLS_ctx.selectedEmail.type)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    (__VLS_ctx.typeLabelMap[__VLS_ctx.selectedEmail.type]);
    var __VLS_124;
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
        ...{ class: "mt-3 space-y-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedEmail.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-mono text-xs break-all" },
    });
    (__VLS_ctx.selectedEmail.email);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
        ...{ class: (__VLS_ctx.getLogisticEmailTypeBadgeClass(__VLS_ctx.selectedEmail.type)) },
    }));
    const __VLS_126 = __VLS_125({
        variant: "outline",
        ...{ class: (__VLS_ctx.getLogisticEmailTypeBadgeClass(__VLS_ctx.selectedEmail.type)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (__VLS_ctx.typeLabelMap[__VLS_ctx.selectedEmail.type]);
    var __VLS_127;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "rounded-lg border border-border/60 p-4 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedEmail.warehouseLocation || '-');
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
    (__VLS_ctx.selectedEmail.createdAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedEmail.updatedAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_131;
    let __VLS_132;
    let __VLS_133;
    const __VLS_134 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedEmail))
                return;
            __VLS_ctx.openEdit(__VLS_ctx.selectedEmail);
        }
    };
    __VLS_130.slots.default;
    var __VLS_130;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_136 = __VLS_135({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    let __VLS_138;
    let __VLS_139;
    let __VLS_140;
    const __VLS_141 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedEmail))
                return;
            __VLS_ctx.copyEmail(__VLS_ctx.selectedEmail.email);
        }
    };
    __VLS_137.slots.default;
    var __VLS_137;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "destructive",
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onClick': {} },
        variant: "destructive",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_145;
    let __VLS_146;
    let __VLS_147;
    const __VLS_148 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.selectedEmail))
                return;
            __VLS_ctx.openDelete(__VLS_ctx.selectedEmail);
        }
    };
    __VLS_144.slots.default;
    var __VLS_144;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-2 text-sm text-muted-foreground" },
    });
}
var __VLS_121;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.formOpen),
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.formOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold" },
});
(__VLS_ctx.formMode === 'edit' ? 'Edit Logistic Email' : 'Add New Email');
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
const __VLS_152 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.name),
    placeholder: "Enter recipient name",
}));
const __VLS_153 = __VLS_152({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.name),
    placeholder: "Enter recipient name",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_155;
let __VLS_156;
let __VLS_157;
const __VLS_158 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('name', $event);
    }
};
var __VLS_154;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.email),
    type: "email",
    placeholder: "Enter recipient email",
}));
const __VLS_160 = __VLS_159({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.formValues.email),
    type: "email",
    placeholder: "Enter recipient email",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
let __VLS_162;
let __VLS_163;
let __VLS_164;
const __VLS_165 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onFormInput('email', $event);
    }
};
var __VLS_161;
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
const __VLS_166 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.type),
}));
const __VLS_167 = __VLS_166({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
let __VLS_169;
let __VLS_170;
let __VLS_171;
const __VLS_172 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormSelect('type', $event);
    }
};
__VLS_168.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "warehouse",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cc",
});
var __VLS_168;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.warehouseLocation || 'none'),
}));
const __VLS_174 = __VLS_173({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.formValues.warehouseLocation || 'none'),
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
let __VLS_176;
let __VLS_177;
let __VLS_178;
const __VLS_179 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onFormSelect('warehouseLocation', $event);
    }
};
__VLS_175.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "none",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.warehouseOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
var __VLS_175;
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
const __VLS_180 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_181 = __VLS_180({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_183;
let __VLS_184;
let __VLS_185;
const __VLS_186 = {
    onClick: (__VLS_ctx.closeForm)
};
__VLS_182.slots.default;
var __VLS_182;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_188 = __VLS_187({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
let __VLS_190;
let __VLS_191;
let __VLS_192;
const __VLS_193 = {
    onClick: (__VLS_ctx.saveRecipient)
};
__VLS_189.slots.default;
(__VLS_ctx.formMode === 'edit' ? 'Save Changes' : 'Create');
var __VLS_189;
var __VLS_151;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.deleteOpen),
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.deleteOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
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
(__VLS_ctx.deleteCandidate?.email || 'selected recipient');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_198 = __VLS_197({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_200;
let __VLS_201;
let __VLS_202;
const __VLS_203 = {
    onClick: (...[$event]) => {
        __VLS_ctx.deleteOpen = false;
    }
};
__VLS_199.slots.default;
var __VLS_199;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_205 = __VLS_204({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
let __VLS_207;
let __VLS_208;
let __VLS_209;
const __VLS_210 = {
    onClick: (__VLS_ctx.confirmDelete)
};
__VLS_206.slots.default;
var __VLS_206;
var __VLS_196;
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
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
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
            Copy: Copy,
            Mail: Mail,
            Plus: Plus,
            Warehouse: Warehouse,
            typeLabelMap: typeLabelMap,
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
            getLogisticEmailTypeBadgeClass: getLogisticEmailTypeBadgeClass,
            density: density,
            showEmail: showEmail,
            showWarehouse: showWarehouse,
            showType: showType,
            showUpdated: showUpdated,
            showRowNumbers: showRowNumbers,
            filtersOpen: filtersOpen,
            draftFilters: draftFilters,
            detailOpen: detailOpen,
            formOpen: formOpen,
            formMode: formMode,
            formError: formError,
            formValues: formValues,
            deleteOpen: deleteOpen,
            deleteCandidate: deleteCandidate,
            selectedEmail: selectedEmail,
            warehouseOptions: warehouseOptions,
            kpi: kpi,
            appliedFiltersCount: appliedFiltersCount,
            openCreate: openCreate,
            openEdit: openEdit,
            openDelete: openDelete,
            copyEmail: copyEmail,
            table: table,
            onDensityChange: onDensityChange,
            onToggleViewOption: onToggleViewOption,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
            onFormInput: onFormInput,
            onFormSelect: onFormSelect,
            saveRecipient: saveRecipient,
            closeForm: closeForm,
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
