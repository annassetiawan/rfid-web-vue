import { computed, ref, watch } from 'vue';
import { Search, SearchX } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '@/components/list/PageHeader.vue';
import RowActionsMenu from '@/components/list/RowActionsMenu.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import Table from '@/components/ui/Table.vue';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';
import Tabs from '@/components/ui/Tabs.vue';
import TabsList from '@/components/ui/TabsList.vue';
import TabsTrigger from '@/components/ui/TabsTrigger.vue';
import { getWorkflowStatusBadgeClass } from '@/lib/statusBadges';
import { searchMockData } from '@/mock/search';
const router = useRouter();
const route = useRoute();
const pageSize = 8;
const draftQuery = ref(String(route.query.q ?? ''));
const appliedQuery = ref(String(route.query.q ?? ''));
const activeTab = ref('all');
const typeFilter = ref('all');
const statusFilter = ref('all');
const warehouseFilter = ref('all');
const currentPage = ref(1);
const warehouseOptions = Array.from(new Set(searchMockData.map((item) => item.warehouse)));
const rowActions = [
    { key: 'view', label: 'View Detail' },
];
const filteredRows = computed(() => searchMockData.filter((row) => {
    const tabMatch = activeTab.value === 'all' || row.type === activeTab.value;
    const typeMatch = typeFilter.value === 'all' || row.type === typeFilter.value;
    const statusMatch = statusFilter.value === 'all' || row.status === statusFilter.value;
    const warehouseMatch = warehouseFilter.value === 'all' || row.warehouse === warehouseFilter.value;
    const keyword = appliedQuery.value.trim().toLowerCase();
    const searchMatch = !keyword
        || row.reference.toLowerCase().includes(keyword)
        || row.title.toLowerCase().includes(keyword)
        || row.rfidCode.toLowerCase().includes(keyword)
        || row.warehouse.toLowerCase().includes(keyword);
    return tabMatch && typeMatch && statusMatch && warehouseMatch && searchMatch;
}));
const hasActiveCriteria = computed(() => appliedQuery.value.trim().length > 0
    || activeTab.value !== 'all'
    || typeFilter.value !== 'all'
    || statusFilter.value !== 'all'
    || warehouseFilter.value !== 'all');
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)));
const startItem = computed(() => (filteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1));
const endItem = computed(() => Math.min(filteredRows.value.length, currentPage.value * pageSize));
const pagedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredRows.value.slice(start, start + pageSize);
});
watch([activeTab, typeFilter, statusFilter, warehouseFilter], () => {
    currentPage.value = 1;
});
watch(totalPages, (value) => {
    if (currentPage.value > value)
        currentPage.value = value;
});
const resetFilters = () => {
    draftQuery.value = '';
    appliedQuery.value = '';
    activeTab.value = 'all';
    typeFilter.value = 'all';
    statusFilter.value = 'all';
    warehouseFilter.value = 'all';
    currentPage.value = 1;
    router.replace({ query: {} });
};
const applySearch = () => {
    appliedQuery.value = draftQuery.value.trim();
    currentPage.value = 1;
    router.replace({
        query: appliedQuery.value ? { ...route.query, q: appliedQuery.value } : Object.fromEntries(Object.entries(route.query).filter(([key]) => key !== 'q')),
    });
};
const showInitialEmptyState = computed(() => !hasActiveCriteria.value);
const showNoResultState = computed(() => hasActiveCriteria.value && filteredRows.value.length === 0);
const formatStatus = (status) => {
    if (status === 'in-progress')
        return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
};
const formatModule = (type) => {
    if (type === 'cycle-count')
        return 'Cycle Count';
    return type.charAt(0).toUpperCase() + type.slice(1);
};
const onSelectAction = (action, row) => {
    if (action !== 'view')
        return;
    if (row.type === 'request') {
        router.push('/requests/local');
        return;
    }
    if (row.type === 'inventory') {
        router.push('/inventory');
        return;
    }
    if (row.type === 'cycle-count') {
        router.push('/cycle-count');
        return;
    }
    router.push('/scanner');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "container max-w-6xl py-6 space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "space-y-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" },
});
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "Global Search",
    description: "Find inventory, requests, cycle count, and scanner records instantly.",
}));
const __VLS_1 = __VLS_0({
    title: "Global Search",
    description: "Find inventory, requests, cycle count, and scanner records instantly.",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "space-y-4 pt-6" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "space-y-4 pt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-3 lg:flex-row lg:items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative flex-1" },
});
const __VLS_12 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.draftQuery),
    ...{ class: "h-10 pl-9" },
    placeholder: "Search by reference, RFID code, title, or warehouse...",
}));
const __VLS_17 = __VLS_16({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.draftQuery),
    ...{ class: "h-10 pl-9" },
    placeholder: "Search by reference, RFID code, title, or warehouse...",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onKeydown: (__VLS_ctx.applySearch)
};
var __VLS_18;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    ...{ class: "h-10 lg:px-6" },
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClick': {} },
    ...{ class: "h-10 lg:px-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onClick: (__VLS_ctx.applySearch)
};
__VLS_25.slots.default;
var __VLS_25;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]" },
});
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.typeFilter),
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.typeFilter),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "inventory",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "request",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cycle-count",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "scanner",
});
var __VLS_32;
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.statusFilter),
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.statusFilter),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "active",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "in-progress",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "completed",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "pending",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "inactive",
});
var __VLS_35;
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(Select, new Select({
    modelValue: (__VLS_ctx.warehouseFilter),
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.warehouseFilter),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
for (const [warehouse] of __VLS_getVForSourceType((__VLS_ctx.warehouseOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (warehouse),
        value: (warehouse),
    });
    (warehouse);
}
var __VLS_38;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "h-10 lg:w-auto lg:justify-self-end lg:px-6" },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "h-10 lg:w-auto lg:justify-self-end lg:px-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_42;
let __VLS_43;
let __VLS_44;
const __VLS_45 = {
    onClick: (__VLS_ctx.resetFilters)
};
__VLS_41.slots.default;
var __VLS_41;
var __VLS_11;
var __VLS_8;
/** @type {[typeof Tabs, typeof Tabs, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(Tabs, new Tabs({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "space-y-0" },
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "space-y-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
/** @type {[typeof TabsList, typeof TabsList, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(TabsList, new TabsList({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "all",
}));
const __VLS_53 = __VLS_52({
    value: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
var __VLS_54;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "inventory",
}));
const __VLS_56 = __VLS_55({
    value: "inventory",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
var __VLS_57;
/** @type {[typeof TabsTrigger, typeof TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(TabsTrigger, new TabsTrigger({
    value: "request",
}));
const __VLS_59 = __VLS_58({
    value: "request",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
var __VLS_60;
var __VLS_51;
var __VLS_48;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_62 = __VLS_61({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "space-y-4 pt-6" },
}));
const __VLS_65 = __VLS_64({
    ...{ class: "space-y-4 pt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
if (__VLS_ctx.showInitialEmptyState) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 px-6 text-center" },
    });
    const __VLS_67 = {}.Search;
    /** @type {[typeof __VLS_components.Search, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        ...{ class: "mb-3 h-8 w-8 text-muted-foreground" },
    }));
    const __VLS_69 = __VLS_68({
        ...{ class: "mb-3 h-8 w-8 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-1 max-w-md text-sm text-muted-foreground" },
    });
}
else if (__VLS_ctx.showNoResultState) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 px-6 text-center" },
    });
    const __VLS_71 = {}.SearchX;
    /** @type {[typeof __VLS_components.SearchX, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        ...{ class: "mb-3 h-8 w-8 text-muted-foreground" },
    }));
    const __VLS_73 = __VLS_72({
        ...{ class: "mb-3 h-8 w-8 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-1 max-w-md text-sm text-muted-foreground" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rounded-lg border bg-card overflow-x-auto overflow-y-hidden" },
    });
    /** @type {[typeof Table, typeof Table, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(Table, new Table({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    __VLS_77.slots.default;
    /** @type {[typeof TableHeader, typeof TableHeader, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(TableHeader, new TableHeader({
        ...{ class: "[&_tr]:bg-muted/40" },
    }));
    const __VLS_79 = __VLS_78({
        ...{ class: "[&_tr]:bg-muted/40" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(TableRow, new TableRow({}));
    const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        ...{ class: "w-[110px]" },
    }));
    const __VLS_85 = __VLS_84({
        ...{ class: "w-[110px]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    __VLS_86.slots.default;
    var __VLS_86;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_89.slots.default;
    var __VLS_89;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
    __VLS_92.slots.default;
    var __VLS_92;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    var __VLS_95;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_97 = __VLS_96({}, ...__VLS_functionalComponentArgsRest(__VLS_96));
    __VLS_98.slots.default;
    var __VLS_98;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    var __VLS_101;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(TableHead, new TableHead({}));
    const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
    __VLS_104.slots.default;
    var __VLS_104;
    /** @type {[typeof TableHead, typeof TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(TableHead, new TableHead({
        ...{ class: "w-[60px] text-right" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "w-[60px] text-right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    var __VLS_107;
    var __VLS_83;
    var __VLS_80;
    /** @type {[typeof TableBody, typeof TableBody, ]} */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(TableBody, new TableBody({}));
    const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
    __VLS_110.slots.default;
    for (const [row] of __VLS_getVForSourceType((__VLS_ctx.pagedRows))) {
        /** @type {[typeof TableRow, typeof TableRow, ]} */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(TableRow, new TableRow({
            key: (row.id),
            ...{ class: "hover:bg-muted/30" },
        }));
        const __VLS_112 = __VLS_111({
            key: (row.id),
            ...{ class: "hover:bg-muted/30" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        __VLS_113.slots.default;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_115 = __VLS_114({}, ...__VLS_functionalComponentArgsRest(__VLS_114));
        __VLS_116.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm font-medium text-foreground" },
        });
        (__VLS_ctx.formatModule(row.type));
        var __VLS_116;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(TableCell, new TableCell({
            ...{ class: "font-medium" },
        }));
        const __VLS_118 = __VLS_117({
            ...{ class: "font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        (row.reference);
        var __VLS_119;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
        __VLS_122.slots.default;
        (row.title);
        var __VLS_122;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
        __VLS_125.slots.default;
        (row.warehouse);
        var __VLS_125;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(TableCell, new TableCell({
            ...{ class: "font-mono text-xs" },
        }));
        const __VLS_127 = __VLS_126({
            ...{ class: "font-mono text-xs" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        __VLS_128.slots.default;
        (row.rfidCode);
        var __VLS_128;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(TableCell, new TableCell({}));
        const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
        /** @type {[typeof Badge, typeof Badge, ]} */ ;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent(Badge, new Badge({
            variant: "outline",
            ...{ class: (__VLS_ctx.getWorkflowStatusBadgeClass(row.status)) },
        }));
        const __VLS_133 = __VLS_132({
            variant: "outline",
            ...{ class: (__VLS_ctx.getWorkflowStatusBadgeClass(row.status)) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        __VLS_134.slots.default;
        (__VLS_ctx.formatStatus(row.status));
        var __VLS_134;
        var __VLS_131;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(TableCell, new TableCell({
            ...{ class: "text-muted-foreground" },
        }));
        const __VLS_136 = __VLS_135({
            ...{ class: "text-muted-foreground" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        __VLS_137.slots.default;
        (row.updatedAt);
        var __VLS_137;
        /** @type {[typeof TableCell, typeof TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(TableCell, new TableCell({
            ...{ class: "text-right" },
        }));
        const __VLS_139 = __VLS_138({
            ...{ class: "text-right" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        __VLS_140.slots.default;
        /** @type {[typeof RowActionsMenu, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(RowActionsMenu, new RowActionsMenu({
            ...{ 'onSelect': {} },
            actions: (__VLS_ctx.rowActions),
        }));
        const __VLS_142 = __VLS_141({
            ...{ 'onSelect': {} },
            actions: (__VLS_ctx.rowActions),
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        let __VLS_144;
        let __VLS_145;
        let __VLS_146;
        const __VLS_147 = {
            onSelect: ((action) => __VLS_ctx.onSelectAction(action, row))
        };
        var __VLS_143;
        var __VLS_140;
        var __VLS_113;
    }
    var __VLS_110;
    var __VLS_77;
}
if (!__VLS_ctx.showInitialEmptyState && !__VLS_ctx.showNoResultState) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    (__VLS_ctx.startItem);
    (__VLS_ctx.endItem);
    (__VLS_ctx.filteredRows.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
        disabled: (__VLS_ctx.currentPage <= 1),
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
        disabled: (__VLS_ctx.currentPage <= 1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_151;
    let __VLS_152;
    let __VLS_153;
    const __VLS_154 = {
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.showInitialEmptyState && !__VLS_ctx.showNoResultState))
                return;
            __VLS_ctx.currentPage -= 1;
        }
    };
    __VLS_150.slots.default;
    var __VLS_150;
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "outline",
    }));
    const __VLS_156 = __VLS_155({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    __VLS_157.slots.default;
    (__VLS_ctx.currentPage);
    (__VLS_ctx.totalPages);
    var __VLS_157;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
        disabled: (__VLS_ctx.currentPage >= __VLS_ctx.totalPages),
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
        disabled: (__VLS_ctx.currentPage >= __VLS_ctx.totalPages),
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.showInitialEmptyState && !__VLS_ctx.showNoResultState))
                return;
            __VLS_ctx.currentPage += 1;
        }
    };
    __VLS_160.slots.default;
    var __VLS_160;
}
var __VLS_66;
var __VLS_63;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.16em]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:justify-self-end']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[260px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[260px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['[&_tr]:bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[110px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted/30']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            SearchX: SearchX,
            PageHeader: PageHeader,
            RowActionsMenu: RowActionsMenu,
            Badge: Badge,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Table: Table,
            TableBody: TableBody,
            TableCell: TableCell,
            TableHead: TableHead,
            TableHeader: TableHeader,
            TableRow: TableRow,
            Tabs: Tabs,
            TabsList: TabsList,
            TabsTrigger: TabsTrigger,
            getWorkflowStatusBadgeClass: getWorkflowStatusBadgeClass,
            draftQuery: draftQuery,
            activeTab: activeTab,
            typeFilter: typeFilter,
            statusFilter: statusFilter,
            warehouseFilter: warehouseFilter,
            currentPage: currentPage,
            warehouseOptions: warehouseOptions,
            rowActions: rowActions,
            filteredRows: filteredRows,
            totalPages: totalPages,
            startItem: startItem,
            endItem: endItem,
            pagedRows: pagedRows,
            resetFilters: resetFilters,
            applySearch: applySearch,
            showInitialEmptyState: showInitialEmptyState,
            showNoResultState: showNoResultState,
            formatStatus: formatStatus,
            formatModule: formatModule,
            onSelectAction: onSelectAction,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
