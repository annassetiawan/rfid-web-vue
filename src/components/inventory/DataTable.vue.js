import { computed } from 'vue';
import { FlexRender } from '@tanstack/vue-table';
import { PackageX } from 'lucide-vue-next';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';
import Table from '@/components/ui/Table.vue';
const props = withDefaults(defineProps(), {
    wrapText: false,
    tableClass: 'max-h-[520px] overflow-auto [&_table]:table-fixed',
    emptyTitle: 'No results',
    emptyDescription: 'Try adjusting filters.',
});
const headerRowClass = computed(() => {
    if (props.density === 'compact')
        return 'h-8';
    return 'h-11';
});
const headerCellClass = computed(() => {
    if (props.density === 'compact')
        return 'py-1 text-[11px]';
    return 'py-2 text-xs';
});
const rowClass = computed(() => {
    if (props.density === 'compact')
        return 'h-8';
    return 'h-12';
});
const cellClass = computed(() => {
    if (props.density === 'compact')
        return 'px-1.5 py-2 text-xs leading-4';
    return 'px-2 py-3 text-sm leading-5';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    wrapText: false,
    tableClass: 'max-h-[520px] overflow-auto [&_table]:table-fixed',
    emptyTitle: 'No results',
    emptyDescription: 'Try adjusting filters.',
});
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
    ...{ class: (__VLS_ctx.tableClass) },
}));
const __VLS_1 = __VLS_0({
    ...{ class: (__VLS_ctx.tableClass) },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof TableHeader, typeof TableHeader, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(TableHeader, new TableHeader({
    ...{ class: "[&_tr]:border-b [&_th]:sticky [&_th]:top-0 [&_th]:z-10" },
}));
const __VLS_4 = __VLS_3({
    ...{ class: "[&_tr]:border-b [&_th]:sticky [&_th]:top-0 [&_th]:z-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
for (const [headerGroup] of __VLS_getVForSourceType((__VLS_ctx.table.getHeaderGroups()))) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(TableRow, new TableRow({
        key: (headerGroup.id),
        ...{ class: ([__VLS_ctx.headerRowClass, 'bg-muted/40']) },
    }));
    const __VLS_7 = __VLS_6({
        key: (headerGroup.id),
        ...{ class: ([__VLS_ctx.headerRowClass, 'bg-muted/40']) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    for (const [header] of __VLS_getVForSourceType((headerGroup.headers))) {
        /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(TableHead, new TableHead({
            key: (header.id),
            ...{ class: "h-10 px-2 font-medium text-muted-foreground whitespace-nowrap" },
            ...{ class: (__VLS_ctx.headerCellClass) },
        }));
        const __VLS_10 = __VLS_9({
            key: (header.id),
            ...{ class: "h-10 px-2 font-medium text-muted-foreground whitespace-nowrap" },
            ...{ class: (__VLS_ctx.headerCellClass) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        if (!header.isPlaceholder) {
            const __VLS_12 = {}.FlexRender;
            /** @type {[typeof __VLS_components.FlexRender, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                render: (header.column.columnDef.header),
                props: (header.getContext()),
            }));
            const __VLS_14 = __VLS_13({
                render: (header.column.columnDef.header),
                props: (header.getContext()),
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        }
        var __VLS_11;
    }
    var __VLS_8;
}
var __VLS_5;
/** @type {[typeof TableBody, typeof TableBody, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(TableBody, new TableBody({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
if (__VLS_ctx.table.getRowModel().rows?.length) {
    for (const [row] of __VLS_getVForSourceType((__VLS_ctx.table.getRowModel().rows))) {
        /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(TableRow, new TableRow({
            key: (row.id),
            ...{ class: "border-b last:border-b-0 hover:bg-muted/30" },
            ...{ class: (__VLS_ctx.rowClass) },
        }));
        const __VLS_20 = __VLS_19({
            key: (row.id),
            ...{ class: "border-b last:border-b-0 hover:bg-muted/30" },
            ...{ class: (__VLS_ctx.rowClass) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        __VLS_21.slots.default;
        for (const [cell] of __VLS_getVForSourceType((row.getVisibleCells()))) {
            /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(TableCell, new TableCell({
                key: (cell.id),
                ...{ class: ([__VLS_ctx.cellClass, __VLS_ctx.wrapText ? 'whitespace-normal break-words' : 'whitespace-nowrap']) },
            }));
            const __VLS_23 = __VLS_22({
                key: (cell.id),
                ...{ class: ([__VLS_ctx.cellClass, __VLS_ctx.wrapText ? 'whitespace-normal break-words' : 'whitespace-nowrap']) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_22));
            __VLS_24.slots.default;
            const __VLS_25 = {}.FlexRender;
            /** @type {[typeof __VLS_components.FlexRender, ]} */ ;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                render: (cell.column.columnDef.cell),
                props: (cell.getContext()),
            }));
            const __VLS_27 = __VLS_26({
                render: (cell.column.columnDef.cell),
                props: (cell.getContext()),
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
            var __VLS_24;
        }
        var __VLS_21;
    }
}
else {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        colspan: (__VLS_ctx.table.getAllLeafColumns().length),
    }));
    const __VLS_33 = __VLS_32({
        colspan: (__VLS_ctx.table.getAllLeafColumns().length),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center justify-center gap-2 py-10 text-center" },
    });
    const __VLS_35 = {}.PackageX;
    /** @type {[typeof __VLS_components.PackageX, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        ...{ class: "h-8 w-8 text-muted-foreground" },
    }));
    const __VLS_37 = __VLS_36({
        ...{ class: "h-8 w-8 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    (__VLS_ctx.emptyTitle);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    (__VLS_ctx.emptyDescription);
    var __VLS_34;
    var __VLS_31;
}
var __VLS_18;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_tr]:border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_th]:sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_th]:top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_th]:z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['last:border-b-0']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted/30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FlexRender: FlexRender,
            PackageX: PackageX,
            TableBody: TableBody,
            TableCell: TableCell,
            TableHead: TableHead,
            TableHeader: TableHeader,
            TableRow: TableRow,
            Table: Table,
            headerRowClass: headerRowClass,
            headerCellClass: headerCellClass,
            rowClass: rowClass,
            cellClass: cellClass,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
