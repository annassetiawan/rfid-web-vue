import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger, } from 'reka-ui';
import { MoreHorizontal } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.DropdownMenuRoot;
/** @type {[typeof __VLS_components.DropdownMenuRoot, typeof __VLS_components.DropdownMenuRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.DropdownMenuTrigger;
/** @type {[typeof __VLS_components.DropdownMenuTrigger, typeof __VLS_components.DropdownMenuTrigger, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    asChild: true,
}));
const __VLS_7 = __VLS_6({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(Button, new Button({
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
}));
const __VLS_10 = __VLS_9({
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.MoreHorizontal;
/** @type {[typeof __VLS_components.MoreHorizontal, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "h-4 w-4" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_11;
var __VLS_8;
const __VLS_16 = {}.DropdownMenuPortal;
/** @type {[typeof __VLS_components.DropdownMenuPortal, typeof __VLS_components.DropdownMenuPortal, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.DropdownMenuContent;
/** @type {[typeof __VLS_components.DropdownMenuContent, typeof __VLS_components.DropdownMenuContent, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    side: "bottom",
    align: "end",
    sideOffset: (6),
    ...{ class: "z-[120] min-w-[10rem] rounded-lg border bg-popover p-1 text-popover-foreground shadow-md" },
}));
const __VLS_22 = __VLS_21({
    side: "bottom",
    align: "end",
    sideOffset: (6),
    ...{ class: "z-[120] min-w-[10rem] rounded-lg border bg-popover p-1 text-popover-foreground shadow-md" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
for (const [action] of __VLS_getVForSourceType((__VLS_ctx.actions))) {
    const __VLS_24 = {}.DropdownMenuItem;
    /** @type {[typeof __VLS_components.DropdownMenuItem, typeof __VLS_components.DropdownMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onSelect': {} },
        key: (action.key),
        ...{ class: "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground" },
        ...{ class: (action.destructive ? 'text-destructive data-[highlighted]:text-destructive' : '') },
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onSelect': {} },
        key: (action.key),
        ...{ class: "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground" },
        ...{ class: (action.destructive ? 'text-destructive data-[highlighted]:text-destructive' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onSelect: (...[$event]) => {
            __VLS_ctx.$emit('select', action.key);
        }
    };
    __VLS_27.slots.default;
    (action.label);
    var __VLS_27;
}
var __VLS_23;
var __VLS_19;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[120]']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[10rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-popover']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-popover-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[highlighted]:bg-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[highlighted]:text-accent-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DropdownMenuContent: DropdownMenuContent,
            DropdownMenuItem: DropdownMenuItem,
            DropdownMenuPortal: DropdownMenuPortal,
            DropdownMenuRoot: DropdownMenuRoot,
            DropdownMenuTrigger: DropdownMenuTrigger,
            MoreHorizontal: MoreHorizontal,
            Button: Button,
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
