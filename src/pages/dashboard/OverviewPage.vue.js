import { Box, CircleAlert, PackageCheck, Truck, Tag, Tags } from 'lucide-vue-next';
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue';
import WarehouseMapCard from '@/components/dashboard/WarehouseMapCard.vue';
import { ChartLegend } from '@/components/ui/chart';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import { dashboardKpis, deliveryChartData, pickupChartData, warehouseMapPoints } from '@/mock/dashboard';
const deliveryChartSeries = deliveryChartData.map((item, index) => ({
    x: index,
    label: item.date,
    total: item.total,
}));
const pickupChartSeries = pickupChartData.map((item, index) => ({
    x: index,
    label: item.date,
    total: item.total,
}));
const kpiIcons = {
    delivery: Truck,
    pickup: PackageCheck,
    missing: CircleAlert,
    transit: Box,
};
const deliveryLegend = [
    { name: 'Delivery', color: 'hsl(var(--primary))', inactive: false },
];
const pickupLegend = [
    { name: 'Pickup', color: 'hsl(var(--accent-foreground))', inactive: false },
];
const formatDeliveryTick = (tick) => {
    if (typeof tick !== 'number')
        return '';
    return deliveryChartSeries[tick]?.label ?? '';
};
const formatPickupTick = (tick) => {
    if (typeof tick !== 'number')
        return '';
    return pickupChartSeries[tick]?.label ?? '';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-semibold tracking-tight" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-3 sm:grid-cols-2" },
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Input, new Input({
    value: "01/20/2026, 10:27 - 02/19/2026, 10:27",
    ...{ class: "h-9" },
}));
const __VLS_1 = __VLS_0({
    value: "01/20/2026, 10:27 - 02/19/2026, 10:27",
    ...{ class: "h-9" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof Select, typeof Select, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Select, new Select({
    ...{ class: "h-9" },
}));
const __VLS_4 = __VLS_3({
    ...{ class: "h-9" },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 lg:grid-cols-4" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.dashboardKpis))) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(Card, new Card({
        key: (item.key),
        ...{ class: "rounded-lg" },
    }));
    const __VLS_7 = __VLS_6({
        key: (item.key),
        ...{ class: "rounded-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
        ...{ class: "pb-2" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-start justify-between gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-muted-foreground" },
    });
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-semibold" },
    });
    (item.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40" },
    });
    const __VLS_12 = ((__VLS_ctx.kpiIcons[item.key]));
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "h-4 w-4 text-muted-foreground" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "h-4 w-4 text-muted-foreground" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_11;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(CardContent, new CardContent({
        ...{ class: "space-y-2 pt-0" },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "space-y-2 pt-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    __VLS_18.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between text-xs" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-muted-foreground" },
    });
    (item.helper);
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: (item.key === 'transit' ? 'default' : 'secondary'),
    }));
    const __VLS_20 = __VLS_19({
        variant: (item.key === 'transit' ? 'default' : 'secondary'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_21.slots.default;
    (item.value);
    var __VLS_21;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-2 rounded-full bg-muted" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "h-2 rounded-full" },
        ...{ class: (item.key === 'pickup' || item.key === 'missing' ? 'bg-muted-foreground/30' : 'bg-primary') },
        ...{ style: ({ width: `${item.progress}%` }) },
    });
    var __VLS_18;
    var __VLS_8;
}
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-base font-semibold" },
});
var __VLS_27;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]" },
}));
const __VLS_29 = __VLS_28({
    ...{ class: "grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between rounded-lg border bg-accent/40 p-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-3xl font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
/** @type {[typeof Badge, typeof Badge, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(Badge, new Badge({
    variant: "secondary",
}));
const __VLS_32 = __VLS_31({
    variant: "secondary",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
var __VLS_33;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-lg border p-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_34 = {}.Tag;
/** @type {[typeof __VLS_components.Tag, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_36 = __VLS_35({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 space-y-2 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-lg border p-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_38 = {}.Tags;
/** @type {[typeof __VLS_components.Tags, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}));
const __VLS_40 = __VLS_39({
    ...{ class: "h-4 w-4 text-muted-foreground" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 space-y-2 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
var __VLS_30;
var __VLS_24;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 xl:grid-cols-2" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_43 = __VLS_42({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "flex flex-row items-center justify-between" },
}));
const __VLS_46 = __VLS_45({
    ...{ class: "flex flex-row items-center justify-between" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-base font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
const __VLS_48 = {}.ChartLegend;
/** @type {[typeof __VLS_components.ChartLegend, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    items: (__VLS_ctx.deliveryLegend),
}));
const __VLS_50 = __VLS_49({
    items: (__VLS_ctx.deliveryLegend),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_47;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(CardContent, new CardContent({}));
const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.VisXYContainer;
/** @type {[typeof __VLS_components.VisXYContainer, typeof __VLS_components.VisXYContainer, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    data: (__VLS_ctx.deliveryChartSeries),
    height: (260),
    padding: ({ top: 12, right: 16, bottom: 32, left: 36 }),
}));
const __VLS_57 = __VLS_56({
    data: (__VLS_ctx.deliveryChartSeries),
    height: (260),
    padding: ({ top: 12, right: 16, bottom: 32, left: 36 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
const __VLS_59 = {}.VisStackedBar;
/** @type {[typeof __VLS_components.VisStackedBar, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    x: ((d) => d.x),
    y: ((d) => d.total),
    color: (() => 'hsl(var(--primary))'),
    roundedCorners: (4),
}));
const __VLS_61 = __VLS_60({
    x: ((d) => d.x),
    y: ((d) => d.total),
    color: (() => 'hsl(var(--primary))'),
    roundedCorners: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const __VLS_63 = {}.VisAxis;
/** @type {[typeof __VLS_components.VisAxis, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    type: "x",
    gridLine: (false),
    tickFormat: (__VLS_ctx.formatDeliveryTick),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}));
const __VLS_65 = __VLS_64({
    type: "x",
    gridLine: (false),
    tickFormat: (__VLS_ctx.formatDeliveryTick),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const __VLS_67 = {}.VisAxis;
/** @type {[typeof __VLS_components.VisAxis, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    type: "y",
    tickLine: (false),
    domainLine: (false),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}));
const __VLS_69 = __VLS_68({
    type: "y",
    tickLine: (false),
    domainLine: (false),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const __VLS_71 = {}.VisTooltip;
/** @type {[typeof __VLS_components.VisTooltip, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({}));
const __VLS_73 = __VLS_72({}, ...__VLS_functionalComponentArgsRest(__VLS_72));
var __VLS_58;
var __VLS_54;
var __VLS_44;
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "rounded-lg" },
}));
const __VLS_76 = __VLS_75({
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "flex flex-row items-center justify-between" },
}));
const __VLS_79 = __VLS_78({
    ...{ class: "flex flex-row items-center justify-between" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-base font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
const __VLS_81 = {}.ChartLegend;
/** @type {[typeof __VLS_components.ChartLegend, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    items: (__VLS_ctx.pickupLegend),
}));
const __VLS_83 = __VLS_82({
    items: (__VLS_ctx.pickupLegend),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
var __VLS_80;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(CardContent, new CardContent({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VisXYContainer;
/** @type {[typeof __VLS_components.VisXYContainer, typeof __VLS_components.VisXYContainer, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    data: (__VLS_ctx.pickupChartSeries),
    height: (260),
    padding: ({ top: 12, right: 16, bottom: 32, left: 36 }),
}));
const __VLS_90 = __VLS_89({
    data: (__VLS_ctx.pickupChartSeries),
    height: (260),
    padding: ({ top: 12, right: 16, bottom: 32, left: 36 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.VisStackedBar;
/** @type {[typeof __VLS_components.VisStackedBar, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    x: ((d) => d.x),
    y: ((d) => d.total),
    color: (() => 'hsl(var(--accent-foreground))'),
    roundedCorners: (4),
}));
const __VLS_94 = __VLS_93({
    x: ((d) => d.x),
    y: ((d) => d.total),
    color: (() => 'hsl(var(--accent-foreground))'),
    roundedCorners: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.VisAxis;
/** @type {[typeof __VLS_components.VisAxis, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    type: "x",
    gridLine: (false),
    tickFormat: (__VLS_ctx.formatPickupTick),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}));
const __VLS_98 = __VLS_97({
    type: "x",
    gridLine: (false),
    tickFormat: (__VLS_ctx.formatPickupTick),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.VisAxis;
/** @type {[typeof __VLS_components.VisAxis, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    type: "y",
    tickLine: (false),
    domainLine: (false),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}));
const __VLS_102 = __VLS_101({
    type: "y",
    tickLine: (false),
    domainLine: (false),
    tickTextColor: ('hsl(var(--muted-foreground))'),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.VisTooltip;
/** @type {[typeof __VLS_components.VisTooltip, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_91;
var __VLS_87;
var __VLS_77;
/** @type {[typeof WarehouseMapCard, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(WarehouseMapCard, new WarehouseMapCard({
    points: (__VLS_ctx.warehouseMapPoints),
}));
const __VLS_109 = __VLS_108({
    points: (__VLS_ctx.warehouseMapPoints),
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.16em]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted/40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-[1.5fr_1fr_1fr]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-accent/40']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Tag: Tag,
            Tags: Tags,
            VisAxis: VisAxis,
            VisStackedBar: VisStackedBar,
            VisTooltip: VisTooltip,
            VisXYContainer: VisXYContainer,
            WarehouseMapCard: WarehouseMapCard,
            ChartLegend: ChartLegend,
            Badge: Badge,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Input: Input,
            Select: Select,
            dashboardKpis: dashboardKpis,
            warehouseMapPoints: warehouseMapPoints,
            deliveryChartSeries: deliveryChartSeries,
            pickupChartSeries: pickupChartSeries,
            kpiIcons: kpiIcons,
            deliveryLegend: deliveryLegend,
            pickupLegend: pickupLegend,
            formatDeliveryTick: formatDeliveryTick,
            formatPickupTick: formatPickupTick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
