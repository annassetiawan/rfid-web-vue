import { Archive, Boxes, ClipboardList, PackageSearch } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import DataTableShell from '@/components/data/DataTableShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import Button from '@/components/ui/Button.vue';
import AppShell from '@/layouts/AppShell.vue';
const route = useRoute();
const navItems = [
    { label: 'Overview', to: '/dashboard/overview', icon: Archive, group: 'Dashboard' },
    { label: 'Requests', to: '/requests/local', icon: ClipboardList, group: 'Operations' },
    { label: 'Inventory', to: '/inventory', icon: Boxes, group: 'Operations' },
    { label: 'Inventory (Demo)', to: '/demo/inventory', icon: PackageSearch, group: 'Demo' },
];
const columns = [
    { key: 'name', label: 'Name', hideable: true },
    { key: 'serialNumber', label: 'Serial Number', hideable: true },
    { key: 'rfidCode', label: 'RFID Code', hideable: true },
    { key: 'inventoryStatus', label: 'Inventory Status', hideable: true },
    { key: 'location', label: 'Location', hideable: true },
    { key: 'taggedDate', label: 'Tagged Date', hideable: true },
    { key: 'status', label: 'Status', hideable: true },
];
const rows = [
    { id: 1, name: 'Pallet Sensor A', serialNumber: 'SN-1001', rfidCode: 'RFID-A12X', inventoryStatus: 'In Stock', location: 'WH-A / Rack 01', taggedDate: '2026-01-06', status: 'Active' },
    { id: 2, name: 'Container Seal B', serialNumber: 'SN-1002', rfidCode: 'RFID-B13Y', inventoryStatus: 'In Transit', location: 'Dock 2', taggedDate: '2026-01-09', status: 'Active' },
    { id: 3, name: 'Forklift Tag C', serialNumber: 'SN-1003', rfidCode: 'RFID-C14Z', inventoryStatus: 'In Stock', location: 'WH-B / Lane 03', taggedDate: '2026-01-10', status: 'Active' },
    { id: 4, name: 'Return Bin D', serialNumber: 'SN-1004', rfidCode: 'RFID-D15Q', inventoryStatus: 'Reserved', location: 'WH-A / Rack 11', taggedDate: '2026-01-13', status: 'Pending' },
    { id: 5, name: 'Asset Crate E', serialNumber: 'SN-1005', rfidCode: 'RFID-E16R', inventoryStatus: 'In Stock', location: 'WH-C / Zone 2', taggedDate: '2026-01-15', status: 'Active' },
    { id: 6, name: 'Spare Parts F', serialNumber: 'SN-1006', rfidCode: 'RFID-F17S', inventoryStatus: 'Cycle Count', location: 'WH-B / Rack 05', taggedDate: '2026-01-20', status: 'Flagged' },
    { id: 7, name: 'Packaging Unit G', serialNumber: 'SN-1007', rfidCode: 'RFID-G18T', inventoryStatus: 'In Transit', location: 'Outbound Bay', taggedDate: '2026-01-21', status: 'Active' },
    { id: 8, name: 'Dispatch Tag H', serialNumber: 'SN-1008', rfidCode: 'RFID-H19U', inventoryStatus: 'Reserved', location: 'WH-C / Zone 4', taggedDate: '2026-01-25', status: 'Pending' },
    { id: 9, name: 'Inbound Kit I', serialNumber: 'SN-1009', rfidCode: 'RFID-I20V', inventoryStatus: 'In Stock', location: 'WH-A / Rack 06', taggedDate: '2026-01-29', status: 'Active' },
    { id: 10, name: 'Repair Item J', serialNumber: 'SN-1010', rfidCode: 'RFID-J21W', inventoryStatus: 'Hold', location: 'QA Room', taggedDate: '2026-02-01', status: 'Inactive' },
];
const onSearch = (value) => console.log('search:', value);
const onFilters = () => console.log('filters clicked');
const onColumnsVisible = (value) => console.log('columns visible:', value);
const onDensity = (value) => console.log('density:', value);
const onExport = () => console.log('export clicked');
const onRowClick = (row) => console.log('row clicked:', row);
const onRowAction = (row) => console.log('row action:', row);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof AppShell, typeof AppShell, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppShell, new AppShell({
    items: (__VLS_ctx.navItems),
    activePath: (__VLS_ctx.route.path),
    title: "Inventory Demo",
}));
const __VLS_1 = __VLS_0({
    items: (__VLS_ctx.navItems),
    activePath: (__VLS_ctx.route.path),
    title: "Inventory Demo",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "Inventory (Demo)",
    description: "Reusable table page pattern for RFID inventory records.",
}));
const __VLS_5 = __VLS_4({
    title: "Inventory (Demo)",
    description: "Reusable table page pattern for RFID inventory records.",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
{
    const { meta: __VLS_thisSlot } = __VLS_6.slots;
}
{
    const { actions: __VLS_thisSlot } = __VLS_6.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "outline",
    }));
    const __VLS_8 = __VLS_7({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_9.slots.default;
    var __VLS_9;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "outline",
    }));
    const __VLS_11 = __VLS_10({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    var __VLS_12;
}
var __VLS_6;
/** @type {[typeof DataTableShell, typeof DataTableShell, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(DataTableShell, new DataTableShell({
    ...{ 'onUpdate:search': {} },
    ...{ 'onUpdate:filters': {} },
    ...{ 'onUpdate:columnsVisible': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onClick:export': {} },
    ...{ 'onRow:click': {} },
    title: "Tagged Assets",
    description: "Showing sample rows for inventory management.",
    columns: (__VLS_ctx.columns),
    rows: (__VLS_ctx.rows),
    emptyTitle: "No assets found",
    emptyDesc: "Adjust your query or clear filters.",
}));
const __VLS_14 = __VLS_13({
    ...{ 'onUpdate:search': {} },
    ...{ 'onUpdate:filters': {} },
    ...{ 'onUpdate:columnsVisible': {} },
    ...{ 'onUpdate:density': {} },
    ...{ 'onClick:export': {} },
    ...{ 'onRow:click': {} },
    title: "Tagged Assets",
    description: "Showing sample rows for inventory management.",
    columns: (__VLS_ctx.columns),
    rows: (__VLS_ctx.rows),
    emptyTitle: "No assets found",
    emptyDesc: "Adjust your query or clear filters.",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    'onUpdate:search': (__VLS_ctx.onSearch)
};
const __VLS_20 = {
    'onUpdate:filters': (__VLS_ctx.onFilters)
};
const __VLS_21 = {
    'onUpdate:columnsVisible': (__VLS_ctx.onColumnsVisible)
};
const __VLS_22 = {
    'onUpdate:density': (__VLS_ctx.onDensity)
};
const __VLS_23 = {
    'onClick:export': (__VLS_ctx.onExport)
};
const __VLS_24 = {
    'onRow:click': (__VLS_ctx.onRowClick)
};
__VLS_15.slots.default;
{
    const { 'row-actions': __VLS_thisSlot } = __VLS_15.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "ghost",
        ...{ class: "px-2" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        variant: "ghost",
        ...{ class: "px-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onRowAction(row);
        }
    };
    __VLS_27.slots.default;
    var __VLS_27;
}
var __VLS_15;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DataTableShell: DataTableShell,
            PageHeader: PageHeader,
            Button: Button,
            AppShell: AppShell,
            route: route,
            navItems: navItems,
            columns: columns,
            rows: rows,
            onSearch: onSearch,
            onFilters: onFilters,
            onColumnsVisible: onColumnsVisible,
            onDensity: onDensity,
            onExport: onExport,
            onRowClick: onRowClick,
            onRowAction: onRowAction,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
