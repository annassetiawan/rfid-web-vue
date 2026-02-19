import { reactiveOmit } from "@vueuse/core";
import { ChevronDown } from "lucide-vue-next";
import { AccordionHeader, AccordionTrigger, } from "reka-ui";
import { cn } from "@/lib/utils";
const props = defineProps();
const delegatedProps = reactiveOmit(props, "class");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.AccordionHeader;
/** @type {[typeof __VLS_components.AccordionHeader, typeof __VLS_components.AccordionHeader, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "flex" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "flex" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.AccordionTrigger;
/** @type {[typeof __VLS_components.AccordionTrigger, typeof __VLS_components.AccordionTrigger, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180', props.class)) },
}));
const __VLS_7 = __VLS_6({
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
var __VLS_9 = {};
var __VLS_11 = {};
const __VLS_13 = {}.ChevronDown;
/** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
// @ts-ignore
var __VLS_10 = __VLS_9, __VLS_12 = __VLS_11;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronDown: ChevronDown,
            AccordionHeader: AccordionHeader,
            AccordionTrigger: AccordionTrigger,
            cn: cn,
            delegatedProps: delegatedProps,
        };
    },
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
