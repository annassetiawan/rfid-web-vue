<template>
  <main class="container relative max-w-7xl py-6 pb-24">
    <Toast
      v-if="toast.message"
      :title="toast.message"
      :description="toast.description"
      class="fixed right-6 top-6 z-[120]"
    />

    <Dialog v-model="showSubmitDialog">
      <h3 class="text-lg font-semibold">Submit Request?</h3>
      <p class="mt-1 text-sm text-muted-foreground">Confirm submission. This will return you to the request list.</p>
      <div class="mt-6 flex items-center justify-end gap-2">
        <Button variant="outline" @click="showSubmitDialog = false">Cancel</Button>
        <Button @click="handleConfirmSubmit">Confirm Submit</Button>
      </div>
    </Dialog>
    <Dialog v-model="showCancelDialog">
      <h3 class="text-lg font-semibold">Cancel Request?</h3>
      <p class="mt-1 text-sm text-muted-foreground">Unsaved changes will be lost. Continue?</p>
      <div class="mt-6 flex items-center justify-end gap-2">
        <Button variant="outline" @click="showCancelDialog = false">Stay</Button>
        <Button variant="destructive" @click="confirmCancel">Leave</Button>
      </div>
    </Dialog>

    <section class="space-y-3 pb-6">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
      <PageHeader
        title="Create New Local Request"
        description="Draft in progress - Local time reflects your current timezone"
      >
        <template #actions>
          <Badge variant="secondary">Draft</Badge>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <Card class="h-fit lg:sticky lg:top-20">
        <CardHeader class="space-y-1.5">
          <h2 class="text-base font-semibold">Request Steps</h2>
          <p class="text-sm text-muted-foreground">Complete each section before submission.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="relative">
            <div class="absolute bottom-4 left-6 top-4 z-0 w-px bg-border" />
            <Stepper
              :model-value="currentStep"
              orientation="vertical"
              :linear="false"
              class="relative z-10 w-full flex-col items-start gap-0"
              @update:model-value="onStepperChange"
            >
              <StepperItem
                v-for="step in steps"
                :key="step.id"
                :step="step.id"
                class="relative w-full items-start pb-4 last:pb-0"
              >
                <StepperTrigger class="w-full items-start p-0 text-left">
                  <div
                    class="flex w-full items-start gap-3 rounded-md border border-transparent px-2 py-2 hover:bg-muted/50"
                    :class="showIncompleteSteps && stepIsIncomplete(step.id) ? 'border-destructive/50 bg-destructive/5' : ''"
                  >
                    <StepperIndicator class="h-8 w-8 border border-border bg-background">
                      <Check v-if="stepIsCompleted(step.id)" class="h-4 w-4" />
                      <span v-else>{{ step.id }}</span>
                    </StepperIndicator>
                    <div class="flex min-w-0 flex-col gap-1 pt-0.5">
                      <StepperTitle class="text-sm leading-none">
                        {{ step.label }}
                      </StepperTitle>
                      <StepperDescription class="text-xs">
                        {{ step.helper }}
                      </StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>
              </StepperItem>
            </Stepper>
          </div>
          <Separator />
          <div class="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" :disabled="currentStep === 1" @click="handleBack">Back</Button>
            <Button size="sm" :disabled="currentStep === steps.length" @click="handleNext">Next</Button>
          </div>
        </CardContent>
      </Card>

      <div class="space-y-6 lg:col-span-2">
      <Card v-if="currentStep === 1">
        <CardHeader>
          <h2 class="text-lg font-semibold">Request</h2>
        </CardHeader>
        <CardContent class="space-y-5">
          <p v-if="currentStepErrors.length" class="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {{ currentStepErrors[0] }}
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Ship From *</label>
              <Select :value="requestFields.shipFrom" @change="onRequestSelect('shipFrom', $event)">
                <option value="">Select ship from</option>
                <option value="jakarta">Jakarta Hub</option>
                <option value="bandung">Bandung DC</option>
                <option value="surabaya">Surabaya Hub</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Request Number *</label>
              <Input :value="requestFields.requestNumber" readonly />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Request Type *</label>
              <Select :value="requestFields.requestType" @change="onRequestSelect('requestType', $event)">
                <option value="">Select type</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Service Level *</label>
              <Select :value="requestFields.serviceLevel" @change="onRequestSelect('serviceLevel', $event)">
                <option value="">Select level</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="priority">Priority</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Request Date *</label>
              <Input :value="requestFields.requestDate" type="datetime-local" @input="onRequestInput('requestDate', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Ship Date *</label>
              <Input :value="requestFields.shipDate" type="datetime-local" @input="onRequestInput('shipDate', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Mode of Transport *</label>
              <Select :value="requestFields.modeTransport" @change="onRequestSelect('modeTransport', $event)">
                <option value="">Select mode</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
                <option value="land">Land</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Freight Forwarder *</label>
              <Select :value="requestFields.freightForwarder" @change="onRequestSelect('freightForwarder', $event)">
                <option value="">Select forwarder</option>
                <option value="dhl">DHL Supply Chain</option>
                <option value="jnt">JNT Logistics</option>
                <option value="sicepat">SiCepat Cargo</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">AWB</label>
              <Input :value="requestFields.awb" placeholder="Optional AWB" @input="onRequestInput('awb', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">License</label>
              <Select :value="requestFields.license" @change="onRequestSelect('license', $event)">
                <option value="">Select license</option>
                <option value="enc">ENC</option>
                <option value="nlr">NLR</option>
              </Select>
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-medium">Note</label>
              <Textarea :value="requestFields.note" placeholder="Request note" @input="onRequestInput('note', $event)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card v-if="currentStep === 2">
        <CardHeader class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">Unit Details</h2>
            <Button variant="outline" size="sm" @click="handleAddUnit">
              <Plus class="h-4 w-4" />
              Add Unit
            </Button>
          </div>
          <p class="text-sm text-muted-foreground">Add units that will be included in this request.</p>
        </CardHeader>
        <CardContent>
          <p v-if="currentStepErrors.length" class="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {{ currentStepErrors[0] }}
          </p>
          <Accordion type="multiple" class="rounded-lg border border-border/60 bg-card">
            <AccordionItem v-for="(row, index) in unitRows" :key="row.id" :value="row.id" class="px-4">
              <AccordionTrigger>
                <div class="flex w-full flex-wrap items-center justify-between gap-3">
                  <div class="flex flex-col text-left">
                    <span class="text-sm font-semibold">{{ row.unit || `Unit ${index + 1}` }}</span>
                    <span class="text-xs text-muted-foreground">Serial: {{ row.serial || '-' }} - Qty: {{ row.quantity }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Total: ${{ getExtendedPrice(row) }}</span>
                    <Button variant="ghost" size="icon" class="h-8 w-8" @click.stop.prevent="handleRemoveUnit(row.id)">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div class="grid gap-4 pb-4 lg:grid-cols-2">
                  <div class="space-y-4">
                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Unit *</label>
                      <Select :value="row.unit" @change="onUnitSelect(row.id, 'unit', $event)">
                        <option value="">Select unit</option>
                        <option v-for="unit in unitOptions" :key="unit" :value="unit">{{ unit }}</option>
                      </Select>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Serial Number *</label>
                      <Input :value="row.serial" placeholder="Enter serial number" @input="onUnitInput(row.id, 'serial', $event)" />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Quantity</label>
                      <div class="flex items-center gap-2">
                        <Button variant="outline" size="icon" @click="updateUnitQuantity(row.id, row.quantity - 1)">-</Button>
                        <Input class="w-16 text-center" :value="String(row.quantity)" @input="onUnitNumber(row.id, 'quantity', $event)" />
                        <Button variant="outline" size="icon" @click="updateUnitQuantity(row.id, row.quantity + 1)">+</Button>
                      </div>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Description</label>
                      <Textarea
                        :value="row.description"
                        placeholder="Add a unit description"
                        @input="onUnitTextarea(row.id, 'description', $event)"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">Classification Code</label>
                        <Input :value="row.classificationCode" placeholder="e.g. 8471.30" @input="onUnitInput(row.id, 'classificationCode', $event)" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">ECCN</label>
                        <Input :value="row.eccn" placeholder="e.g. 5A992" @input="onUnitInput(row.id, 'eccn', $event)" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">License</label>
                        <Select :value="row.license" @change="onUnitSelect(row.id, 'license', $event)">
                          <option value="enc">ENC</option>
                          <option value="n/a">N/A</option>
                        </Select>
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">Country of Origin</label>
                        <Input :value="row.countryOfOrigin" placeholder="e.g. Indonesia" @input="onUnitInput(row.id, 'countryOfOrigin', $event)" />
                      </div>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">Unit Price</label>
                        <Input :value="row.unitPrice" placeholder="0.00" @input="onUnitInput(row.id, 'unitPrice', $event)" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-sm font-medium">Extended Price</label>
                        <Input :value="getExtendedPrice(row)" readonly />
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Dimension</label>
                      <div class="grid gap-2 sm:grid-cols-4">
                        <Input :value="row.length" placeholder="L" @input="onUnitInput(row.id, 'length', $event)" />
                        <Input :value="row.width" placeholder="W" @input="onUnitInput(row.id, 'width', $event)" />
                        <Input :value="row.height" placeholder="H" @input="onUnitInput(row.id, 'height', $event)" />
                        <Select :value="row.dimensionUnit" @change="onUnitSelect(row.id, 'dimensionUnit', $event)">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </Select>
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <label class="text-sm font-medium">Unit Weight</label>
                      <div class="grid gap-2 sm:grid-cols-2">
                        <Input :value="row.unitWeight" placeholder="Weight" @input="onUnitInput(row.id, 'unitWeight', $event)" />
                        <Select :value="row.weightUnit" @change="onUnitSelect(row.id, 'weightUnit', $event)">
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </Select>
                      </div>
                    </div>

                    <div class="flex justify-end">
                      <Button variant="outline" @click="handleRemoveUnit(row.id)">Remove</Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card v-if="currentStep === 3">
        <CardHeader>
          <h2 class="text-lg font-semibold">Ship To</h2>
        </CardHeader>
        <CardContent class="space-y-5">
          <p v-if="currentStepErrors.length" class="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {{ currentStepErrors[0] }}
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Customer Company *</label>
              <Input :value="customer.shipTo" @input="onCustomerInput('shipTo', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">City *</label>
              <Input :value="customer.city" @input="onCustomerInput('city', $event)" />
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-medium">Address *</label>
              <Textarea :value="customer.address" @input="onCustomerInput('address', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Contact Name *</label>
              <Input :value="customer.contactName" @input="onCustomerInput('contactName', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Contact Email *</label>
              <Input :value="customer.contactEmail" @input="onCustomerInput('contactEmail', $event)" />
            </div>
          </div>

          <Separator />

          <div class="flex items-center gap-2 text-sm">
            <Checkbox id="copy-consignee" :checked="copyConsignee" @update:checked="toggleCopyConsignee" />
            <label for="copy-consignee">Copy consignee from customer</label>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Consignee Company *</label>
              <Input :value="consignee.shipTo" :disabled="copyConsignee" @input="onConsigneeInput('shipTo', $event)" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Consignee City *</label>
              <Input :value="consignee.city" :disabled="copyConsignee" @input="onConsigneeInput('city', $event)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card v-if="currentStep === 4">
        <CardHeader>
          <h2 class="text-lg font-semibold">Additional Recipients</h2>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap items-end gap-2">
            <div class="min-w-[240px] flex-1 space-y-1.5">
              <label class="text-sm font-medium">Recipient Email</label>
              <Input :value="recipientEmailInput" placeholder="Add email address" @input="onRecipientInput" />
            </div>
            <Button variant="outline" @click="handleAddRecipient">Add</Button>
          </div>

          <div v-if="recipients.length === 0" class="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            No additional recipients added yet.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <Badge v-for="email in recipients" :key="email" variant="secondary" class="gap-2">
              {{ email }}
              <button type="button" class="text-xs text-muted-foreground" @click="handleRemoveRecipient(email)">x</button>
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card v-if="currentStep === 5">
        <CardHeader>
          <h2 class="text-lg font-semibold">Signature & Attachments</h2>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Delivery Creator</label>
              <Select :value="signature.creator" @change="onSignatureSelect('creator', $event)">
                <option value="michella">Michella</option>
                <option value="aditya">Aditya</option>
                <option value="rani">Rani</option>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Timestamp</label>
              <Input :value="signature.timestamp" type="datetime-local" @input="onSignatureInput('timestamp', $event)" />
            </div>
          </div>

          <div class="grid gap-2 text-sm">
            <label class="flex items-center gap-2">
              <Checkbox :checked="signature.customerPickup" @update:checked="(v) => onSignatureCheck('customerPickup', v)" />
              Customer Pickup
            </label>
            <label class="flex items-center gap-2">
              <Checkbox :checked="signature.invoiceRequired" @update:checked="(v) => onSignatureCheck('invoiceRequired', v)" />
              Invoice Required
            </label>
            <label class="flex items-center gap-2">
              <Checkbox :checked="signature.packingListRequired" @update:checked="(v) => onSignatureCheck('packingListRequired', v)" />
              Packing List Required
            </label>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Upload File (PDF)</label>
            <Input type="file" accept="application/pdf" @change="onFileChange" />
            <p v-if="uploadedFileName" class="text-sm text-muted-foreground">{{ uploadedFileName }}</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </section>

    <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur lg:left-72">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="ghost" @click="onCancel">Cancel</Button>
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="secondary" @click="handleSaveDraft">Save Draft</Button>
          <div @click="onSubmitIntent">
            <Button :disabled="!canSubmit" :class="!canSubmit ? 'pointer-events-none opacity-50' : ''" @click="handleSubmit">Submit</Button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Check, MoreHorizontal, Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import Textarea from '@/components/ui/Textarea.vue'
import Toast from '@/components/ui/Toast.vue'
import PageHeader from '@/components/list/PageHeader.vue'

type Step = 1 | 2 | 3 | 4 | 5

type RequestFields = {
  shipFrom: string
  requestNumber: string
  requestType: string
  serviceLevel: string
  requestDate: string
  shipDate: string
  modeTransport: string
  freightForwarder: string
  awb: string
  license: string
  note: string
}

type UnitRow = {
  id: string
  unit: string
  serial: string
  quantity: number
  description: string
  classificationCode: string
  eccn: string
  license: string
  countryOfOrigin: string
  unitPrice: string
  dimensionUnit: 'cm' | 'in'
  length: string
  width: string
  height: string
  weightUnit: 'kg' | 'lbs'
  unitWeight: string
}

type Address = {
  shipTo: string
  city: string
  address: string
  contactName: string
  contactEmail: string
}

type SignatureFields = {
  creator: string
  timestamp: string
  customerPickup: boolean
  invoiceRequired: boolean
  packingListRequired: boolean
}

type StepConfig = {
  id: Step
  label: string
  helper: string
  requiredFields: string[]
}

const draftStorageKey = 'local-request-draft'
const router = useRouter()

const steps: StepConfig[] = [
  { id: 1, label: 'Request', helper: 'Request details', requiredFields: ['shipFrom', 'requestType', 'serviceLevel', 'requestDate', 'shipDate', 'modeTransport', 'freightForwarder'] },
  { id: 2, label: 'Unit Details', helper: 'Add units', requiredFields: ['unit', 'serial', 'quantity'] },
  { id: 3, label: 'Ship To', helper: 'Destination info', requiredFields: ['shipTo', 'city', 'address', 'contactName', 'contactEmail'] },
  { id: 4, label: 'Recipients', helper: 'Additional emails', requiredFields: [] },
  { id: 5, label: 'Signature', helper: 'Finalize request', requiredFields: [] },
]
const unitOptions = ['RFID Reader', 'RFID Tag', 'Handheld Scanner', 'Dock Door Portal']

const currentStep = ref<Step>(1)
const showSubmitDialog = ref(false)
const showCancelDialog = ref(false)
const showIncompleteSteps = ref(false)
const invalidSteps = ref<Step[]>([])
const copyConsignee = ref(true)
const recipientEmailInput = ref('')
const recipients = ref<string[]>([])
const uploadedFileName = ref('')
const toast = reactive({
  message: '',
  description: '',
})
let toastTimer: number | undefined

const requestFields = reactive<RequestFields>({
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
})

const unitRows = ref<UnitRow[]>([
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
])

const customer = reactive<Address>({
  shipTo: '',
  city: '',
  address: '',
  contactName: '',
  contactEmail: '',
})

const consignee = reactive<Address>({
  shipTo: '',
  city: '',
  address: '',
  contactName: '',
  contactEmail: '',
})

const signature = reactive<SignatureFields>({
  creator: 'michella',
  timestamp: '',
  customerPickup: false,
  invoiceRequired: false,
  packingListRequired: false,
})

const isFinalStep = computed(() => currentStep.value === steps.length)
const canSubmit = computed(() => isFinalStep.value && allStepsValid.value)
const currentStepErrors = computed(() => validateStep(currentStep.value))
const allStepsValid = computed(() => steps.every((step) => validateStep(step.id).length === 0))

const goToStep = (stepId: Step) => {
  currentStep.value = stepId
}

const handleNext = () => {
  const errors = validateStep(currentStep.value)
  if (errors.length > 0) {
    showIncompleteSteps.value = true
    recomputeInvalidSteps()
    showToast('Please complete required fields', errors[0])
    return
  }
  currentStep.value = (Math.min(5, currentStep.value + 1) as Step)
}

const handleBack = () => {
  currentStep.value = (Math.max(1, currentStep.value - 1) as Step)
}

const handleAddUnit = () => {
  const next = unitRows.value.length + 1
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
  })
}

const handleRemoveUnit = (id: string) => {
  if (unitRows.value.length === 1) return
  unitRows.value = unitRows.value.filter((row) => row.id !== id)
}

const handleAddRecipient = () => {
  const value = recipientEmailInput.value.trim()
  if (!value || recipients.value.includes(value)) return
  recipients.value.push(value)
  recipientEmailInput.value = ''
}

const handleRemoveRecipient = (email: string) => {
  recipients.value = recipients.value.filter((item) => item !== email)
}

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
  }
  localStorage.setItem(draftStorageKey, JSON.stringify(payload))
  showToast('Draft saved', 'Your request draft has been saved locally.')
}

const handleSubmit = () => {
  if (!canSubmit.value) {
    onSubmitIntent()
    return
  }
  showSubmitDialog.value = true
}

const handleConfirmSubmit = () => {
  localStorage.removeItem(draftStorageKey)
  showSubmitDialog.value = false
  router.push('/requests/local')
}

const onRequestSelect = (key: keyof RequestFields, event: Event) => {
  const target = event.target as HTMLSelectElement
  requestFields[key] = target.value
}

const onRequestInput = (key: keyof RequestFields, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  requestFields[key] = target.value
}

const onUnitSelect = (id: string, key: keyof UnitRow, event: Event) => {
  const target = event.target as HTMLSelectElement
  unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row))
}

const onUnitInput = (id: string, key: keyof UnitRow, event: Event) => {
  const target = event.target as HTMLInputElement
  unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row))
}

const onUnitTextarea = (id: string, key: keyof UnitRow, event: Event) => {
  const target = event.target as HTMLTextAreaElement
  unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: target.value } : row))
}

const onUnitNumber = (id: string, key: keyof UnitRow, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Math.max(1, Number(target.value || 1))
  unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, [key]: value } : row))
}

const updateUnitQuantity = (id: string, quantity: number) => {
  const safeQuantity = Math.max(1, quantity)
  unitRows.value = unitRows.value.map((row) => (row.id === id ? { ...row, quantity: safeQuantity } : row))
}

const getExtendedPrice = (row: UnitRow) => {
  const price = Number(row.unitPrice || 0)
  return (price * row.quantity).toFixed(2)
}

const onCustomerInput = (key: keyof Address, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  customer[key] = target.value
  if (copyConsignee.value) {
    consignee[key] = target.value
  }
}

const onConsigneeInput = (key: keyof Address, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  consignee[key] = target.value
}

const toggleCopyConsignee = (checked: boolean) => {
  copyConsignee.value = checked
  if (copyConsignee.value) {
    Object.assign(consignee, customer)
  }
}

const onRecipientInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  recipientEmailInput.value = target.value
}

const onSignatureSelect = (key: keyof SignatureFields, event: Event) => {
  const target = event.target as HTMLSelectElement
  signature[key] = target.value as never
}

const onSignatureInput = (key: keyof SignatureFields, event: Event) => {
  const target = event.target as HTMLInputElement
  signature[key] = target.value as never
}

const onSignatureCheck = (key: keyof SignatureFields, checked: boolean) => {
  signature[key] = checked as never
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  uploadedFileName.value = target.files?.[0]?.name ?? ''
}

const stepIsCompleted = (stepId: Step) => validateStep(stepId).length === 0 && stepId < currentStep.value
const stepIsIncomplete = (stepId: Step) => invalidSteps.value.includes(stepId)

const validateStep = (stepId: Step): string[] => {
  if (stepId === 1) {
    const missing: string[] = []
    if (!requestFields.shipFrom) missing.push('Ship From is required.')
    if (!requestFields.requestType) missing.push('Request Type is required.')
    if (!requestFields.serviceLevel) missing.push('Service Level is required.')
    if (!requestFields.requestDate) missing.push('Request Date is required.')
    if (!requestFields.shipDate) missing.push('Ship Date is required.')
    if (!requestFields.modeTransport) missing.push('Mode of Transport is required.')
    if (!requestFields.freightForwarder) missing.push('Freight Forwarder is required.')
    return missing
  }

  if (stepId === 2) {
    if (unitRows.value.length === 0) return ['At least one unit is required.']
    const hasInvalid = unitRows.value.some((row) => !row.unit || !row.serial || row.quantity < 1)
    return hasInvalid ? ['Each unit requires Unit, Serial Number, and Quantity.'] : []
  }

  if (stepId === 3) {
    const customerMissing = ['shipTo', 'city', 'address', 'contactName', 'contactEmail']
      .some((key) => !customer[key as keyof Address])
    if (customerMissing) return ['Complete all required customer fields in Ship To step.']

    if (!copyConsignee.value) {
      const consigneeMissing = ['shipTo', 'city', 'address', 'contactName', 'contactEmail']
        .some((key) => !consignee[key as keyof Address])
      if (consigneeMissing) return ['Complete all required consignee fields or enable copy from customer.']
    }
  }

  return []
}

const recomputeInvalidSteps = () => {
  invalidSteps.value = steps
    .filter((step) => validateStep(step.id).length > 0)
    .map((step) => step.id)
}

const canNavigateToStep = (nextStep: number) => {
  for (let step = 1; step < nextStep; step += 1) {
    if (validateStep(step as Step).length > 0) return false
  }
  return true
}

const onStepperChange = (next: number | undefined) => {
  if (!next || next === currentStep.value) return
  if (canNavigateToStep(next)) {
    currentStep.value = next as Step
    return
  }
  showIncompleteSteps.value = true
  recomputeInvalidSteps()
  showToast('Complete previous steps first', 'Please finish required fields before jumping ahead.')
}

const onCancel = () => {
  showCancelDialog.value = true
}

const confirmCancel = () => {
  localStorage.removeItem(draftStorageKey)
  showCancelDialog.value = false
  router.push('/requests/local')
}

const onSubmitIntent = () => {
  if (canSubmit.value) return
  showIncompleteSteps.value = true
  recomputeInvalidSteps()
  showToast('Complete all steps before submitting', 'Finish required fields and move to the final step.')
}

const showToast = (message: string, description = '') => {
  toast.message = message
  toast.description = description
  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => {
    toast.message = ''
    toast.description = ''
  }, 2400)
}

const loadDraft = () => {
  const raw = localStorage.getItem(draftStorageKey)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if ([1, 2, 3, 4, 5].includes(parsed.currentStep)) currentStep.value = parsed.currentStep as Step
    if (parsed.requestFields) Object.assign(requestFields, parsed.requestFields)
    if (parsed.unitRows) unitRows.value = parsed.unitRows
    if (parsed.customer) Object.assign(customer, parsed.customer)
    if (parsed.consignee) Object.assign(consignee, parsed.consignee)
    if (typeof parsed.copyConsignee === 'boolean') copyConsignee.value = parsed.copyConsignee
    if (Array.isArray(parsed.recipients)) recipients.value = parsed.recipients
    if (parsed.signature) Object.assign(signature, parsed.signature)
  } catch {
    localStorage.removeItem(draftStorageKey)
  }
}

loadDraft()
</script>
