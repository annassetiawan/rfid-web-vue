import { reactiveOmit } from "@vueuse/core";
import { StepperSeparator, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
const props = defineProps();
const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.StepperSeparator;
/** @type {[typeof __VLS_components.StepperSeparator, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('bg-muted', 
        // Disabled
        'group-data-[disabled]:bg-muted group-data-[disabled]:opacity-50', 
        // Completed
        'group-data-[state=completed]:bg-accent-foreground', props.class)) },
}));
const __VLS_2 = __VLS_1({
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('bg-muted', 
        // Disabled
        'group-data-[disabled]:bg-muted group-data-[disabled]:opacity-50', 
        // Completed
        'group-data-[state=completed]:bg-accent-foreground', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StepperSeparator: StepperSeparator,
            cn: cn,
            forwarded: forwarded,
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
