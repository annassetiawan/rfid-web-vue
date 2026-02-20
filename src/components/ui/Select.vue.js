import { computed, useAttrs, useSlots } from 'vue';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
defineOptions({ inheritAttrs: false });
const EMPTY_VALUE = '__select-empty-value__';
const props = defineProps();
const emit = defineEmits();
const attrs = useAttrs();
const slots = useSlots();
const stringifyValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value);
};
const stringifyAcceptableValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object') {
        return '';
    }
    return String(value);
};
const toInternalValue = (value) => {
    if (value === '') {
        return EMPTY_VALUE;
    }
    return value;
};
const toExternalValue = (value) => {
    if (value === EMPTY_VALUE) {
        return '';
    }
    return value;
};
const extractText = (node) => {
    if (typeof node.children === 'string') {
        return node.children;
    }
    if (!Array.isArray(node.children)) {
        return '';
    }
    return node.children
        .map((child) => {
        if (typeof child === 'string') {
            return child;
        }
        if (typeof child === 'object' && child !== null) {
            return extractText(child);
        }
        return '';
    })
        .join('');
};
const readOptions = (nodes) => {
    if (!nodes?.length) {
        return [];
    }
    const options = [];
    const walk = (items) => {
        for (const item of items) {
            if (typeof item.type === 'string' && item.type.toLowerCase() === 'option') {
                const propsMap = (item.props ?? {});
                const value = stringifyValue(propsMap.value ?? extractText(item));
                options.push({
                    key: `${value}-${options.length}`,
                    label: extractText(item).trim() || value,
                    value,
                    internalValue: toInternalValue(value),
                    disabled: Boolean(propsMap.disabled),
                });
                continue;
            }
            if (Array.isArray(item.children)) {
                walk(item.children);
            }
        }
    };
    walk(nodes);
    return options;
};
const normalizedOptions = computed(() => readOptions(slots.default?.()));
const resolvedValue = computed(() => stringifyValue(props.modelValue ?? props.value ?? ''));
const internalValue = computed(() => toInternalValue(resolvedValue.value));
const selectedOption = computed(() => normalizedOptions.value.find((option) => option.value === resolvedValue.value));
const resolvedPlaceholder = computed(() => props.placeholder ?? selectedOption.value?.label ?? 'Select option');
const triggerClass = computed(() => {
    const attrClass = attrs.class;
    return ['w-full', attrClass];
});
const onValueChange = (nextValue) => {
    const value = toExternalValue(stringifyAcceptableValue(nextValue));
    emit('update:modelValue', value);
    emit('change', { target: { value } });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ShadSelect;
/** @type {[typeof __VLS_components.ShadSelect, typeof __VLS_components.ShadSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.internalValue),
    disabled: (__VLS_ctx.disabled),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.internalValue),
    disabled: (__VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:modelValue': (__VLS_ctx.onValueChange)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.SelectTrigger;
/** @type {[typeof __VLS_components.SelectTrigger, typeof __VLS_components.SelectTrigger, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: (__VLS_ctx.triggerClass) },
}));
const __VLS_11 = __VLS_10({
    ...{ class: (__VLS_ctx.triggerClass) },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.SelectValue;
/** @type {[typeof __VLS_components.SelectValue, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    placeholder: (__VLS_ctx.resolvedPlaceholder),
}));
const __VLS_15 = __VLS_14({
    placeholder: (__VLS_ctx.resolvedPlaceholder),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
const __VLS_17 = {}.SelectContent;
/** @type {[typeof __VLS_components.SelectContent, typeof __VLS_components.SelectContent, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "rounded-lg" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
for (const [option] of __VLS_getVForSourceType((__VLS_ctx.normalizedOptions))) {
    const __VLS_21 = {}.SelectItem;
    /** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        key: (option.key),
        value: (option.internalValue),
        disabled: (option.disabled),
    }));
    const __VLS_23 = __VLS_22({
        key: (option.key),
        value: (option.internalValue),
        disabled: (option.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    (option.label);
    var __VLS_24;
}
var __VLS_20;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ShadSelect: ShadSelect,
            SelectContent: SelectContent,
            SelectItem: SelectItem,
            SelectTrigger: SelectTrigger,
            SelectValue: SelectValue,
            normalizedOptions: normalizedOptions,
            internalValue: internalValue,
            resolvedPlaceholder: resolvedPlaceholder,
            triggerClass: triggerClass,
            onValueChange: onValueChange,
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
