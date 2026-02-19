import { computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
const __VLS_emit = defineEmits();
const props = defineProps();
const buttonClass = computed(() => (props.density === 'compact' ? '!px-2 !py-1 !text-xs' : ''));
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
        variant: "outline",
        ...{ class: (__VLS_ctx.buttonClass) },
    }));
    const __VLS_5 = __VLS_4({
        variant: "outline",
        ...{ class: (__VLS_ctx.buttonClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    __VLS_6.slots.default;
    const __VLS_7 = {}.ChevronDown;
    /** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_6;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1" },
});
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        key: (column.key),
        ...{ class: "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted" },
    });
    /** @type {[typeof Checkbox, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
        ...{ 'onUpdate:checked': {} },
        checked: (column.visible),
        disabled: (column.hideable === false),
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onUpdate:checked': {} },
        checked: (column.visible),
        disabled: (column.hideable === false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        'onUpdate:checked': (...[$event]) => {
            __VLS_ctx.$emit('toggle', column.key);
        }
    };
    var __VLS_13;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (column.hideable === false ? 'text-muted-foreground' : '') },
    });
    (column.label);
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronDown: ChevronDown,
            Button: Button,
            Checkbox: Checkbox,
            DropdownMenu: DropdownMenu,
            buttonClass: buttonClass,
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
