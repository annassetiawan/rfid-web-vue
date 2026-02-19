import { computed, ref } from 'vue';
import { ChevronDown, Download, Search, SlidersHorizontal, TableProperties } from 'lucide-vue-next';
import ListToolbar from '@/components/list/ListToolbar.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import Input from '@/components/ui/Input.vue';
const props = withDefaults(defineProps(), {
    searchColumnId: 'name',
    searchPlaceholder: 'Search name, serial, RFID, location...',
    viewOptions: () => [],
});
const emit = defineEmits();
const compactButtonClass = computed(() => (props.density === 'compact' ? 'h-8 px-2 text-xs' : 'h-8'));
const densityLabel = computed(() => {
    if (props.density === 'compact')
        return 'Compact';
    return 'Comfortable';
});
const densityOpen = ref(false);
const viewOptionsOpen = ref(false);
const toggleableColumns = computed(() => props.table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())
    .filter((column) => !(props.viewOptions.some((option) => option.key === 'showRowNumbers') && column.id === 'number')));
const labelFor = (id) => {
    if (id === 'serialNumber')
        return 'Serial Number';
    if (id === 'rfidCode')
        return 'RFID Code';
    if (id === 'inventoryStatus')
        return 'Inventory Status';
    if (id === 'taggedDate')
        return 'Tagged Date';
    return id.charAt(0).toUpperCase() + id.slice(1);
};
const onSearchInput = (event) => {
    const target = event.target;
    props.table.getColumn(props.searchColumnId)?.setFilterValue(target.value);
};
const setDensity = (value) => {
    emit('update:density', value);
    densityOpen.value = false;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    searchColumnId: 'name',
    searchPlaceholder: 'Search name, serial, RFID, location...',
    viewOptions: () => [],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof ListToolbar, typeof ListToolbar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ListToolbar, new ListToolbar({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
{
    const { search: __VLS_thisSlot } = __VLS_2.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative w-full max-w-[320px]" },
    });
    const __VLS_4 = {}.Search;
    /** @type {[typeof __VLS_components.Search, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (String(__VLS_ctx.table.getColumn(__VLS_ctx.searchColumnId)?.getFilterValue() ?? '')),
        type: "search",
        placeholder: (__VLS_ctx.searchPlaceholder),
        ...{ class: "h-8 w-[320px] pl-9" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onInput': {} },
        value: (String(__VLS_ctx.table.getColumn(__VLS_ctx.searchColumnId)?.getFilterValue() ?? '')),
        type: "search",
        placeholder: (__VLS_ctx.searchPlaceholder),
        ...{ class: "h-8 w-[320px] pl-9" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_11;
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = {
        onInput: (__VLS_ctx.onSearchInput)
    };
    var __VLS_10;
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_18;
    let __VLS_19;
    let __VLS_20;
    const __VLS_21 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('openFilters');
        }
    };
    __VLS_17.slots.default;
    const __VLS_22 = {}.SlidersHorizontal;
    /** @type {[typeof __VLS_components.SlidersHorizontal, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_24 = __VLS_23({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    if ((__VLS_ctx.appliedFiltersCount ?? 0) > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground" },
        });
        (__VLS_ctx.appliedFiltersCount ?? 0);
    }
    var __VLS_17;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewOptionsOpen = !__VLS_ctx.viewOptionsOpen;
        }
    };
    __VLS_28.slots.default;
    const __VLS_33 = {}.TableProperties;
    /** @type {[typeof __VLS_components.TableProperties, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_35 = __VLS_34({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const __VLS_37 = {}.ChevronDown;
    /** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_39 = __VLS_38({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    var __VLS_28;
    if (__VLS_ctx.viewOptionsOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "absolute right-0 z-50 mt-2 min-w-52 rounded-lg border bg-card p-2 text-card-foreground shadow-md" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground" },
        });
        for (const [column] of __VLS_getVForSourceType((__VLS_ctx.toggleableColumns))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                key: (column.id),
                ...{ class: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted" },
            });
            /** @type {[typeof Checkbox, ]} */ ;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
                ...{ 'onUpdate:checked': {} },
                checked: (column.getIsVisible()),
            }));
            const __VLS_42 = __VLS_41({
                ...{ 'onUpdate:checked': {} },
                checked: (column.getIsVisible()),
            }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            let __VLS_44;
            let __VLS_45;
            let __VLS_46;
            const __VLS_47 = {
                'onUpdate:checked': ((value) => column.toggleVisibility(!!value))
            };
            var __VLS_43;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.labelFor(column.id));
        }
        if (__VLS_ctx.viewOptions.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
                ...{ class: "my-1 border-t border-border" },
            });
            for (const [option] of __VLS_getVForSourceType((__VLS_ctx.viewOptions))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                    key: (option.key),
                    ...{ class: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted" },
                });
                /** @type {[typeof Checkbox, ]} */ ;
                // @ts-ignore
                const __VLS_48 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
                    ...{ 'onUpdate:checked': {} },
                    checked: (option.checked),
                }));
                const __VLS_49 = __VLS_48({
                    ...{ 'onUpdate:checked': {} },
                    checked: (option.checked),
                }, ...__VLS_functionalComponentArgsRest(__VLS_48));
                let __VLS_51;
                let __VLS_52;
                let __VLS_53;
                const __VLS_54 = {
                    'onUpdate:checked': ((value) => __VLS_ctx.emit('toggle:view-option', { key: option.key, value: !!value }))
                };
                var __VLS_50;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (option.label);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: (__VLS_ctx.compactButtonClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_58;
    let __VLS_59;
    let __VLS_60;
    const __VLS_61 = {
        onClick: (...[$event]) => {
            __VLS_ctx.densityOpen = !__VLS_ctx.densityOpen;
        }
    };
    __VLS_57.slots.default;
    const __VLS_62 = {}.SlidersHorizontal;
    /** @type {[typeof __VLS_components.SlidersHorizontal, ]} */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_64 = __VLS_63({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    (__VLS_ctx.densityLabel);
    const __VLS_66 = {}.ChevronDown;
    /** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_68 = __VLS_67({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    var __VLS_57;
    if (__VLS_ctx.densityOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "absolute right-0 z-50 mt-2 min-w-44 rounded-lg border bg-card p-2 text-card-foreground shadow-md" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.densityOpen))
                        return;
                    __VLS_ctx.setDensity('compact');
                } },
            type: "button",
            ...{ class: "inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground" },
            ...{ class: (__VLS_ctx.density === 'compact' ? 'bg-muted' : '') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.densityOpen))
                        return;
                    __VLS_ctx.setDensity('comfortable');
                } },
            type: "button",
            ...{ class: "mt-1 inline-flex h-8 w-full items-center justify-start rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground" },
            ...{ class: (__VLS_ctx.density === 'comfortable' ? 'bg-muted' : '') },
        });
    }
    /** @type {[typeof DropdownMenu, typeof DropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(DropdownMenu, new DropdownMenu({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
    __VLS_72.slots.default;
    {
        const { trigger: __VLS_thisSlot } = __VLS_72.slots;
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(Button, new Button({
            variant: "outline",
            ...{ class: (__VLS_ctx.compactButtonClass) },
        }));
        const __VLS_74 = __VLS_73({
            variant: "outline",
            ...{ class: (__VLS_ctx.compactButtonClass) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        const __VLS_76 = {}.Download;
        /** @type {[typeof __VLS_components.Download, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_78 = __VLS_77({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        const __VLS_80 = {}.ChevronDown;
        /** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_82 = __VLS_81({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        var __VLS_75;
    }
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_87;
    let __VLS_88;
    let __VLS_89;
    const __VLS_90 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('exportCsv');
        }
    };
    __VLS_86.slots.default;
    var __VLS_86;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
    }));
    const __VLS_92 = __VLS_91({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "sm",
        ...{ class: "w-full justify-start" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    let __VLS_94;
    let __VLS_95;
    let __VLS_96;
    const __VLS_97 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('exportExcel');
        }
    };
    __VLS_93.slots.default;
    var __VLS_93;
    var __VLS_72;
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-52']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-card-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-44']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-card-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-accent-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-accent-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronDown: ChevronDown,
            Download: Download,
            Search: Search,
            SlidersHorizontal: SlidersHorizontal,
            TableProperties: TableProperties,
            ListToolbar: ListToolbar,
            Button: Button,
            Checkbox: Checkbox,
            DropdownMenu: DropdownMenu,
            Input: Input,
            emit: emit,
            compactButtonClass: compactButtonClass,
            densityLabel: densityLabel,
            densityOpen: densityOpen,
            viewOptionsOpen: viewOptionsOpen,
            toggleableColumns: toggleableColumns,
            labelFor: labelFor,
            onSearchInput: onSearchInput,
            setDensity: setDensity,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
