import { reactiveOmit } from "@vueuse/core";
import { SelectSeparator } from "reka-ui";
import { cn } from "@/lib/utils";
const props = defineProps();
const delegatedProps = reactiveOmit(props, "class");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.SelectSeparator;
/** @type {[typeof __VLS_components.SelectSeparator, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('-mx-1 my-1 h-px bg-muted', props.class)) },
}));
const __VLS_2 = __VLS_1({
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('-mx-1 my-1 h-px bg-muted', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SelectSeparator: SelectSeparator,
            cn: cn,
            delegatedProps: delegatedProps,
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
