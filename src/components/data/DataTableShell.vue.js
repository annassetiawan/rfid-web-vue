import { computed, ref, useSlots, watch } from 'vue';
import Button from '@/components/ui/Button.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Table from '@/components/ui/Table.vue';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';
const props = withDefaults(defineProps(), {
    loading: false,
    emptyTitle: 'No records found',
    emptyDesc: 'Try adjusting search, filters, or column visibility.',
});
const emit = defineEmits();
const slots = useSlots();
const hasActionsSlot = computed(() => Boolean(slots['row-actions']));
const localSearch = ref('');
const density = ref('comfortable');
const rowsPerPage = ref(10);
const currentPage = ref(1);
const visibleColumnKeys = ref(props.columns.map((col) => col.key));
watch(() => props.columns, (nextColumns) => {
    const nextKeys = nextColumns.map((col) => col.key);
    visibleColumnKeys.value = visibleColumnKeys.value.filter((key) => nextKeys.includes(key));
    for (const key of nextKeys) {
        if (!visibleColumnKeys.value.includes(key)) {
            visibleColumnKeys.value.push(key);
        }
    }
}, { deep: true });
watch(localSearch, (value) => {
    currentPage.value = 1;
    emit('update:search', value);
});
const visibleColumns = computed(() => props.columns.filter((col) => visibleColumnKeys.value.includes(col.key)));
const filteredRows = computed(() => {
    const keyword = localSearch.value.trim().toLowerCase();
    if (!keyword)
        return props.rows;
    return props.rows.filter((row) => props.columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(keyword)));
});
const totalPages = computed(() => {
    const pages = Math.ceil(filteredRows.value.length / rowsPerPage.value);
    return pages > 0 ? pages : 1;
});
const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    return filteredRows.value.slice(start, start + rowsPerPage.value);
});
const densityClass = computed(() => (density.value === 'comfortable' ? 'py-3 text-sm' : 'py-1.5 text-xs'));
const emptyTitleText = computed(() => props.emptyTitle);
const emptyDescText = computed(() => props.emptyDesc);
const rowKey = (row) => {
    const maybeId = row.id ?? row.serialNumber ?? row.rfidCode ?? row.name;
    return String(maybeId ?? JSON.stringify(row));
};
const isColumnVisible = (key) => visibleColumnKeys.value.includes(key);
const toggleColumn = (column) => {
    if (column.hideable === false)
        return;
    const key = column.key;
    if (isColumnVisible(key)) {
        visibleColumnKeys.value = visibleColumnKeys.value.filter((value) => value !== key);
    }
    else {
        visibleColumnKeys.value = [...visibleColumnKeys.value, key];
    }
    emit('update:columnsVisible', [...visibleColumnKeys.value]);
};
const setDensity = (value) => {
    density.value = value;
    emit('update:density', value);
};
const setRowsPerPage = (event) => {
    const target = event.target;
    rowsPerPage.value = Number(target.value) || 10;
    currentPage.value = 1;
};
const setPage = (page) => {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    loading: false,
    emptyTitle: 'No records found',
    emptyDesc: 'Try adjusting search, filters, or column visibility.',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "space-y-4" },
});
if (__VLS_ctx.title || __VLS_ctx.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1" },
    });
    if (__VLS_ctx.title) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: "text-lg font-semibold" },
        });
        (__VLS_ctx.title);
    }
    if (__VLS_ctx.description) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-muted-foreground" },
        });
        (__VLS_ctx.description);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Input, new Input({
    modelValue: (__VLS_ctx.localSearch),
    type: "search",
    placeholder: "Search...",
    ...{ class: "w-full sm:max-w-xs" },
}));
const __VLS_1 = __VLS_0({
    modelValue: (__VLS_ctx.localSearch),
    type: "search",
    placeholder: "Search...",
    ...{ class: "w-full sm:max-w-xs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
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
        __VLS_ctx.$emit('update:filters');
    }
};
__VLS_5.slots.default;
var __VLS_5;
/** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_12.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "outline",
    }));
    const __VLS_14 = __VLS_13({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        key: (col.key),
        ...{ class: "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (...[$event]) => {
                __VLS_ctx.toggleColumn(col);
            } },
        type: "checkbox",
        ...{ class: "h-4 w-4 rounded border-border" },
        checked: (__VLS_ctx.isColumnVisible(col.key)),
        disabled: (col.hideable === false),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (col.label);
}
var __VLS_12;
/** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_18.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "outline",
    }));
    const __VLS_20 = __VLS_19({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_21.slots.default;
    var __VLS_21;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.setDensity('comfortable');
        } },
    type: "button",
    ...{ class: "block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted" },
    ...{ class: (__VLS_ctx.density === 'comfortable' ? 'bg-muted' : '') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.setDensity('compact');
        } },
    type: "button",
    ...{ class: "block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted" },
    ...{ class: (__VLS_ctx.density === 'compact' ? 'bg-muted' : '') },
});
var __VLS_18;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('click:export');
    }
};
__VLS_24.slots.default;
var __VLS_24;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-hidden rounded-lg border bg-card" },
});
/** @type {[typeof Table, typeof Table, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(Table, new Table({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
/** @type {[typeof TableHeader, typeof TableHeader, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(TableHeader, new TableHeader({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
/** @type {[typeof TableRow, typeof TableRow, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.visibleColumns))) {
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        key: (col.key),
    }));
    const __VLS_39 = __VLS_38({
        key: (col.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    (col.label);
    var __VLS_40;
}
if (__VLS_ctx.hasActionsSlot) {
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        ...{ class: "w-[88px] text-right" },
    }));
    const __VLS_42 = __VLS_41({
        ...{ class: "w-[88px] text-right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
}
var __VLS_37;
var __VLS_34;
/** @type {[typeof TableBody, typeof TableBody, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(TableBody, new TableBody({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
if (__VLS_ctx.loading) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_49.slots.default;
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        colspan: (__VLS_ctx.visibleColumns.length + (__VLS_ctx.hasActionsSlot ? 1 : 0)),
    }));
    const __VLS_51 = __VLS_50({
        colspan: (__VLS_ctx.visibleColumns.length + (__VLS_ctx.hasActionsSlot ? 1 : 0)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-8 text-center text-sm text-muted-foreground" },
    });
    var __VLS_52;
    var __VLS_49;
}
else if (__VLS_ctx.paginatedRows.length === 0) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        colspan: (__VLS_ctx.visibleColumns.length + (__VLS_ctx.hasActionsSlot ? 1 : 0)),
    }));
    const __VLS_57 = __VLS_56({
        colspan: (__VLS_ctx.visibleColumns.length + (__VLS_ctx.hasActionsSlot ? 1 : 0)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_58.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-8 text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.emptyTitleText);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    (__VLS_ctx.emptyDescText);
    var __VLS_58;
    var __VLS_55;
}
else {
    for (const [row] of __VLS_getVForSourceType((__VLS_ctx.paginatedRows))) {
        /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(TableRow, new TableRow({
            ...{ 'onClick': {} },
            key: (__VLS_ctx.rowKey(row)),
            ...{ class: "cursor-pointer" },
        }));
        const __VLS_60 = __VLS_59({
            ...{ 'onClick': {} },
            key: (__VLS_ctx.rowKey(row)),
            ...{ class: "cursor-pointer" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        let __VLS_62;
        let __VLS_63;
        let __VLS_64;
        const __VLS_65 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.paginatedRows.length === 0))
                    return;
                __VLS_ctx.$emit('row:click', row);
            }
        };
        __VLS_61.slots.default;
        for (const [col] of __VLS_getVForSourceType((__VLS_ctx.visibleColumns))) {
            /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent(TableCell, new TableCell({
                key: (`${__VLS_ctx.rowKey(row)}-${col.key}`),
                ...{ class: (__VLS_ctx.densityClass) },
            }));
            const __VLS_67 = __VLS_66({
                key: (`${__VLS_ctx.rowKey(row)}-${col.key}`),
                ...{ class: (__VLS_ctx.densityClass) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            __VLS_68.slots.default;
            (row[col.key] ?? '-');
            var __VLS_68;
        }
        if (__VLS_ctx.hasActionsSlot) {
            /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(TableCell, new TableCell({
                ...{ class: "text-right" },
                ...{ class: (__VLS_ctx.densityClass) },
            }));
            const __VLS_70 = __VLS_69({
                ...{ class: "text-right" },
                ...{ class: (__VLS_ctx.densityClass) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            __VLS_71.slots.default;
            var __VLS_72 = {
                row: (row),
            };
            var __VLS_71;
        }
        var __VLS_61;
    }
}
var __VLS_46;
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    modelValue: (String(__VLS_ctx.rowsPerPage)),
}));
const __VLS_75 = __VLS_74({
    ...{ 'onChange': {} },
    modelValue: (String(__VLS_ctx.rowsPerPage)),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_77;
let __VLS_78;
let __VLS_79;
const __VLS_80 = {
    onChange: (__VLS_ctx.setRowsPerPage)
};
__VLS_76.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "5",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "10",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "20",
});
var __VLS_76;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.currentPage <= 1),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.currentPage <= 1),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setPage(__VLS_ctx.currentPage - 1);
    }
};
__VLS_83.slots.default;
var __VLS_83;
for (const [page] of __VLS_getVForSourceType((__VLS_ctx.totalPages))) {
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        key: (page),
        variant: (page === __VLS_ctx.currentPage ? 'default' : 'outline'),
        ...{ class: "min-w-10" },
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        key: (page),
        variant: (page === __VLS_ctx.currentPage ? 'default' : 'outline'),
        ...{ class: "min-w-10" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_91;
    let __VLS_92;
    let __VLS_93;
    const __VLS_94 = {
        onClick: (...[$event]) => {
            __VLS_ctx.setPage(page);
        }
    };
    __VLS_90.slots.default;
    (page);
    var __VLS_90;
}
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.currentPage >= __VLS_ctx.totalPages),
}));
const __VLS_96 = __VLS_95({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.currentPage >= __VLS_ctx.totalPages),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_98;
let __VLS_99;
let __VLS_100;
const __VLS_101 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setPage(__VLS_ctx.currentPage + 1);
    }
};
__VLS_97.slots.default;
var __VLS_97;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[88px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-10']} */ ;
// @ts-ignore
var __VLS_73 = __VLS_72;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Button: Button,
            DropdownMenu: DropdownMenu,
            Input: Input,
            Select: Select,
            Table: Table,
            TableBody: TableBody,
            TableCell: TableCell,
            TableHead: TableHead,
            TableHeader: TableHeader,
            TableRow: TableRow,
            hasActionsSlot: hasActionsSlot,
            localSearch: localSearch,
            density: density,
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
            visibleColumns: visibleColumns,
            totalPages: totalPages,
            paginatedRows: paginatedRows,
            densityClass: densityClass,
            emptyTitleText: emptyTitleText,
            emptyDescText: emptyDescText,
            rowKey: rowKey,
            isColumnVisible: isColumnVisible,
            toggleColumn: toggleColumn,
            setDensity: setDensity,
            setRowsPerPage: setRowsPerPage,
            setPage: setPage,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
