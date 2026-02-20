import { reactiveOmit } from "@vueuse/core";
import { SelectGroup } from "reka-ui";
import { cn } from "@/lib/utils";
const props = defineProps();
const delegatedProps = reactiveOmit(props, "class");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.SelectGroup;
/** @type {[typeof __VLS_components.SelectGroup, typeof __VLS_components.SelectGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: (__VLS_ctx.cn('p-1 w-full', props.class)) },
    ...(__VLS_ctx.delegatedProps),
}));
const __VLS_2 = __VLS_1({
    ...{ class: (__VLS_ctx.cn('p-1 w-full', props.class)) },
    ...(__VLS_ctx.delegatedProps),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
var __VLS_5 = {};
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SelectGroup: SelectGroup,
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
