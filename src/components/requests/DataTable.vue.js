import { computed } from 'vue';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Table from '@/components/ui/Table.vue';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';
import { getRequestStatusBadgeClass } from '@/lib/requestBadges';
const __VLS_emit = defineEmits();
const props = defineProps();
const visibleColumns = computed(() => props.columns.filter((column) => column.defaultVisible));
const getCellValue = (row, key) => {
    if (key === 'warehouse')
        return row.warehouse;
    if (key === 'companyName')
        return row.companyName;
    if (key === 'requestType')
        return row.requestType;
    if (key === 'serviceLevel')
        return row.serviceLevel;
    if (key === 'createdDate')
        return row.createdDate;
    return '';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-lg border bg-card overflow-hidden" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-x-auto" },
});
/** @type {[typeof Table, typeof Table, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Table, new Table({
    ...{ class: "min-w-[980px]" },
}));
const __VLS_1 = __VLS_0({
    ...{ class: "min-w-[980px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof TableHeader, typeof TableHeader, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(TableHeader, new TableHeader({
    ...{ class: "bg-muted/40" },
}));
const __VLS_4 = __VLS_3({
    ...{ class: "bg-muted/40" },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
/** @type {[typeof TableRow, typeof TableRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.visibleColumns))) {
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        key: (column.id),
        ...{ class: "h-10 px-3 text-xs text-muted-foreground" },
    }));
    const __VLS_10 = __VLS_9({
        key: (column.id),
        ...{ class: "h-10 px-3 text-xs text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    (column.label);
    var __VLS_11;
}
/** @type {[typeof TableHead, typeof TableHead, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(TableHead, new TableHead({
    ...{ class: "h-10 px-3 text-right text-xs text-muted-foreground" },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "h-10 px-3 text-right text-xs text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
var __VLS_14;
var __VLS_8;
var __VLS_5;
/** @type {[typeof TableBody, typeof TableBody, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(TableBody, new TableBody({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
for (const [row] of __VLS_getVForSourceType((__VLS_ctx.rows))) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(TableRow, new TableRow({
        key: (row.id),
        ...{ class: "hover:bg-muted/30" },
    }));
    const __VLS_19 = __VLS_18({
        key: (row.id),
        ...{ class: "hover:bg-muted/30" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    for (const [column] of __VLS_getVForSourceType((__VLS_ctx.visibleColumns))) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(TableCell, new TableCell({
            key: (`${row.id}-${column.id}`),
            ...{ class: "px-3 py-2" },
        }));
        const __VLS_22 = __VLS_21({
            key: (`${row.id}-${column.id}`),
            ...{ class: "px-3 py-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        if (column.id === 'requestNumber') {
            /** @type {[typeof Button, typeof Button, ]} */ ;
            // @ts-ignore
            const __VLS_24 = __VLS_asFunctionalComponent(Button, new Button({
                ...{ 'onClick': {} },
                variant: "link",
                ...{ class: "h-auto p-0 font-medium" },
            }));
            const __VLS_25 = __VLS_24({
                ...{ 'onClick': {} },
                variant: "link",
                ...{ class: "h-auto p-0 font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_24));
            let __VLS_27;
            let __VLS_28;
            let __VLS_29;
            const __VLS_30 = {
                onClick: (...[$event]) => {
                    if (!(column.id === 'requestNumber'))
                        return;
                    __VLS_ctx.$emit('open', row);
                }
            };
            __VLS_26.slots.default;
            (row.requestNumber);
            var __VLS_26;
        }
        else if (column.id === 'status') {
            /** @type {[typeof Badge, typeof Badge, ]} */ ;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent(Badge, new Badge({
                variant: "outline",
                ...{ class: (__VLS_ctx.getRequestStatusBadgeClass(row.status)) },
            }));
            const __VLS_32 = __VLS_31({
                variant: "outline",
                ...{ class: (__VLS_ctx.getRequestStatusBadgeClass(row.status)) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            __VLS_33.slots.default;
            (row.status);
            var __VLS_33;
        }
        else {
            (__VLS_ctx.getCellValue(row, column.id));
        }
        var __VLS_23;
    }
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        ...{ class: "px-3 py-2 text-right" },
    }));
    const __VLS_35 = __VLS_34({
        ...{ class: "px-3 py-2 text-right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    /** @type {[typeof RowActionsMenu, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(RowActionsMenu, new RowActionsMenu({
        ...{ 'onSelect': {} },
        actions: (__VLS_ctx.rowActions),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onSelect': {} },
        actions: (__VLS_ctx.rowActions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onSelect: (...[$event]) => {
            __VLS_ctx.$emit('action', { action: $event, row });
        }
    };
    var __VLS_39;
    var __VLS_36;
    var __VLS_20;
}
if (__VLS_ctx.rows.length === 0) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_46.slots.default;
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        colspan: (__VLS_ctx.visibleColumns.length + 1),
        ...{ class: "py-10 text-center text-sm text-muted-foreground" },
    }));
    const __VLS_48 = __VLS_47({
        colspan: (__VLS_ctx.visibleColumns.length + 1),
        ...{ class: "py-10 text-center text-sm text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_49.slots.default;
    var __VLS_49;
    var __VLS_46;
}
var __VLS_17;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[980px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted/30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RowActionsMenu: RowActionsMenu,
            Badge: Badge,
            Button: Button,
            Table: Table,
            TableBody: TableBody,
            TableCell: TableCell,
            TableHead: TableHead,
            TableHeader: TableHeader,
            TableRow: TableRow,
            getRequestStatusBadgeClass: getRequestStatusBadgeClass,
            visibleColumns: visibleColumns,
            getCellValue: getCellValue,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
