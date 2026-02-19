import { computed, reactive, ref } from 'vue';
import { Check, MoreHorizontal, Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Separator from '@/components/ui/Separator.vue';
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperTitle, StepperTrigger, } from '@/components/ui/stepper';
import Textarea from '@/components/ui/Textarea.vue';
import Toast from '@/components/ui/Toast.vue';
import PageHeader from '@/components/list/PageHeader.vue';
const draftStorageKey = 'local-request-draft';
const router = useRouter();
const steps = [
    { id: 1, label: 'Request', helper: 'Request details', requiredFields: ['shipFrom', 'requestType', 'serviceLevel', 'requestDate', 'shipDate', 'modeTransport', 'freightForwarder'] },
    { id: 2, label: 'Unit Details', helper: 'Add units', requiredFields: ['unit', 'serial', 'quantity'] },
    { id: 3, label: 'Ship To', helper: 'Destination info', requiredFields: ['shipTo', 'city', 'address', 'contactName', 'contactEmail'] },
    { id: 4, label: 'Recipients', helper: 'Additional emails', requiredFields: [] },
    { id: 5, label: 'Signature', helper: 'Finalize request', requiredFields: [] },
];
const unitOptions = ['RFID Reader', 'RFID Tag', 'Handheld Scanner', 'Dock Door Portal'];
const currentStep = ref(1);
const showSubmitDialog = ref(false);
const showCancelDialog = ref(false);
const showIncompleteSteps = ref(false);
const invalidSteps = ref([]);
const copyConsignee = ref(true);
const recipientEmailInput = ref('');
const recipients = ref([]);
const uploadedFileName = ref('');
const toast = reactive({
    message: '',
    description: '',
});
let toastTimer;
const requestFields = reactive({
    shipFrom: '',
    requestNumber: 'REQ-2026-028',
    requestType: '',
    serviceLevel: '',
    requestDate: '',
    shipDate: '',
    modeTransport: '',
    freightForwarder: '',
    awb: '',
    license: '',
    note: '',
});
const unitRows = ref([
    {
        id: '1',
        unit: '',
        serial: '',
        quantity: 1,
        description: '',
        classificationCode: '',
        eccn: '',
        license: 'enc',
        countryOfOrigin: '',
        unitPrice: '',
        dimensionUnit: 'cm',
        length: '',
        width: '',
        height: '',
        weightUnit: 'kg',
        unitWeight: '',
    },
]);
const customer = reactive({
    shipTo: '',
    city: '',
    address: '',
    contactName: '',
    contactEmail: '',
});
const consignee = reactive({
    shipTo: '',
    city: '',
    address: '',
    contactName: '',
    contactEmail: '',
});
const signature = reactive({
    creator: 'michella',
    timestamp: '',
    customerPickup: false,
    invoiceRequired: false,
    packingListRequired: false,
});
const isFinalStep = computed(() => currentStep.value === steps.length);
const canSubmit = computed(() => isFinalStep.value && allStepsValid.value);
const currentStepErrors = computed(() => validateStep(currentStep.value));
const allStepsValid = computed(() => steps.every((step) => validateStep(step.id).length === 0));
const goToStep = (stepId) => {
    currentStep.value = stepId;
};
const handleNext = () => {
    const errors = validateStep(currentStep.value);
    if (errors.length > 0) {
        showIncompleteSteps.value = true;
        recomputeInvalidSteps();
        showToast('Please complete required fields', errors[0]);
        return;
    }
    currentStep.value = Math.min(5, currentStep.value + 1);
};
const handleBack = () => {
    currentStep.value = Math.max(1, currentStep.value - 1);
};
const handleAddUnit = () => {
    const next = unitRows.value.length + 1;
    unitRows.value.push({
        id: String(next),
        unit: '',
        serial: '',
        quantity: 1,
        description: '',
        classificationCode: '',
        eccn: '',
        license: 'enc',
        countryOfOrigin: '',
        unitPrice: '',
        dimensionUnit: 'cm',
        length: '',
        width: '',
        height: '',
        weightUnit: 'kg',
        unitWeight: '',
    });
};
const handleRemoveUnit = (id) => {
    if (unitRows.value.length === 1)
        return;
    unitRows.value = unitRows.value.filter((row) => row.id !== id);
};
const handleAddRecipient = () => {
    const value = recipientEmailInput.value.trim();
    if (!value || recipients.value.includes(value))
        return;
    recipients.value.push(value);
    recipientEmailInput.value = '';
};
const handleRemoveRecipient = (email) => {
    recipients.value = recipients.value.filter((item) => item !== email);
};
const handleSaveDraft = () => {
    const payload = {
        currentStep: currentStep.value,
        requestFields: { ...requestFields },
        unitRows: unitRows.value,
        customer: { ...customer },
        consignee: { ...consignee },
        copyConsignee: copyConsignee.value,
        recipients: recipients.value,
        signature: { ...signature },
    };
    localStorage.setItem(draftStorageKey, JSON.stringify(payload));
    showToast('Draft saved', 'Your request draft has been saved locally.');
};
const handleSubmit = () => {
    if (!canSubmit.value) {
        onSubmitIntent();
        return;
    }
    showSubmitDialog.value = true;
};
const handleConfirmSubmit = () => {
    localStorage.removeItem(draftStorageKey);
    showSubmitDialog.value = false;
    router.push('/requests/local');
};
const onRequestSelect = (key, event) => {
    const target = event.target;
    requestFields[key] = target.value;
};
const onRequestInput = (key, event) => {
    const target = event.target;
    requestFields[key] = target.value;
};
const onUnitSelect = (id, key, event) => {
    const target = event.target;
    unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row));
};
const onUnitInput = (id, key, event) => {
    const target = event.target;
    unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row));
};
const onUnitTextarea = (id, key, event) => {
    const target = event.target;
    unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row));
};
const onUnitNumber = (id, key, event) => {
    const target = event.target;
    const value = Math.max(1, Number(target.value || 1));
    unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: value } : row));
};
const updateUnitQuantity = (id, quantity) => {
    const safeQuantity = Math.max(1, quantity);
    unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, quantity: safeQuantity } : row));
};
const getExtendedPrice = (row) => {
    const price = Number(row.unitPrice || 0);
    return (price * row.quantity).toFixed(2);
};
const onCustomerInput = (key, event) => {
    const target = event.target;
    customer[key] = target.value;
    if (copyConsignee.value) {
        consignee[key] = target.value;
    }
};
const onConsigneeInput = (key, event) => {
    const target = event.target;
    consignee[key] = target.value;
};
const toggleCopyConsignee = (checked) => {
    copyConsignee.value = checked;
    if (copyConsignee.value) {
        Object.assign(consignee, customer);
    }
};
const onRecipientInput = (event) => {
    const target = event.target;
    recipientEmailInput.value = target.value;
};
const onSignatureSelect = (key, event) => {
    const target = event.target;
    signature[key] = target.value;
};
const onSignatureInput = (key, event) => {
    const target = event.target;
    signature[key] = target.value;
};
const onSignatureCheck = (key, checked) => {
    signature[key] = checked;
};
const onFileChange = (event) => {
    const target = event.target;
    uploadedFileName.value = target.files?.[0]?.name ?? '';
};
const stepIsCompleted = (stepId) => validateStep(stepId).length === 0 && stepId < currentStep.value;
const stepIsIncomplete = (stepId) => invalidSteps.value.includes(stepId);
const validateStep = (stepId) => {
    if (stepId === 1) {
        const missing = [];
        if (!requestFields.shipFrom)
            missing.push('Ship From is required.');
        if (!requestFields.requestType)
            missing.push('Request Type is required.');
        if (!requestFields.serviceLevel)
            missing.push('Service Level is required.');
        if (!requestFields.requestDate)
            missing.push('Request Date is required.');
        if (!requestFields.shipDate)
            missing.push('Ship Date is required.');
        if (!requestFields.modeTransport)
            missing.push('Mode of Transport is required.');
        if (!requestFields.freightForwarder)
            missing.push('Freight Forwarder is required.');
        return missing;
    }
    if (stepId === 2) {
        if (unitRows.value.length === 0)
            return ['At least one unit is required.'];
        const hasInvalid = unitRows.value.some((row) => !row.unit || !row.serial || row.quantity < 1);
        return hasInvalid ? ['Each unit requires Unit, Serial Number, and Quantity.'] : [];
    }
    if (stepId === 3) {
        const customerMissing = ['shipTo', 'city', 'address', 'contactName', 'contactEmail']
            .some((key) => !customer[key]);
        if (customerMissing)
            return ['Complete all required customer fields in Ship To step.'];
        if (!copyConsignee.value) {
            const consigneeMissing = ['shipTo', 'city', 'address', 'contactName', 'contactEmail']
                .some((key) => !consignee[key]);
            if (consigneeMissing)
                return ['Complete all required consignee fields or enable copy from customer.'];
        }
    }
    return [];
};
const recomputeInvalidSteps = () => {
    invalidSteps.value = steps
        .filter((step) => validateStep(step.id).length > 0)
        .map((step) => step.id);
};
const canNavigateToStep = (nextStep) => {
    for (let step = 1; step < nextStep; step += 1) {
        if (validateStep(step).length > 0)
            return false;
    }
    return true;
};
const onStepperChange = (next) => {
    if (!next || next === currentStep.value)
        return;
    if (canNavigateToStep(next)) {
        currentStep.value = next;
        return;
    }
    showIncompleteSteps.value = true;
    recomputeInvalidSteps();
    showToast('Complete previous steps first', 'Please finish required fields before jumping ahead.');
};
const onCancel = () => {
    showCancelDialog.value = true;
};
const confirmCancel = () => {
    localStorage.removeItem(draftStorageKey);
    showCancelDialog.value = false;
    router.push('/requests/local');
};
const onSubmitIntent = () => {
    if (canSubmit.value)
        return;
    showIncompleteSteps.value = true;
    recomputeInvalidSteps();
    showToast('Complete all steps before submitting', 'Finish required fields and move to the final step.');
};
const showToast = (message, description = '') => {
    toast.message = message;
    toast.description = description;
    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }
    toastTimer = window.setTimeout(() => {
        toast.message = '';
        toast.description = '';
    }, 2400);
};
const loadDraft = () => {
    const raw = localStorage.getItem(draftStorageKey);
    if (!raw)
        return;
    try {
        const parsed = JSON.parse(raw);
        if ([1, 2, 3, 4, 5].includes(parsed.currentStep))
            currentStep.value = parsed.currentStep;
        if (parsed.requestFields)
            Object.assign(requestFields, parsed.requestFields);
        if (parsed.unitRows)
            unitRows.value = parsed.unitRows;
        if (parsed.customer)
            Object.assign(customer, parsed.customer);
        if (parsed.consignee)
            Object.assign(consignee, parsed.consignee);
        if (typeof parsed.copyConsignee === 'boolean')
            copyConsignee.value = parsed.copyConsignee;
        if (Array.isArray(parsed.recipients))
            recipients.value = parsed.recipients;
        if (parsed.signature)
            Object.assign(signature, parsed.signature);
    }
    catch {
        localStorage.removeItem(draftStorageKey);
    }
};
loadDraft();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "container relative max-w-7xl py-6 pb-24" },
});
if (__VLS_ctx.toast.message) {
    /** @type {[typeof Toast, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Toast, new Toast({
        title: (__VLS_ctx.toast.message),
        description: (__VLS_ctx.toast.description),
        ...{ class: "fixed right-6 top-6 z-[120]" },
    }));
    const __VLS_1 = __VLS_0({
        title: (__VLS_ctx.toast.message),
        description: (__VLS_ctx.toast.description),
        ...{ class: "fixed right-6 top-6 z-[120]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.showSubmitDialog),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.showSubmitDialog),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-lg font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1 text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-6 flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showSubmitDialog = false;
    }
};
__VLS_8.slots.default;
var __VLS_8;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (__VLS_ctx.handleConfirmSubmit)
};
__VLS_15.slots.default;
var __VLS_15;
var __VLS_5;
/** @type {[typeof Dialog, typeof Dialog, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(Dialog, new Dialog({
    modelValue: (__VLS_ctx.showCancelDialog),
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.showCancelDialog),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-lg font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1 text-sm text-muted-foreground" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-6 flex items-center justify-end gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showCancelDialog = false;
    }
};
__VLS_25.slots.default;
var __VLS_25;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (__VLS_ctx.confirmCancel)
};
__VLS_32.slots.default;
var __VLS_32;
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "space-y-3 pb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" },
});
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "Create New Local Request",
    description: "Draft in progress - Local time reflects your current timezone",
}));
const __VLS_38 = __VLS_37({
    title: "Create New Local Request",
    description: "Draft in progress - Local time reflects your current timezone",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_39.slots;
    /** @type {[typeof Badge, typeof Badge, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(Badge, new Badge({
        variant: "secondary",
    }));
    const __VLS_41 = __VLS_40({
        variant: "secondary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_42.slots.default;
    var __VLS_42;
}
var __VLS_39;
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "grid gap-6 lg:grid-cols-3" },
});
/** @type {[typeof Card, typeof Card, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(Card, new Card({
    ...{ class: "h-fit lg:sticky lg:top-20" },
}));
const __VLS_47 = __VLS_46({
    ...{ class: "h-fit lg:sticky lg:top-20" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
/** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
    ...{ class: "space-y-1.5" },
}));
const __VLS_50 = __VLS_49({
    ...{ class: "space-y-1.5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-base font-semibold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
var __VLS_51;
/** @type {[typeof CardContent, typeof CardContent, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(CardContent, new CardContent({
    ...{ class: "space-y-4" },
}));
const __VLS_53 = __VLS_52({
    ...{ class: "space-y-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "absolute bottom-4 left-6 top-4 z-0 w-px bg-border" },
});
const __VLS_55 = {}.Stepper;
/** @type {[typeof __VLS_components.Stepper, typeof __VLS_components.Stepper, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.currentStep),
    orientation: "vertical",
    linear: (false),
    ...{ class: "relative z-10 w-full flex-col items-start gap-0" },
}));
const __VLS_57 = __VLS_56({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.currentStep),
    orientation: "vertical",
    linear: (false),
    ...{ class: "relative z-10 w-full flex-col items-start gap-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
let __VLS_61;
const __VLS_62 = {
    'onUpdate:modelValue': (__VLS_ctx.onStepperChange)
};
__VLS_58.slots.default;
for (const [step] of __VLS_getVForSourceType((__VLS_ctx.steps))) {
    const __VLS_63 = {}.StepperItem;
    /** @type {[typeof __VLS_components.StepperItem, typeof __VLS_components.StepperItem, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        key: (step.id),
        step: (step.id),
        ...{ class: "relative w-full items-start pb-4 last:pb-0" },
    }));
    const __VLS_65 = __VLS_64({
        key: (step.id),
        step: (step.id),
        ...{ class: "relative w-full items-start pb-4 last:pb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    __VLS_66.slots.default;
    const __VLS_67 = {}.StepperTrigger;
    /** @type {[typeof __VLS_components.StepperTrigger, typeof __VLS_components.StepperTrigger, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        ...{ class: "w-full items-start p-0 text-left" },
    }));
    const __VLS_69 = __VLS_68({
        ...{ class: "w-full items-start p-0 text-left" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_70.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex w-full items-start gap-3 rounded-md border border-transparent px-2 py-2 hover:bg-muted/50" },
        ...{ class: (__VLS_ctx.showIncompleteSteps && __VLS_ctx.stepIsIncomplete(step.id) ? 'border-destructive/50 bg-destructive/5' : '') },
    });
    const __VLS_71 = {}.StepperIndicator;
    /** @type {[typeof __VLS_components.StepperIndicator, typeof __VLS_components.StepperIndicator, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        ...{ class: "h-8 w-8 border border-border bg-background" },
    }));
    const __VLS_73 = __VLS_72({
        ...{ class: "h-8 w-8 border border-border bg-background" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    __VLS_74.slots.default;
    if (__VLS_ctx.stepIsCompleted(step.id)) {
        const __VLS_75 = {}.Check;
        /** @type {[typeof __VLS_components.Check, ]} */ ;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_77 = __VLS_76({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (step.id);
    }
    var __VLS_74;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex min-w-0 flex-col gap-1 pt-0.5" },
    });
    const __VLS_79 = {}.StepperTitle;
    /** @type {[typeof __VLS_components.StepperTitle, typeof __VLS_components.StepperTitle, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        ...{ class: "text-sm leading-none" },
    }));
    const __VLS_81 = __VLS_80({
        ...{ class: "text-sm leading-none" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    __VLS_82.slots.default;
    (step.label);
    var __VLS_82;
    const __VLS_83 = {}.StepperDescription;
    /** @type {[typeof __VLS_components.StepperDescription, typeof __VLS_components.StepperDescription, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        ...{ class: "text-xs" },
    }));
    const __VLS_85 = __VLS_84({
        ...{ class: "text-xs" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    __VLS_86.slots.default;
    (step.helper);
    var __VLS_86;
    var __VLS_70;
    var __VLS_66;
}
var __VLS_58;
/** @type {[typeof Separator, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(Separator, new Separator({}));
const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "sm",
    disabled: (__VLS_ctx.currentStep === 1),
}));
const __VLS_91 = __VLS_90({
    ...{ 'onClick': {} },
    variant: "outline",
    size: "sm",
    disabled: (__VLS_ctx.currentStep === 1),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_93;
let __VLS_94;
let __VLS_95;
const __VLS_96 = {
    onClick: (__VLS_ctx.handleBack)
};
__VLS_92.slots.default;
var __VLS_92;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    size: "sm",
    disabled: (__VLS_ctx.currentStep === __VLS_ctx.steps.length),
}));
const __VLS_98 = __VLS_97({
    ...{ 'onClick': {} },
    size: "sm",
    disabled: (__VLS_ctx.currentStep === __VLS_ctx.steps.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onClick: (__VLS_ctx.handleNext)
};
__VLS_99.slots.default;
var __VLS_99;
var __VLS_54;
var __VLS_48;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6 lg:col-span-2" },
});
if (__VLS_ctx.currentStep === 1) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(Card, new Card({}));
    const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
    __VLS_106.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({}));
    const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_109.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    var __VLS_109;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(CardContent, new CardContent({
        ...{ class: "space-y-5" },
    }));
    const __VLS_111 = __VLS_110({
        ...{ class: "space-y-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    __VLS_112.slots.default;
    if (__VLS_ctx.currentStepErrors.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive" },
        });
        (__VLS_ctx.currentStepErrors[0]);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid gap-4 md:grid-cols-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.shipFrom),
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.shipFrom),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('shipFrom', $event);
        }
    };
    __VLS_115.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "jakarta",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "bandung",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "surabaya",
    });
    var __VLS_115;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(Input, new Input({
        value: (__VLS_ctx.requestFields.requestNumber),
        readonly: true,
    }));
    const __VLS_121 = __VLS_120({
        value: (__VLS_ctx.requestFields.requestNumber),
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.requestType),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.requestType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_126;
    let __VLS_127;
    let __VLS_128;
    const __VLS_129 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('requestType', $event);
        }
    };
    __VLS_125.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "delivery",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "pickup",
    });
    var __VLS_125;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.serviceLevel),
    }));
    const __VLS_131 = __VLS_130({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.serviceLevel),
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    let __VLS_133;
    let __VLS_134;
    let __VLS_135;
    const __VLS_136 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('serviceLevel', $event);
        }
    };
    __VLS_132.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "standard",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "express",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "priority",
    });
    var __VLS_132;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.requestDate),
        type: "datetime-local",
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.requestDate),
        type: "datetime-local",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_140;
    let __VLS_141;
    let __VLS_142;
    const __VLS_143 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestInput('requestDate', $event);
        }
    };
    var __VLS_139;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.shipDate),
        type: "datetime-local",
    }));
    const __VLS_145 = __VLS_144({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.shipDate),
        type: "datetime-local",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    let __VLS_147;
    let __VLS_148;
    let __VLS_149;
    const __VLS_150 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestInput('shipDate', $event);
        }
    };
    var __VLS_146;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.modeTransport),
    }));
    const __VLS_152 = __VLS_151({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.modeTransport),
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    let __VLS_154;
    let __VLS_155;
    let __VLS_156;
    const __VLS_157 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('modeTransport', $event);
        }
    };
    __VLS_153.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "air",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "sea",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "land",
    });
    var __VLS_153;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.freightForwarder),
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.freightForwarder),
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('freightForwarder', $event);
        }
    };
    __VLS_160.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "dhl",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "jnt",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "sicepat",
    });
    var __VLS_160;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.awb),
        placeholder: "Optional AWB",
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.awb),
        placeholder: "Optional AWB",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestInput('awb', $event);
        }
    };
    var __VLS_167;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.license),
    }));
    const __VLS_173 = __VLS_172({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.requestFields.license),
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    let __VLS_175;
    let __VLS_176;
    let __VLS_177;
    const __VLS_178 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestSelect('license', $event);
        }
    };
    __VLS_174.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "enc",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "nlr",
    });
    var __VLS_174;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5 md:col-span-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Textarea, ]} */ ;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent(Textarea, new Textarea({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.note),
        placeholder: "Request note",
    }));
    const __VLS_180 = __VLS_179({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.requestFields.note),
        placeholder: "Request note",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    let __VLS_182;
    let __VLS_183;
    let __VLS_184;
    const __VLS_185 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 1))
                return;
            __VLS_ctx.onRequestInput('note', $event);
        }
    };
    var __VLS_181;
    var __VLS_112;
    var __VLS_106;
}
if (__VLS_ctx.currentStep === 2) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(Card, new Card({}));
    const __VLS_187 = __VLS_186({}, ...__VLS_functionalComponentArgsRest(__VLS_186));
    __VLS_188.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({
        ...{ class: "space-y-3" },
    }));
    const __VLS_190 = __VLS_189({
        ...{ class: "space-y-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
    }));
    const __VLS_193 = __VLS_192({
        ...{ 'onClick': {} },
        variant: "outline",
        size: "sm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    let __VLS_195;
    let __VLS_196;
    let __VLS_197;
    const __VLS_198 = {
        onClick: (__VLS_ctx.handleAddUnit)
    };
    __VLS_194.slots.default;
    const __VLS_199 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_201 = __VLS_200({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    var __VLS_194;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    var __VLS_191;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent(CardContent, new CardContent({}));
    const __VLS_204 = __VLS_203({}, ...__VLS_functionalComponentArgsRest(__VLS_203));
    __VLS_205.slots.default;
    if (__VLS_ctx.currentStepErrors.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive" },
        });
        (__VLS_ctx.currentStepErrors[0]);
    }
    const __VLS_206 = {}.Accordion;
    /** @type {[typeof __VLS_components.Accordion, typeof __VLS_components.Accordion, ]} */ ;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
        type: "multiple",
        ...{ class: "rounded-lg border border-border/60 bg-card" },
    }));
    const __VLS_208 = __VLS_207({
        type: "multiple",
        ...{ class: "rounded-lg border border-border/60 bg-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    __VLS_209.slots.default;
    for (const [row, index] of __VLS_getVForSourceType((__VLS_ctx.unitRows))) {
        const __VLS_210 = {}.AccordionItem;
        /** @type {[typeof __VLS_components.AccordionItem, typeof __VLS_components.AccordionItem, ]} */ ;
        // @ts-ignore
        const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
            key: (row.id),
            value: (row.id),
            ...{ class: "px-4" },
        }));
        const __VLS_212 = __VLS_211({
            key: (row.id),
            value: (row.id),
            ...{ class: "px-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_211));
        __VLS_213.slots.default;
        const __VLS_214 = {}.AccordionTrigger;
        /** @type {[typeof __VLS_components.AccordionTrigger, typeof __VLS_components.AccordionTrigger, ]} */ ;
        // @ts-ignore
        const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({}));
        const __VLS_216 = __VLS_215({}, ...__VLS_functionalComponentArgsRest(__VLS_215));
        __VLS_217.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex w-full flex-wrap items-center justify-between gap-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-col text-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm font-semibold" },
        });
        (row.unit || `Unit ${index + 1}`);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-muted-foreground" },
        });
        (row.serial || '-');
        (row.quantity);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-3 text-sm text-muted-foreground" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.getExtendedPrice(row));
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "icon",
            ...{ class: "h-8 w-8" },
        }));
        const __VLS_219 = __VLS_218({
            ...{ 'onClick': {} },
            variant: "ghost",
            size: "icon",
            ...{ class: "h-8 w-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        let __VLS_221;
        let __VLS_222;
        let __VLS_223;
        const __VLS_224 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.handleRemoveUnit(row.id);
            }
        };
        __VLS_220.slots.default;
        const __VLS_225 = {}.MoreHorizontal;
        /** @type {[typeof __VLS_components.MoreHorizontal, ]} */ ;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_227 = __VLS_226({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        var __VLS_220;
        var __VLS_217;
        const __VLS_229 = {}.AccordionContent;
        /** @type {[typeof __VLS_components.AccordionContent, typeof __VLS_components.AccordionContent, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({}));
        const __VLS_231 = __VLS_230({}, ...__VLS_functionalComponentArgsRest(__VLS_230));
        __VLS_232.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid gap-4 pb-4 lg:grid-cols-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Select, typeof Select, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(Select, new Select({
            ...{ 'onChange': {} },
            value: (row.unit),
        }));
        const __VLS_234 = __VLS_233({
            ...{ 'onChange': {} },
            value: (row.unit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        let __VLS_236;
        let __VLS_237;
        let __VLS_238;
        const __VLS_239 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitSelect(row.id, 'unit', $event);
            }
        };
        __VLS_235.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "",
        });
        for (const [unit] of __VLS_getVForSourceType((__VLS_ctx.unitOptions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (unit),
                value: (unit),
            });
            (unit);
        }
        var __VLS_235;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_240 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.serial),
            placeholder: "Enter serial number",
        }));
        const __VLS_241 = __VLS_240({
            ...{ 'onInput': {} },
            value: (row.serial),
            placeholder: "Enter serial number",
        }, ...__VLS_functionalComponentArgsRest(__VLS_240));
        let __VLS_243;
        let __VLS_244;
        let __VLS_245;
        const __VLS_246 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'serial', $event);
            }
        };
        var __VLS_242;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_247 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
        }));
        const __VLS_248 = __VLS_247({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
        }, ...__VLS_functionalComponentArgsRest(__VLS_247));
        let __VLS_250;
        let __VLS_251;
        let __VLS_252;
        const __VLS_253 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.updateUnitQuantity(row.id, row.quantity - 1);
            }
        };
        __VLS_249.slots.default;
        var __VLS_249;
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            ...{ class: "w-16 text-center" },
            value: (String(row.quantity)),
        }));
        const __VLS_255 = __VLS_254({
            ...{ 'onInput': {} },
            ...{ class: "w-16 text-center" },
            value: (String(row.quantity)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        let __VLS_257;
        let __VLS_258;
        let __VLS_259;
        const __VLS_260 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitNumber(row.id, 'quantity', $event);
            }
        };
        var __VLS_256;
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
        }));
        const __VLS_262 = __VLS_261({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        let __VLS_264;
        let __VLS_265;
        let __VLS_266;
        const __VLS_267 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.updateUnitQuantity(row.id, row.quantity + 1);
            }
        };
        __VLS_263.slots.default;
        var __VLS_263;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Textarea, ]} */ ;
        // @ts-ignore
        const __VLS_268 = __VLS_asFunctionalComponent(Textarea, new Textarea({
            ...{ 'onInput': {} },
            value: (row.description),
            placeholder: "Add a unit description",
        }));
        const __VLS_269 = __VLS_268({
            ...{ 'onInput': {} },
            value: (row.description),
            placeholder: "Add a unit description",
        }, ...__VLS_functionalComponentArgsRest(__VLS_268));
        let __VLS_271;
        let __VLS_272;
        let __VLS_273;
        const __VLS_274 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitTextarea(row.id, 'description', $event);
            }
        };
        var __VLS_270;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid gap-3 sm:grid-cols-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_275 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.classificationCode),
            placeholder: "e.g. 8471.30",
        }));
        const __VLS_276 = __VLS_275({
            ...{ 'onInput': {} },
            value: (row.classificationCode),
            placeholder: "e.g. 8471.30",
        }, ...__VLS_functionalComponentArgsRest(__VLS_275));
        let __VLS_278;
        let __VLS_279;
        let __VLS_280;
        const __VLS_281 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'classificationCode', $event);
            }
        };
        var __VLS_277;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_282 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.eccn),
            placeholder: "e.g. 5A992",
        }));
        const __VLS_283 = __VLS_282({
            ...{ 'onInput': {} },
            value: (row.eccn),
            placeholder: "e.g. 5A992",
        }, ...__VLS_functionalComponentArgsRest(__VLS_282));
        let __VLS_285;
        let __VLS_286;
        let __VLS_287;
        const __VLS_288 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'eccn', $event);
            }
        };
        var __VLS_284;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Select, typeof Select, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(Select, new Select({
            ...{ 'onChange': {} },
            value: (row.license),
        }));
        const __VLS_290 = __VLS_289({
            ...{ 'onChange': {} },
            value: (row.license),
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        let __VLS_292;
        let __VLS_293;
        let __VLS_294;
        const __VLS_295 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitSelect(row.id, 'license', $event);
            }
        };
        __VLS_291.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "enc",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "n/a",
        });
        var __VLS_291;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_296 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.countryOfOrigin),
            placeholder: "e.g. Indonesia",
        }));
        const __VLS_297 = __VLS_296({
            ...{ 'onInput': {} },
            value: (row.countryOfOrigin),
            placeholder: "e.g. Indonesia",
        }, ...__VLS_functionalComponentArgsRest(__VLS_296));
        let __VLS_299;
        let __VLS_300;
        let __VLS_301;
        const __VLS_302 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'countryOfOrigin', $event);
            }
        };
        var __VLS_298;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid gap-3 sm:grid-cols-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_303 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.unitPrice),
            placeholder: "0.00",
        }));
        const __VLS_304 = __VLS_303({
            ...{ 'onInput': {} },
            value: (row.unitPrice),
            placeholder: "0.00",
        }, ...__VLS_functionalComponentArgsRest(__VLS_303));
        let __VLS_306;
        let __VLS_307;
        let __VLS_308;
        const __VLS_309 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'unitPrice', $event);
            }
        };
        var __VLS_305;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_310 = __VLS_asFunctionalComponent(Input, new Input({
            value: (__VLS_ctx.getExtendedPrice(row)),
            readonly: true,
        }));
        const __VLS_311 = __VLS_310({
            value: (__VLS_ctx.getExtendedPrice(row)),
            readonly: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_310));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid gap-2 sm:grid-cols-4" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.length),
            placeholder: "L",
        }));
        const __VLS_314 = __VLS_313({
            ...{ 'onInput': {} },
            value: (row.length),
            placeholder: "L",
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        let __VLS_316;
        let __VLS_317;
        let __VLS_318;
        const __VLS_319 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'length', $event);
            }
        };
        var __VLS_315;
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_320 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.width),
            placeholder: "W",
        }));
        const __VLS_321 = __VLS_320({
            ...{ 'onInput': {} },
            value: (row.width),
            placeholder: "W",
        }, ...__VLS_functionalComponentArgsRest(__VLS_320));
        let __VLS_323;
        let __VLS_324;
        let __VLS_325;
        const __VLS_326 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'width', $event);
            }
        };
        var __VLS_322;
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_327 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.height),
            placeholder: "H",
        }));
        const __VLS_328 = __VLS_327({
            ...{ 'onInput': {} },
            value: (row.height),
            placeholder: "H",
        }, ...__VLS_functionalComponentArgsRest(__VLS_327));
        let __VLS_330;
        let __VLS_331;
        let __VLS_332;
        const __VLS_333 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'height', $event);
            }
        };
        var __VLS_329;
        /** @type {[typeof Select, typeof Select, ]} */ ;
        // @ts-ignore
        const __VLS_334 = __VLS_asFunctionalComponent(Select, new Select({
            ...{ 'onChange': {} },
            value: (row.dimensionUnit),
        }));
        const __VLS_335 = __VLS_334({
            ...{ 'onChange': {} },
            value: (row.dimensionUnit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_334));
        let __VLS_337;
        let __VLS_338;
        let __VLS_339;
        const __VLS_340 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitSelect(row.id, 'dimensionUnit', $event);
            }
        };
        __VLS_336.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "cm",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "in",
        });
        var __VLS_336;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1.5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid gap-2 sm:grid-cols-2" },
        });
        /** @type {[typeof Input, ]} */ ;
        // @ts-ignore
        const __VLS_341 = __VLS_asFunctionalComponent(Input, new Input({
            ...{ 'onInput': {} },
            value: (row.unitWeight),
            placeholder: "Weight",
        }));
        const __VLS_342 = __VLS_341({
            ...{ 'onInput': {} },
            value: (row.unitWeight),
            placeholder: "Weight",
        }, ...__VLS_functionalComponentArgsRest(__VLS_341));
        let __VLS_344;
        let __VLS_345;
        let __VLS_346;
        const __VLS_347 = {
            onInput: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitInput(row.id, 'unitWeight', $event);
            }
        };
        var __VLS_343;
        /** @type {[typeof Select, typeof Select, ]} */ ;
        // @ts-ignore
        const __VLS_348 = __VLS_asFunctionalComponent(Select, new Select({
            ...{ 'onChange': {} },
            value: (row.weightUnit),
        }));
        const __VLS_349 = __VLS_348({
            ...{ 'onChange': {} },
            value: (row.weightUnit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_348));
        let __VLS_351;
        let __VLS_352;
        let __VLS_353;
        const __VLS_354 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.onUnitSelect(row.id, 'weightUnit', $event);
            }
        };
        __VLS_350.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "kg",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "lbs",
        });
        var __VLS_350;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-end" },
        });
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        const __VLS_355 = __VLS_asFunctionalComponent(Button, new Button({
            ...{ 'onClick': {} },
            variant: "outline",
        }));
        const __VLS_356 = __VLS_355({
            ...{ 'onClick': {} },
            variant: "outline",
        }, ...__VLS_functionalComponentArgsRest(__VLS_355));
        let __VLS_358;
        let __VLS_359;
        let __VLS_360;
        const __VLS_361 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentStep === 2))
                    return;
                __VLS_ctx.handleRemoveUnit(row.id);
            }
        };
        __VLS_357.slots.default;
        var __VLS_357;
        var __VLS_232;
        var __VLS_213;
    }
    var __VLS_209;
    var __VLS_205;
    var __VLS_188;
}
if (__VLS_ctx.currentStep === 3) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_362 = __VLS_asFunctionalComponent(Card, new Card({}));
    const __VLS_363 = __VLS_362({}, ...__VLS_functionalComponentArgsRest(__VLS_362));
    __VLS_364.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_365 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({}));
    const __VLS_366 = __VLS_365({}, ...__VLS_functionalComponentArgsRest(__VLS_365));
    __VLS_367.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    var __VLS_367;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_368 = __VLS_asFunctionalComponent(CardContent, new CardContent({
        ...{ class: "space-y-5" },
    }));
    const __VLS_369 = __VLS_368({
        ...{ class: "space-y-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_368));
    __VLS_370.slots.default;
    if (__VLS_ctx.currentStepErrors.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive" },
        });
        (__VLS_ctx.currentStepErrors[0]);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid gap-4 md:grid-cols-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.shipTo),
    }));
    const __VLS_372 = __VLS_371({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.shipTo),
    }, ...__VLS_functionalComponentArgsRest(__VLS_371));
    let __VLS_374;
    let __VLS_375;
    let __VLS_376;
    const __VLS_377 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onCustomerInput('shipTo', $event);
        }
    };
    var __VLS_373;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_378 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.city),
    }));
    const __VLS_379 = __VLS_378({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.city),
    }, ...__VLS_functionalComponentArgsRest(__VLS_378));
    let __VLS_381;
    let __VLS_382;
    let __VLS_383;
    const __VLS_384 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onCustomerInput('city', $event);
        }
    };
    var __VLS_380;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5 md:col-span-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Textarea, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(Textarea, new Textarea({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.address),
    }));
    const __VLS_386 = __VLS_385({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.address),
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    let __VLS_388;
    let __VLS_389;
    let __VLS_390;
    const __VLS_391 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onCustomerInput('address', $event);
        }
    };
    var __VLS_387;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_392 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.contactName),
    }));
    const __VLS_393 = __VLS_392({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.contactName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_392));
    let __VLS_395;
    let __VLS_396;
    let __VLS_397;
    const __VLS_398 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onCustomerInput('contactName', $event);
        }
    };
    var __VLS_394;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_399 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.contactEmail),
    }));
    const __VLS_400 = __VLS_399({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.customer.contactEmail),
    }, ...__VLS_functionalComponentArgsRest(__VLS_399));
    let __VLS_402;
    let __VLS_403;
    let __VLS_404;
    const __VLS_405 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onCustomerInput('contactEmail', $event);
        }
    };
    var __VLS_401;
    /** @type {[typeof Separator, ]} */ ;
    // @ts-ignore
    const __VLS_406 = __VLS_asFunctionalComponent(Separator, new Separator({}));
    const __VLS_407 = __VLS_406({}, ...__VLS_functionalComponentArgsRest(__VLS_406));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2 text-sm" },
    });
    /** @type {[typeof Checkbox, ]} */ ;
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
        ...{ 'onUpdate:checked': {} },
        id: "copy-consignee",
        checked: (__VLS_ctx.copyConsignee),
    }));
    const __VLS_410 = __VLS_409({
        ...{ 'onUpdate:checked': {} },
        id: "copy-consignee",
        checked: (__VLS_ctx.copyConsignee),
    }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    let __VLS_412;
    let __VLS_413;
    let __VLS_414;
    const __VLS_415 = {
        'onUpdate:checked': (__VLS_ctx.toggleCopyConsignee)
    };
    var __VLS_411;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "copy-consignee",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid gap-4 md:grid-cols-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_416 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.consignee.shipTo),
        disabled: (__VLS_ctx.copyConsignee),
    }));
    const __VLS_417 = __VLS_416({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.consignee.shipTo),
        disabled: (__VLS_ctx.copyConsignee),
    }, ...__VLS_functionalComponentArgsRest(__VLS_416));
    let __VLS_419;
    let __VLS_420;
    let __VLS_421;
    const __VLS_422 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onConsigneeInput('shipTo', $event);
        }
    };
    var __VLS_418;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_423 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.consignee.city),
        disabled: (__VLS_ctx.copyConsignee),
    }));
    const __VLS_424 = __VLS_423({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.consignee.city),
        disabled: (__VLS_ctx.copyConsignee),
    }, ...__VLS_functionalComponentArgsRest(__VLS_423));
    let __VLS_426;
    let __VLS_427;
    let __VLS_428;
    const __VLS_429 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 3))
                return;
            __VLS_ctx.onConsigneeInput('city', $event);
        }
    };
    var __VLS_425;
    var __VLS_370;
    var __VLS_364;
}
if (__VLS_ctx.currentStep === 4) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_430 = __VLS_asFunctionalComponent(Card, new Card({}));
    const __VLS_431 = __VLS_430({}, ...__VLS_functionalComponentArgsRest(__VLS_430));
    __VLS_432.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({}));
    const __VLS_434 = __VLS_433({}, ...__VLS_functionalComponentArgsRest(__VLS_433));
    __VLS_435.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    var __VLS_435;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent(CardContent, new CardContent({
        ...{ class: "space-y-4" },
    }));
    const __VLS_437 = __VLS_436({
        ...{ class: "space-y-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    __VLS_438.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap items-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "min-w-[240px] flex-1 space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.recipientEmailInput),
        placeholder: "Add email address",
    }));
    const __VLS_440 = __VLS_439({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.recipientEmailInput),
        placeholder: "Add email address",
    }, ...__VLS_functionalComponentArgsRest(__VLS_439));
    let __VLS_442;
    let __VLS_443;
    let __VLS_444;
    const __VLS_445 = {
        onInput: (__VLS_ctx.onRecipientInput)
    };
    var __VLS_441;
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_446 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_447 = __VLS_446({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_446));
    let __VLS_449;
    let __VLS_450;
    let __VLS_451;
    const __VLS_452 = {
        onClick: (__VLS_ctx.handleAddRecipient)
    };
    __VLS_448.slots.default;
    var __VLS_448;
    if (__VLS_ctx.recipients.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-wrap gap-2" },
        });
        for (const [email] of __VLS_getVForSourceType((__VLS_ctx.recipients))) {
            /** @type {[typeof Badge, typeof Badge, ]} */ ;
            // @ts-ignore
            const __VLS_453 = __VLS_asFunctionalComponent(Badge, new Badge({
                key: (email),
                variant: "secondary",
                ...{ class: "gap-2" },
            }));
            const __VLS_454 = __VLS_453({
                key: (email),
                variant: "secondary",
                ...{ class: "gap-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_453));
            __VLS_455.slots.default;
            (email);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.currentStep === 4))
                            return;
                        if (!!(__VLS_ctx.recipients.length === 0))
                            return;
                        __VLS_ctx.handleRemoveRecipient(email);
                    } },
                type: "button",
                ...{ class: "text-xs text-muted-foreground" },
            });
            var __VLS_455;
        }
    }
    var __VLS_438;
    var __VLS_432;
}
if (__VLS_ctx.currentStep === 5) {
    /** @type {[typeof Card, typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_456 = __VLS_asFunctionalComponent(Card, new Card({}));
    const __VLS_457 = __VLS_456({}, ...__VLS_functionalComponentArgsRest(__VLS_456));
    __VLS_458.slots.default;
    /** @type {[typeof CardHeader, typeof CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_459 = __VLS_asFunctionalComponent(CardHeader, new CardHeader({}));
    const __VLS_460 = __VLS_459({}, ...__VLS_functionalComponentArgsRest(__VLS_459));
    __VLS_461.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-semibold" },
    });
    var __VLS_461;
    /** @type {[typeof CardContent, typeof CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_462 = __VLS_asFunctionalComponent(CardContent, new CardContent({
        ...{ class: "space-y-5" },
    }));
    const __VLS_463 = __VLS_462({
        ...{ class: "space-y-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_462));
    __VLS_464.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid gap-4 md:grid-cols-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Select, typeof Select, ]} */ ;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent(Select, new Select({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.signature.creator),
    }));
    const __VLS_466 = __VLS_465({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.signature.creator),
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
    let __VLS_468;
    let __VLS_469;
    let __VLS_470;
    const __VLS_471 = {
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 5))
                return;
            __VLS_ctx.onSignatureSelect('creator', $event);
        }
    };
    __VLS_467.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "michella",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "aditya",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "rani",
    });
    var __VLS_467;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_472 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.signature.timestamp),
        type: "datetime-local",
    }));
    const __VLS_473 = __VLS_472({
        ...{ 'onInput': {} },
        value: (__VLS_ctx.signature.timestamp),
        type: "datetime-local",
    }, ...__VLS_functionalComponentArgsRest(__VLS_472));
    let __VLS_475;
    let __VLS_476;
    let __VLS_477;
    const __VLS_478 = {
        onInput: (...[$event]) => {
            if (!(__VLS_ctx.currentStep === 5))
                return;
            __VLS_ctx.onSignatureInput('timestamp', $event);
        }
    };
    var __VLS_474;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid gap-2 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Checkbox, ]} */ ;
    // @ts-ignore
    const __VLS_479 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.customerPickup),
    }));
    const __VLS_480 = __VLS_479({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.customerPickup),
    }, ...__VLS_functionalComponentArgsRest(__VLS_479));
    let __VLS_482;
    let __VLS_483;
    let __VLS_484;
    const __VLS_485 = {
        'onUpdate:checked': ((v) => __VLS_ctx.onSignatureCheck('customerPickup', v))
    };
    var __VLS_481;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Checkbox, ]} */ ;
    // @ts-ignore
    const __VLS_486 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.invoiceRequired),
    }));
    const __VLS_487 = __VLS_486({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.invoiceRequired),
    }, ...__VLS_functionalComponentArgsRest(__VLS_486));
    let __VLS_489;
    let __VLS_490;
    let __VLS_491;
    const __VLS_492 = {
        'onUpdate:checked': ((v) => __VLS_ctx.onSignatureCheck('invoiceRequired', v))
    };
    var __VLS_488;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {[typeof Checkbox, ]} */ ;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.packingListRequired),
    }));
    const __VLS_494 = __VLS_493({
        ...{ 'onUpdate:checked': {} },
        checked: (__VLS_ctx.signature.packingListRequired),
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    let __VLS_496;
    let __VLS_497;
    let __VLS_498;
    const __VLS_499 = {
        'onUpdate:checked': ((v) => __VLS_ctx.onSignatureCheck('packingListRequired', v))
    };
    var __VLS_495;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1.5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm font-medium" },
    });
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_500 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onChange': {} },
        type: "file",
        accept: "application/pdf",
    }));
    const __VLS_501 = __VLS_500({
        ...{ 'onChange': {} },
        type: "file",
        accept: "application/pdf",
    }, ...__VLS_functionalComponentArgsRest(__VLS_500));
    let __VLS_503;
    let __VLS_504;
    let __VLS_505;
    const __VLS_506 = {
        onChange: (__VLS_ctx.onFileChange)
    };
    var __VLS_502;
    if (__VLS_ctx.uploadedFileName) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-muted-foreground" },
        });
        (__VLS_ctx.uploadedFileName);
    }
    var __VLS_464;
    var __VLS_458;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur lg:left-72" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_507 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "ghost",
}));
const __VLS_508 = __VLS_507({
    ...{ 'onClick': {} },
    variant: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_507));
let __VLS_510;
let __VLS_511;
let __VLS_512;
const __VLS_513 = {
    onClick: (__VLS_ctx.onCancel)
};
__VLS_509.slots.default;
var __VLS_509;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap items-center gap-2" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_514 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    variant: "secondary",
}));
const __VLS_515 = __VLS_514({
    ...{ 'onClick': {} },
    variant: "secondary",
}, ...__VLS_functionalComponentArgsRest(__VLS_514));
let __VLS_517;
let __VLS_518;
let __VLS_519;
const __VLS_520 = {
    onClick: (__VLS_ctx.handleSaveDraft)
};
__VLS_516.slots.default;
var __VLS_516;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.onSubmitIntent) },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: (!__VLS_ctx.canSubmit ? 'pointer-events-none opacity-50' : '') },
}));
const __VLS_522 = __VLS_521({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: (!__VLS_ctx.canSubmit ? 'pointer-events-none opacity-50' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
let __VLS_524;
let __VLS_525;
let __VLS_526;
const __VLS_527 = {
    onClick: (__VLS_ctx.handleSubmit)
};
__VLS_523.slots.default;
var __VLS_523;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-24']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['right-6']} */ ;
/** @type {__VLS_StyleScopedClasses['top-6']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[120]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.16em]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-fit']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:top-20']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-6']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-border']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['last:pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-muted/50']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-destructive/40']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-destructive/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-destructive/40']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-destructive/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border/60']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
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
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
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
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-destructive/40']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-destructive/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[240px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background/95']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:left-72']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Check: Check,
            MoreHorizontal: MoreHorizontal,
            Plus: Plus,
            Accordion: Accordion,
            AccordionContent: AccordionContent,
            AccordionItem: AccordionItem,
            AccordionTrigger: AccordionTrigger,
            Badge: Badge,
            Button: Button,
            Card: Card,
            CardContent: CardContent,
            CardHeader: CardHeader,
            Checkbox: Checkbox,
            Dialog: Dialog,
            Input: Input,
            Select: Select,
            Separator: Separator,
            Stepper: Stepper,
            StepperDescription: StepperDescription,
            StepperIndicator: StepperIndicator,
            StepperItem: StepperItem,
            StepperTitle: StepperTitle,
            StepperTrigger: StepperTrigger,
            Textarea: Textarea,
            Toast: Toast,
            PageHeader: PageHeader,
            steps: steps,
            unitOptions: unitOptions,
            currentStep: currentStep,
            showSubmitDialog: showSubmitDialog,
            showCancelDialog: showCancelDialog,
            showIncompleteSteps: showIncompleteSteps,
            copyConsignee: copyConsignee,
            recipientEmailInput: recipientEmailInput,
            recipients: recipients,
            uploadedFileName: uploadedFileName,
            toast: toast,
            requestFields: requestFields,
            unitRows: unitRows,
            customer: customer,
            consignee: consignee,
            signature: signature,
            canSubmit: canSubmit,
            currentStepErrors: currentStepErrors,
            handleNext: handleNext,
            handleBack: handleBack,
            handleAddUnit: handleAddUnit,
            handleRemoveUnit: handleRemoveUnit,
            handleAddRecipient: handleAddRecipient,
            handleRemoveRecipient: handleRemoveRecipient,
            handleSaveDraft: handleSaveDraft,
            handleSubmit: handleSubmit,
            handleConfirmSubmit: handleConfirmSubmit,
            onRequestSelect: onRequestSelect,
            onRequestInput: onRequestInput,
            onUnitSelect: onUnitSelect,
            onUnitInput: onUnitInput,
            onUnitTextarea: onUnitTextarea,
            onUnitNumber: onUnitNumber,
            updateUnitQuantity: updateUnitQuantity,
            getExtendedPrice: getExtendedPrice,
            onCustomerInput: onCustomerInput,
            onConsigneeInput: onConsigneeInput,
            toggleCopyConsignee: toggleCopyConsignee,
            onRecipientInput: onRecipientInput,
            onSignatureSelect: onSignatureSelect,
            onSignatureInput: onSignatureInput,
            onSignatureCheck: onSignatureCheck,
            onFileChange: onFileChange,
            stepIsCompleted: stepIsCompleted,
            stepIsIncomplete: stepIsIncomplete,
            onStepperChange: onStepperChange,
            onCancel: onCancel,
            confirmCancel: confirmCancel,
            onSubmitIntent: onSubmitIntent,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
