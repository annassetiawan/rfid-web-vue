import { reactiveOmit } from "@vueuse/core";
import { StepperIndicator, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
const props = defineProps();
const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.StepperIndicator;
/** @type {[typeof __VLS_components.StepperIndicator, typeof __VLS_components.StepperIndicator, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('inline-flex items-center justify-center rounded-full text-muted-foreground/50 w-8 h-8', 
        // Disabled
        'group-data-[disabled]:text-muted-foreground group-data-[disabled]:opacity-50', 
        // Active
        'group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground', 
        // Completed
        'group-data-[state=completed]:bg-accent group-data-[state=completed]:text-accent-foreground', props.class)) },
}));
const __VLS_2 = __VLS_1({
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('inline-flex items-center justify-center rounded-full text-muted-foreground/50 w-8 h-8', 
        // Disabled
        'group-data-[disabled]:text-muted-foreground group-data-[disabled]:opacity-50', 
        // Active
        'group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground', 
        // Completed
        'group-data-[state=completed]:bg-accent group-data-[state=completed]:text-accent-foreground', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
{
    const { default: __VLS_thisSlot } = __VLS_3.slots;
    const [slotProps] = __VLS_getSlotParams(__VLS_thisSlot);
    var __VLS_5 = {
        ...(slotProps),
    };
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StepperIndicator: StepperIndicator,
            cn: cn,
            forwarded: forwarded,
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
