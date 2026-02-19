import { reactive, watch } from 'vue';
import FilterSheet from '@/components/list/FilterSheet.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
const props = defineProps();
const emit = defineEmits();
const draft = reactive({
    inventoryStatus: '',
    location: '',
    condition: '',
    stagingStatus: '',
    warehouseLocation: '',
    dateFrom: '',
    dateTo: '',
});
watch(() => props.modelValue, (open) => {
    if (open) {
        Object.assign(draft, props.filters);
    }
});
watch(() => props.filters, (next) => {
    if (!props.modelValue) {
        Object.assign(draft, next);
    }
}, { deep: true });
const onClear = () => {
    Object.assign(draft, {
        inventoryStatus: '',
        location: '',
        condition: '',
        stagingStatus: '',
        warehouseLocation: '',
        dateFrom: '',
        dateTo: '',
    });
    emit('clear');
    emit('update:modelValue', false);
};
const onApply = () => {
    emit('apply', { ...draft });
    emit('update:modelValue', false);
};
const onSelectChange = (key, event) => {
    const target = event.target;
    draft[key] = target.value;
};
const onInputChange = (key, event) => {
    const target = event.target;
    draft[key] = target.value;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof FilterSheet, typeof FilterSheet, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FilterSheet, new FilterSheet({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.modelValue),
    title: "Filters",
    description: "Refine inventory rows with targeted criteria.",
    resetLabel: "Clear filters",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onApply': {} },
    ...{ 'onReset': {} },
    modelValue: (__VLS_ctx.modelValue),
    title: "Filters",
    description: "Refine inventory rows with targeted criteria.",
    resetLabel: "Clear filters",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:modelValue', $event);
    }
};
const __VLS_7 = {
    onApply: (__VLS_ctx.onApply)
};
const __VLS_8 = {
    onReset: (__VLS_ctx.onClear)
};
var __VLS_9 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.inventoryStatus),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.inventoryStatus),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('inventoryStatus', $event);
    }
};
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [status] of __VLS_getVForSourceType((__VLS_ctx.options.inventoryStatus))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (status),
        value: (status),
    });
    (status);
}
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.location),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.location),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('location', $event);
    }
};
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [location] of __VLS_getVForSourceType((__VLS_ctx.options.location))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (location),
        value: (location),
    });
    (location);
}
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.condition),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.condition),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('condition', $event);
    }
};
__VLS_26.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [condition] of __VLS_getVForSourceType((__VLS_ctx.options.condition))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (condition),
        value: (condition),
    });
    (condition);
}
var __VLS_26;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.stagingStatus),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.stagingStatus),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('stagingStatus', $event);
    }
};
__VLS_33.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [stage] of __VLS_getVForSourceType((__VLS_ctx.options.stagingStatus))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (stage),
        value: (stage),
    });
    (stage);
}
var __VLS_33;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.warehouseLocation),
}));
const __VLS_39 = __VLS_38({
    ...{ 'onChange': {} },
    value: (__VLS_ctx.draft.warehouseLocation),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onChange: (...[$event]) => {
        __VLS_ctx.onSelectChange('warehouseLocation', $event);
    }
};
__VLS_40.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [warehouse] of __VLS_getVForSourceType((__VLS_ctx.options.warehouseLocation))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (warehouse),
        value: (warehouse),
    });
    (warehouse);
}
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draft.dateFrom),
    type: "date",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draft.dateFrom),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('dateFrom', $event);
    }
};
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "text-sm font-medium" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draft.dateTo),
    type: "date",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onInput': {} },
    value: (__VLS_ctx.draft.dateTo),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
let __VLS_57;
const __VLS_58 = {
    onInput: (...[$event]) => {
        __VLS_ctx.onInputChange('dateTo', $event);
    }
};
var __VLS_54;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FilterSheet: FilterSheet,
            Input: Input,
            Select: Select,
            draft: draft,
            onClear: onClear,
            onApply: onApply,
            onSelectChange: onSelectChange,
            onInputChange: onInputChange,
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
