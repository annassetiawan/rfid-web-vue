import { computed, inject } from 'vue';
import Button from '@/components/ui/Button.vue';
import { tabsInjectionKey } from '@/components/ui/tabs';
const props = defineProps();
const context = inject(tabsInjectionKey);
if (!context) {
    throw new Error('TabsTrigger must be used inside Tabs');
}
const isActive = computed(() => context.value.value === props.value);
const setValue = (next) => {
    context.setValue(next);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "h-7 rounded-md px-3 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm" },
    dataState: (__VLS_ctx.isActive ? 'active' : 'inactive'),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "sm",
    ...{ class: "h-7 rounded-md px-3 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm" },
    dataState: (__VLS_ctx.isActive ? 'active' : 'inactive'),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setValue(__VLS_ctx.value);
    }
};
var __VLS_7 = {};
__VLS_2.slots.default;
var __VLS_8 = {};
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=active]:bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=active]:text-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=active]:shadow-sm']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Button: Button,
            isActive: isActive,
            setValue: setValue,
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
