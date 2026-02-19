import { MoreHorizontal } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_2.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(Button, new Button({
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8" },
    }));
    const __VLS_5 = __VLS_4({
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    __VLS_6.slots.default;
    const __VLS_7 = {}.MoreHorizontal;
    /** @type {[typeof __VLS_components.MoreHorizontal, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_6;
}
for (const [action] of __VLS_getVForSourceType((__VLS_ctx.actions))) {
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        key: (action.key),
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
        ...{ class: (action.destructive ? 'text-destructive hover:text-destructive' : '') },
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClick': {} },
        key: (action.key),
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
        ...{ class: (action.destructive ? 'text-destructive hover:text-destructive' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('select', action.key);
        }
    };
    __VLS_13.slots.default;
    (action.label);
    var __VLS_13;
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MoreHorizontal: MoreHorizontal,
            Button: Button,
            DropdownMenu: DropdownMenu,
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
