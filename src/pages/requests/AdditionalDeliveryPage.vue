<template>
  <main class="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
      <PageHeader
        title="Create Additional Delivery Request"
        description="Ship additional accessories for an existing processed delivery."
      >
        <template #actions>
          <Badge variant="secondary">Draft</Badge>
        </template>
      </PageHeader>
    </section>

    <section class="space-y-4">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold tracking-tight">Parent Request</h3>
        <p class="text-sm text-muted-foreground">Select a processed delivery request as the parent reference.</p>
        <Separator />
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card class="rounded-xl lg:col-span-2">
          <CardHeader class="p-6 pb-3">
            <h4 class="text-sm font-semibold">Select parent request</h4>
            <p class="text-sm text-muted-foreground">Choose a processed delivery request as the parent.</p>
          </CardHeader>
          <CardContent class="space-y-3 p-6 pt-0">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">
                Parent Request <span class="text-destructive">*</span>
              </label>
              <SimpleCombobox
                v-model="selectedParentRequestId"
                :options="parentRequestOptions"
                placeholder="Select processed delivery request..."
                search-placeholder="Search request number or customer..."
                :invalid="submitAttempted && !selectedParentRequest"
              />
              <p class="text-xs text-muted-foreground">Only processed delivery requests are shown.</p>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl lg:col-span-1">
          <CardHeader class="p-6 pb-3">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-sm font-semibold">Request summary</h4>
              <Badge v-if="selectedParentRequest" variant="outline" :class="requestStatusBadgeClass(selectedParentRequest.status)">
                {{ selectedParentRequest.status }}
              </Badge>
              <Badge v-else variant="outline">No selection</Badge>
            </div>
          </CardHeader>
          <CardContent class="p-6 pt-0">
            <div v-if="!selectedParentRequest" class="rounded-lg border border-dashed border-border/80 bg-muted/10 p-4">
              <p class="text-sm font-medium">No parent request selected</p>
              <p class="mt-1 text-sm text-muted-foreground">
                Pick a processed request on the left to preview customer, warehouse, status, and date.
              </p>
            </div>

            <dl v-else class="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-3">
              <dt class="text-sm text-muted-foreground">Customer</dt>
              <dd class="text-sm font-medium">{{ selectedParentRequest.customerName }}</dd>

              <dt class="text-sm text-muted-foreground">Warehouse</dt>
              <dd class="text-sm font-medium">{{ selectedParentRequest.warehouse }}</dd>

              <dt class="text-sm text-muted-foreground">Status</dt>
              <dd class="text-sm font-medium">
                <Badge variant="outline" :class="requestStatusBadgeClass(selectedParentRequest.status)">
                  {{ selectedParentRequest.status }}
                </Badge>
              </dd>

              <dt class="text-sm text-muted-foreground">Date</dt>
              <dd class="text-sm font-medium">{{ selectedParentRequest.date }}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="space-y-4">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold tracking-tight">Accessories to Ship</h3>
        <p class="text-sm text-muted-foreground">Add accessory line items for the selected parent request.</p>
        <Separator />
      </div>

      <Card
        class="rounded-xl transition-opacity"
        :class="!selectedParentRequest ? 'opacity-50' : ''"
      >
        <CardHeader class="p-6 pb-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h4 class="text-base font-semibold">Accessories to ship</h4>
              <p class="text-sm text-muted-foreground">Line items for additional accessories in this request.</p>
            </div>
            <Button variant="outline" size="sm" :disabled="!selectedParentRequest" @click="addLineItem">
              <Plus class="h-4 w-4" />
              Add accessory
            </Button>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 p-6 pt-0" :class="!selectedParentRequest ? 'pointer-events-none' : ''">
          <div v-if="!selectedParentRequest" class="rounded-lg border border-dashed border-border/80 bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
            Select a parent request first.
          </div>

          <div class="hidden grid-cols-12 gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-2 lg:grid">
            <div class="lg:col-span-7 text-xs font-medium text-muted-foreground">Accessory Type</div>
            <div class="lg:col-span-2 text-xs font-medium text-muted-foreground">Qty</div>
            <div class="lg:col-span-2 text-xs font-medium text-muted-foreground">Available</div>
            <div class="lg:col-span-1 text-right text-xs font-medium text-muted-foreground">Actions</div>
          </div>

          <div
            v-for="item in lineItems"
            :key="item.id"
            class="rounded-xl border border-border/60 bg-background p-4"
          >
            <div class="grid grid-cols-1 gap-4 items-end md:grid-cols-[1fr_160px_120px_44px]">
              <div class="space-y-1.5">
                <label class="text-sm font-medium">Accessory Type <span class="text-destructive">*</span></label>
                <SimpleCombobox
                  v-model="item.accessoryId"
                  :options="accessoryOptionsForCombobox"
                  placeholder="Search accessory..."
                  search-placeholder="Search accessory..."
                  :invalid="showLineError(item).accessory"
                  :disabled="!selectedParentRequest"
                />
                <p v-if="showLineError(item).accessory" class="text-xs text-destructive">
                  Accessory type is required.
                </p>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium">Quantity <span class="text-destructive">*</span></label>
                <Input
                  :value="String(item.qty)"
                  type="number"
                  min="1"
                  class="w-full text-right"
                  :class="showLineError(item).qty ? '!border-destructive ring-1 ring-destructive/20' : ''"
                  :disabled="!selectedParentRequest"
                  @input="onQtyInput(item.id, $event)"
                />
                <p v-if="showLineError(item).qty" class="text-xs text-destructive">Quantity must be at least 1.</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-muted-foreground">Available</label>
                <div class="flex items-center">
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="availabilityUi(item).chipClass"
                  >
                    {{ availabilityUi(item).label }}
                  </span>
                </div>
                <p
                  v-if="selectedParentRequest"
                  class="truncate text-[11px] text-muted-foreground"
                  :title="`At ${selectedParentRequest.warehouse}`"
                >
                  At {{ selectedParentRequest.warehouse }}
                </p>
                <p v-if="showLineError(item).exceed" class="text-xs text-destructive">
                  Quantity exceeds available stock.
                </p>
              </div>

              <div class="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive"
                  :disabled="lineItems.length <= 1 || !selectedParentRequest"
                  @click="removeLineItem(item.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Note (optional)</label>
            <Textarea
              :value="note"
              rows="3"
              :disabled="!selectedParentRequest"
              :placeholder="`Additional accessories for ${selectedParentRequest?.id ?? 'selected request'}`"
              @input="onNoteInput"
            />
          </div>
        </CardContent>
      </Card>
    </section>

    <Separator />

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-muted-foreground">{{ footerHint }}</p>
      <div class="flex items-center justify-end gap-2">
        <Button variant="outline" @click="router.push('/requests/local')">Cancel</Button>
        <Button :disabled="!canSubmit" @click="onSubmit">
          <SendHorizontal class="h-4 w-4" />
          Create Additional Request
        </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus, SendHorizontal, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/list/PageHeader.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Input from '@/components/ui/Input.vue'
import Separator from '@/components/ui/Separator.vue'
import SimpleCombobox, { type SimpleComboboxOption } from '@/components/ui/SimpleCombobox.vue'
import Textarea from '@/components/ui/Textarea.vue'

type ParentRequest = {
  id: string
  customerName: string
  warehouse: string
  status: 'Processed'
  date: string
}

type AccessoryOption = {
  id: string
  name: string
  available: number
}

type LineItem = {
  id: string
  accessoryId: string
  qty: number
}

const router = useRouter()

const parentRequests: ParentRequest[] = [
  { id: 'E470721', customerName: 'Palo Alto Networks', warehouse: 'UPS Indonesia', status: 'Processed', date: 'Oct 30, 2024' },
  { id: 'E470722', customerName: 'Cisco Systems', warehouse: 'UPS Taiwan', status: 'Processed', date: 'Nov 02, 2024' },
  { id: 'E470723', customerName: 'Fortinet', warehouse: 'Teckwah JP', status: 'Processed', date: 'Nov 05, 2024' },
]

const accessoryOptions: AccessoryOption[] = [
  { id: 'acc-pwr-ac', name: 'PAN-WF-500-PWR-AC', available: 12 },
  { id: 'acc-rack-kit', name: 'Rack Mount Kit', available: 8 },
  { id: 'acc-console', name: 'Console Cable RJ45', available: 20 },
  { id: 'acc-sfp', name: 'SFP Module 10G', available: 4 },
]

const parentRequestOptions = computed<SimpleComboboxOption[]>(() =>
  parentRequests.map((item) => ({
    value: item.id,
    label: `${item.id} · ${item.customerName} · ${item.date}`,
    description: `${item.warehouse} · ${item.status}`,
  })),
)

const accessoryOptionsForCombobox = computed<SimpleComboboxOption[]>(() =>
  accessoryOptions.map((item) => ({
    value: item.id,
    label: item.name,
    description: `Available: ${item.available}`,
  })),
)

const selectedParentRequestId = ref('')
const selectedParentRequest = computed(
  () => parentRequests.find((item) => item.id === selectedParentRequestId.value) ?? null,
)

const note = ref('')
const submitAttempted = ref(false)
let lineSeq = 2

const lineItems = reactive<LineItem[]>([
  { id: 'line-1', accessoryId: '', qty: 1 },
])

const getAccessory = (accessoryId: string) => accessoryOptions.find((item) => item.id === accessoryId) ?? null
const getAvailable = (item: LineItem) => getAccessory(item.accessoryId)?.available ?? '-'
const availabilityUi = (item: LineItem) => {
  const available = getAccessory(item.accessoryId)?.available
  const requestedQty = Number.isFinite(item.qty) ? item.qty : 0

  if (available === null || available === undefined) {
    return {
      label: '—',
      chipClass: 'border border-border bg-muted text-muted-foreground',
    }
  }

  if (available <= 0) {
    return {
      label: 'Out of stock',
      chipClass: 'border border-rose-200/70 bg-rose-50 text-rose-700',
    }
  }

  if (requestedQty > 0 && available < requestedQty) {
    return {
      label: `Only ${available} left`,
      chipClass: 'border border-amber-200/70 bg-amber-50 text-amber-700',
    }
  }

  return {
    label: `${available} available`,
    chipClass: 'border border-emerald-200/70 bg-emerald-50 text-emerald-700',
  }
}

const lineError = (item: LineItem) => {
  const acc = getAccessory(item.accessoryId)
  return {
    accessory: !item.accessoryId,
    qty: !Number.isFinite(item.qty) || item.qty < 1,
    exceed: Boolean(acc) && item.qty > acc.available,
  }
}

const showLineError = (item: LineItem) => {
  if (!submitAttempted.value) return { accessory: false, qty: false, exceed: false }
  return lineError(item)
}

const allLineItemsValid = computed(() =>
  lineItems.length > 0 && lineItems.every((item) => {
    const err = lineError(item)
    return !err.accessory && !err.qty && !err.exceed
  }),
)

const canSubmit = computed(() => Boolean(selectedParentRequest.value) && allLineItemsValid.value)

const footerHint = computed(() => {
  if (!selectedParentRequest.value) return 'Select a parent request to start adding accessories.'
  if (!allLineItemsValid.value) return 'Complete all line items with valid quantities before creating the request.'
  return 'Ready to create additional delivery request.'
})

const requestStatusBadgeClass = (status: ParentRequest['status']) => {
  if (status === 'Processed') return 'border-emerald-200/70 bg-emerald-50 text-emerald-700'
  return ''
}

const addLineItem = () => {
  if (!selectedParentRequest.value) return
  lineItems.push({ id: `line-${lineSeq++}`, accessoryId: '', qty: 1 })
}

const removeLineItem = (id: string) => {
  const idx = lineItems.findIndex((item) => item.id === id)
  if (idx < 0 || lineItems.length <= 1) return
  lineItems.splice(idx, 1)
}

const onQtyInput = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const row = lineItems.find((item) => item.id === id)
  if (!row) return
  const value = Number(target.value)
  row.qty = Number.isFinite(value) ? value : 0
}

const onNoteInput = (event: Event) => {
  note.value = (event.target as HTMLTextAreaElement).value
}

const onSubmit = () => {
  submitAttempted.value = true
  if (!canSubmit.value || !selectedParentRequest.value) return

  const payload = {
    parentRequestId: selectedParentRequest.value.id,
    note: note.value.trim(),
    lineItems: lineItems.map((item) => ({
      accessoryId: item.accessoryId,
      qty: item.qty,
    })),
  }
  console.info('Create Additional Delivery payload', payload)
  router.push('/requests/local')
}
</script>
