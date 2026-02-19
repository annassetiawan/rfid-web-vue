import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Select from '@/components/ui/Select.vue';
const props = defineProps();
const totalPages = computed(() => props.table.getPageCount());
const pageLabel = computed(() => props.table.getState().pagination.pageIndex + 1);
const onPageSizeChange = (event) => {
    const target = event.target;
    props.table.setPageSize(Number(target.value));
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between px-4 py-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "whitespace-nowrap" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (String(__VLS_ctx.table.getState().pagination.pageSize)),
    ...{ class: "h-8 w-[72px]" },
}));
const __VLS_1 = __VLS_0({
    ...{ 'onChange': {} },
    value: (String(__VLS_ctx.table.getState().pagination.pageSize)),
    ...{ class: "h-8 w-[72px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onChange: (__VLS_ctx.onPageSizeChange)
};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "10",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "20",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "50",
});
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-muted-foreground" },
});
/** @type {[typeof Badge, typeof Badge, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(Badge, new Badge({
    variant: "outline",
}));
const __VLS_8 = __VLS_7({
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
(__VLS_ctx.pageLabel);
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-muted-foreground" },
});
(__VLS_ctx.totalPages);
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanPreviousPage()),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanPreviousPage()),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onClick: (...[$event]) => {
        __VLS_ctx.table.setPageIndex(0);
    }
};
__VLS_12.slots.default;
const __VLS_17 = {}.ChevronsLeft;
/** @type {[typeof __VLS_components.ChevronsLeft, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "h-4 w-4" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_12;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanPreviousPage()),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanPreviousPage()),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.table.previousPage();
    }
};
__VLS_23.slots.default;
const __VLS_28 = {}.ChevronLeft;
/** @type {[typeof __VLS_components.ChevronLeft, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "h-4 w-4" },
}));
const __VLS_30 = __VLS_29({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_23;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanNextPage()),
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanNextPage()),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_35;
let __VLS_36;
let __VLS_37;
const __VLS_38 = {
    onClick: (...[$event]) => {
        __VLS_ctx.table.nextPage();
    }
};
__VLS_34.slots.default;
const __VLS_39 = {}.ChevronRight;
/** @type {[typeof __VLS_components.ChevronRight, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ class: "h-4 w-4" },
}));
const __VLS_41 = __VLS_40({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
var __VLS_34;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanNextPage()),
}));
const __VLS_44 = __VLS_43({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (!__VLS_ctx.table.getCanNextPage()),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_46;
let __VLS_47;
let __VLS_48;
const __VLS_49 = {
    onClick: (...[$event]) => {
        __VLS_ctx.table.setPageIndex(__VLS_ctx.totalPages - 1);
    }
};
__VLS_45.slots.default;
const __VLS_50 = {}.ChevronsRight;
/** @type {[typeof __VLS_components.ChevronsRight, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    ...{ class: "h-4 w-4" },
}));
const __VLS_52 = __VLS_51({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
var __VLS_45;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[72px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronLeft: ChevronLeft,
            ChevronRight: ChevronRight,
            ChevronsLeft: ChevronsLeft,
            ChevronsRight: ChevronsRight,
            Badge: Badge,
            Button: Button,
            Select: Select,
            totalPages: totalPages,
            pageLabel: pageLabel,
            onPageSizeChange: onPageSizeChange,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
