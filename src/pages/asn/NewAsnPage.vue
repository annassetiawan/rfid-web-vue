<template>
  <main class="container max-w-7xl py-6">
    <Card class="rounded-lg">
      <CardHeader class="border-b border-border/70">
        <div class="flex items-center justify-between gap-3">
          <h1 class="text-xl font-semibold tracking-tight">Create Advanced Shipping Notice</h1>
          <Button variant="outline" size="sm" @click="goBack">
            <ArrowLeft class="h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>

      <CardContent class="space-y-6 pt-6">
        <div class="grid gap-4 lg:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Source Location <span class="text-destructive">*</span></label>
            <Input v-model="form.sourceLocation" placeholder="e.g. Supplier Name / City" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Destination Warehouse <span class="text-destructive">*</span></label>
            <Select v-model="form.destinationWarehouse">
              <option value="">-- Select Warehouse --</option>
              <option value="UPS Indonesia">UPS Indonesia</option>
              <option value="UPS Taiwan">UPS Taiwan</option>
              <option value="Teckwah JP">Teckwah JP</option>
              <option value="Warehouse A">Warehouse A</option>
            </Select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Expected Arrival Date</label>
            <Input v-model="form.expectedArrivalDate" type="date" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Carrier Name</label>
            <Input v-model="form.carrierName" placeholder="e.g. JNE, TIKI, DHL" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Tracking Number</label>
            <Input v-model="form.trackingNumber" placeholder="Carrier tracking number" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium">Notes</label>
            <Textarea
              :value="form.notes"
              placeholder="Any additional notes..."
              rows="2"
              @input="onNotesInput"
            />
          </div>
        </div>

        <Separator />

        <section class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-base font-semibold">Items <span class="text-destructive">*</span></h2>
            <Button variant="outline" size="sm" @click="addItemRow">
              <Plus class="h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div class="overflow-x-auto overflow-y-hidden rounded-lg border bg-card">
            <table class="w-full min-w-[980px] text-sm">
              <thead class="bg-muted/30">
                <tr class="h-10 border-b border-border">
                  <th class="w-[40px] px-2 text-left text-xs font-medium text-foreground">#</th>
                  <th class="px-2 text-left text-xs font-medium text-foreground">Unit <span class="text-destructive">*</span></th>
                  <th class="w-[160px] px-2 text-left text-xs font-medium text-foreground">Expected Qty <span class="text-destructive">*</span></th>
                  <th class="px-2 text-left text-xs font-medium text-foreground">Notes</th>
                  <th class="w-[64px] px-2 text-right text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in form.items"
                  :key="item.id"
                  class="h-12 border-b border-border/60 last:border-b-0"
                >
                  <td class="px-2 py-2 align-middle text-sm">{{ index + 1 }}</td>
                  <td class="px-2 py-2 align-middle">
                    <Select v-model="item.unit">
                      <option value="">Type to search units...</option>
                      <option v-for="unit in unitOptions" :key="unit" :value="unit">{{ unit }}</option>
                    </Select>
                  </td>
                  <td class="px-2 py-2 align-middle">
                    <Input
                      :value="String(item.expectedQty)"
                      type="number"
                      min="1"
                      @input="onItemQtyInput(item.id, $event)"
                    />
                  </td>
                  <td class="px-2 py-2 align-middle">
                    <Input :value="item.notes" placeholder="Optional note" @input="onItemNotesInput(item.id, $event)" />
                  </td>
                  <td class="px-2 py-2 align-middle text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 text-rose-600 hover:text-rose-700"
                      :disabled="form.items.length <= 1"
                      @click="removeItemRow(item.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="flex items-center justify-end gap-2 border-t border-border/70 pt-4">
          <Button variant="outline" @click="goBack">Cancel</Button>
          <Button @click="createAsn">
            <SendHorizontal class="h-4 w-4" />
            Create ASN
          </Button>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ArrowLeft, Plus, SendHorizontal, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Textarea from '@/components/ui/Textarea.vue'

type AsnItemRow = {
  id: string
  unit: string
  expectedQty: number
  notes: string
}

const router = useRouter()

const unitOptions = [
  'Laptop ThinkPad T14',
  'Router Cisco ISR 4331',
  'Barcode Scanner Zebra DS2208',
  'RFID Reader Impinj R700',
  'Printer Zebra ZD421',
]

const createItem = (seq: number): AsnItemRow => ({
  id: `item-${seq}`,
  unit: '',
  expectedQty: 1,
  notes: '',
})

const form = reactive({
  sourceLocation: '',
  destinationWarehouse: '',
  expectedArrivalDate: '',
  carrierName: '',
  trackingNumber: '',
  notes: '',
  items: [createItem(1)] as AsnItemRow[],
})

let itemSeq = 2

const goBack = () => {
  router.push('/asn')
}

const addItemRow = () => {
  form.items.push(createItem(itemSeq++))
}

const removeItemRow = (id: string) => {
  if (form.items.length <= 1) return
  const next = form.items.filter((item) => item.id !== id)
  form.items.splice(0, form.items.length, ...next)
}

const onNotesInput = (event: Event) => {
  form.notes = (event.target as HTMLTextAreaElement).value
}

const onItemNotesInput = (id: string, event: Event) => {
  const row = form.items.find((item) => item.id === id)
  if (!row) return
  row.notes = (event.target as HTMLInputElement).value
}

const onItemQtyInput = (id: string, event: Event) => {
  const row = form.items.find((item) => item.id === id)
  if (!row) return
  const value = Number((event.target as HTMLInputElement).value)
  row.expectedQty = Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
}

const createAsn = () => {
  console.info('Create ASN payload', JSON.parse(JSON.stringify(form)))
  router.push('/asn')
}
</script>
