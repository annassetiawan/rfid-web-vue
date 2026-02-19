import { computed } from 'vue';
import { ChevronDown, MoreHorizontal, PackageX, Search } from 'lucide-vue-next';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Table from '@/components/ui/Table.vue';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';
import InventoryColumnsMenu from './InventoryColumnsMenu.vue';
import InventoryFiltersSheet from './InventoryFiltersSheet.vue';
const props = defineProps();
const emit = defineEmits();
const compactButtonClass = computed(() => (props.density === 'compact' ? '!px-2 !py-1 !text-xs' : ''));
const compactSelectClass = computed(() => (props.density === 'compact' ? '!h-8 !text-xs' : 'w-[140px]'));
const rowClass = computed(() => (props.density === 'compact' ? 'py-2 text-xs' : 'py-3 text-sm'));
const badgeScaleClass = computed(() => (props.density === 'compact' ? 'inline-flex scale-95 origin-left' : 'inline-flex'));
const columnMenuItems = computed(() => props.columns
    .filter((column) => column.hideable !== false)
    .map((column) => ({
    key: column.key,
    label: column.label,
    hideable: column.hideable,
    visible: props.visibleColumns[column.key],
})));
const startRow = computed(() => (props.filteredCount === 0 ? 0 : (props.page - 1) * props.pageSize + 1));
const endRow = computed(() => Math.min(props.page * props.pageSize, props.filteredCount));
const onSearchInput = (event) => {
    const target = event.target;
    emit('search', target.value);
};
const onDensityChange = (event) => {
    const target = event.target;
    const value = target.value;
    emit('setDensity', value);
};
const onPageSizeChange = (event) => {
    const target = event.target;
    emit('setPageSize', Number(target.value));
};
const isVisible = (key) => props.visibleColumns[key];
const inventoryStatusVariant = (status) => {
    if (status === 'In Stock')
        return 'default';
    if (status === 'In Transit')
        return 'secondary';
    if (status === 'Reserved')
        return 'outline';
    return 'destructive';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Card, new Card({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: (__VLS_ctx.density === 'compact' ? '!p-4' : '') },
}));
const __VLS_4 = __VLS_3({
    ...{ class: (__VLS_ctx.density === 'compact' ? '!p-4' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap items-center justify-between gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative w-full max-w-md" },
});
const __VLS_6 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.searchQuery),
    type: "search",
    placeholder: "Search name, serial number, RFID code...",
    ...{ class: "pl-9" },
}));
const __VLS_11 = __VLS_10({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.searchQuery),
    type: "search",
    placeholder: "Search name, serial number, RFID code...",
    ...{ class: "pl-9" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onInput: (__VLS_ctx.onSearchInput)
};
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap items-center gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('update:filtersOpen', true);
    }
};
__VLS_19.slots.default;
var __VLS_19;
/** @type {[typeof InventoryColumnsMenu, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(InventoryColumnsMenu, new InventoryColumnsMenu({
    ...{ 'onToggle': {} },
    columns: (__VLS_ctx.columnMenuItems),
    density: (__VLS_ctx.density),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onToggle': {} },
    columns: (__VLS_ctx.columnMenuItems),
    density: (__VLS_ctx.density),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onToggle: (...[$event]) => {
        __VLS_ctx.$emit('toggleColumn', $event);
    }
};
var __VLS_26;
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.density),
    ...{ class: (__VLS_ctx.compactSelectClass) },
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.density),
    ...{ class: (__VLS_ctx.compactSelectClass) },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onChange: (__VLS_ctx.onDensityChange)
};
__VLS_33.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "comfortable",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "compact",
});
var __VLS_33;
/** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_40.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }));
    const __VLS_42 = __VLS_41({
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ChevronDown;
    /** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_43;
}
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "w-full justify-start" },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "w-full justify-start" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('exportCsv');
    }
};
__VLS_50.slots.default;
var __VLS_50;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "w-full justify-start" },
}));
const __VLS_56 = __VLS_55({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "w-full justify-start" },
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_58;
let __VLS_59;
let __VLS_60;
const __VLS_61 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('exportExcel');
    }
};
__VLS_57.slots.default;
var __VLS_57;
var __VLS_40;
var __VLS_5;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: (__VLS_ctx.density === 'compact' ? '!p-4 !pt-0' : '') },
}));
const __VLS_63 = __VLS_62({
    ...{ class: (__VLS_ctx.density === 'compact' ? '!p-4 !pt-0' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
/** @type {[typeof Table, typeof Table, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(Table, new Table({
    ...{ class: "max-h-[460px] overflow-auto rounded-lg border [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-card" },
}));
const __VLS_66 = __VLS_65({
    ...{ class: "max-h-[460px] overflow-auto rounded-lg border [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
/** @type {[typeof TableHeader, typeof TableHeader, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(TableHeader, new TableHeader({}));
const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
/** @type {[typeof TableRow, typeof TableRow, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.activeColumns))) {
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        key: (column.key),
    }));
    const __VLS_75 = __VLS_74({
        key: (column.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_76.slots.default;
    (column.label);
    var __VLS_76;
}
var __VLS_73;
var __VLS_70;
/** @type {[typeof TableBody, typeof TableBody, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(TableBody, new TableBody({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
if (__VLS_ctx.rows.length === 0) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
    __VLS_82.slots.default;
    /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(TableCell, new TableCell({
        colspan: (__VLS_ctx.activeColumns.length),
    }));
    const __VLS_84 = __VLS_83({
        colspan: (__VLS_ctx.activeColumns.length),
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    __VLS_85.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center justify-center gap-2 py-10 text-center" },
    });
    const __VLS_86 = {}.PackageX;
    /** @type {[typeof __VLS_components.PackageX, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        ...{ class: "h-8 w-8 text-muted-foreground" },
    }));
    const __VLS_88 = __VLS_87({
        ...{ class: "h-8 w-8 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    var __VLS_85;
    var __VLS_82;
}
for (const [row] of __VLS_getVForSourceType((__VLS_ctx.rows))) {
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(TableRow, new TableRow({
        key: (row.id),
        ...{ class: "hover:bg-muted/40" },
    }));
    const __VLS_91 = __VLS_90({
        key: (row.id),
        ...{ class: "hover:bg-muted/40" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    __VLS_92.slots.default;
    if (__VLS_ctx.isVisible('name')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
        __VLS_95.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        (row.name);
        var __VLS_95;
    }
    if (__VLS_ctx.isVisible('serialNumber')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_96 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_97 = __VLS_96({}, ...__VLS_functionalComponentArgsRest(__VLS_96));
        __VLS_98.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        (row.serialNumber);
        var __VLS_98;
    }
    if (__VLS_ctx.isVisible('rfidCode')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
        __VLS_101.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        (row.rfidCode);
        var __VLS_101;
    }
    if (__VLS_ctx.isVisible('inventoryStatus')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
        __VLS_104.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.badgeScaleClass) },
        });
        /** @type {[typeof Badge, typeof Badge, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(Badge, new Badge({
            variant: (__VLS_ctx.inventoryStatusVariant(row.inventoryStatus)),
        }));
        const __VLS_106 = __VLS_105({
            variant: (__VLS_ctx.inventoryStatusVariant(row.inventoryStatus)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        (row.inventoryStatus);
        var __VLS_107;
        var __VLS_104;
    }
    if (__VLS_ctx.isVisible('location')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
        __VLS_110.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        (row.location);
        var __VLS_110;
    }
    if (__VLS_ctx.isVisible('taggedDate')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
        __VLS_113.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        (row.taggedDate);
        var __VLS_113;
    }
    if (__VLS_ctx.isVisible('status')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_115 = __VLS_114({}, ...__VLS_functionalComponentArgsRest(__VLS_114));
        __VLS_116.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: (__VLS_ctx.rowClass) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.badgeScaleClass) },
        });
        /** @type {[typeof Badge, typeof Badge, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(Badge, new Badge({
            variant: (row.status === 'active' ? 'default' : 'secondary'),
        }));
        const __VLS_118 = __VLS_117({
            variant: (row.status === 'active' ? 'default' : 'secondary'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        (row.status);
        var __VLS_119;
        var __VLS_116;
    }
    if (__VLS_ctx.isVisible('actions')) {
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
        __VLS_122.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-end" },
        });
        /** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
        const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
        __VLS_125.slots.default;
        {
            const { trigger: __VLS_thisSlot } = __VLS_125.slots;
            /** @type {[typeof Button, typeof Button, ]} */ ;
            // @ts-ignore
            const __VLS_126 = __VLS_asFunctionalComponent(Button, new Button({
                variant: "ghost",
                ...{ class: (__VLS_ctx.compactButtonClass) },
            }));
            const __VLS_127 = __VLS_126({
                variant: "ghost",
                ...{ class: (__VLS_ctx.compactButtonClass) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_126));
            __VLS_128.slots.default;
            const __VLS_129 = {}.MoreHorizontal;
            /** @type {[typeof __VLS_components.MoreHorizontal, ]} */ ;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
                ...{ class: "h-4 w-4" },
            }));
            const __VLS_131 = __VLS_130({
                ...{ class: "h-4 w-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            var __VLS_128;
        }
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }));
        const __VLS_134 = __VLS_133({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        let __VLS_136;
        let __VLS_137;
        let __VLS_138;
        const __VLS_139 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isVisible('actions')))
                    return;
                __VLS_ctx.$emit('view', row);
            }
        };
        __VLS_135.slots.default;
        var __VLS_135;
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }));
        const __VLS_141 = __VLS_140({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        let __VLS_143;
        let __VLS_144;
        let __VLS_145;
        const __VLS_146 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isVisible('actions')))
                    return;
                __VLS_ctx.$emit('edit', row);
            }
        };
        __VLS_142.slots.default;
        var __VLS_142;
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_147 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }));
        const __VLS_148 = __VLS_147({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "sm",
            ...{ class: "w-full justify-start" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_147));
        let __VLS_150;
        let __VLS_151;
        let __VLS_152;
        const __VLS_153 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isVisible('actions')))
                    return;
                __VLS_ctx.$emit('archive', row);
            }
        };
        __VLS_149.slots.default;
        var __VLS_149;
        var __VLS_125;
        var __VLS_122;
    }
    var __VLS_92;
}
var __VLS_79;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (String(__VLS_ctx.pageSize)),
    ...{ class: "w-[88px]" },
}));
const __VLS_155 = __VLS_154({
    ...{ 'onChange': {} },
    value: (String(__VLS_ctx.pageSize)),
    ...{ class: "w-[88px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_157;
let __VLS_158;
let __VLS_159;
const __VLS_160 = {
    onChange: (__VLS_ctx.onPageSizeChange)
};
__VLS_156.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "10",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "20",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "50",
});
var __VLS_156;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.startRow);
(__VLS_ctx.endRow);
(__VLS_ctx.filteredCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
    disabled: (__VLS_ctx.page <= 1),
}));
const __VLS_162 = __VLS_161({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
    disabled: (__VLS_ctx.page <= 1),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('setPage', __VLS_ctx.page - 1);
    }
};
__VLS_163.slots.default;
var __VLS_163;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
    disabled: (__VLS_ctx.page >= __VLS_ctx.totalPages),
}));
const __VLS_169 = __VLS_168({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: (__VLS_ctx.compactButtonClass) },
    disabled: (__VLS_ctx.page >= __VLS_ctx.totalPages),
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
let __VLS_171;
let __VLS_172;
let __VLS_173;
const __VLS_174 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('setPage', __VLS_ctx.page + 1);
    }
};
__VLS_170.slots.default;
var __VLS_170;
var __VLS_64;
var __VLS_2;
/** @type {[typeof InventoryFiltersSheet, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(InventoryFiltersSheet, new InventoryFiltersSheet({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onApply': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    filters: (__VLS_ctx.filters),
    options: (__VLS_ctx.filterOptions),
}));
const __VLS_176 = __VLS_175({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onApply': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filtersOpen),
    filters: (__VLS_ctx.filters),
    options: (__VLS_ctx.filterOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
let __VLS_178;
let __VLS_179;
let __VLS_180;
const __VLS_181 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:filtersOpen', $event);
    }
};
const __VLS_182 = {
    onApply: (...[$event]) => {
        __VLS_ctx.$emit('applyFilters', $event);
    }
};
const __VLS_183 = {
    onClear: (...[$event]) => {
        __VLS_ctx.$emit('clearFilters');
    }
};
var __VLS_177;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-9']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[460px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_thead_th]:sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_thead_th]:top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_thead_th]:z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_thead_th]:bg-card']} */ ;
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
/** @type {__VLS_StyleScopedClasses['hover:bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[88px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronDown: ChevronDown,
            MoreHorizontal: MoreHorizontal,
            PackageX: PackageX,
            Search: Search,
            Badge: Badge,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            DropdownMenu: DropdownMenu,
            Input: Input,
            Select: Select,
            Table: Table,
            TableBody: TableBody,
            TableCell: TableCell,
            TableHead: TableHead,
            TableHeader: TableHeader,
            TableRow: TableRow,
            InventoryColumnsMenu: InventoryColumnsMenu,
            InventoryFiltersSheet: InventoryFiltersSheet,
            compactButtonClass: compactButtonClass,
            compactSelectClass: compactSelectClass,
            rowClass: rowClass,
            badgeScaleClass: badgeScaleClass,
            columnMenuItems: columnMenuItems,
            startRow: startRow,
            endRow: endRow,
            onSearchInput: onSearchInput,
            onDensityChange: onDensityChange,
            onPageSizeChange: onPageSizeChange,
            isVisible: isVisible,
            inventoryStatusVariant: inventoryStatusVariant,
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
