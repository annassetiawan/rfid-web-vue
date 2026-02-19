<template>
  <FilterSheet
    :model-value="modelValue"
    title="Filters"
    description="Refine inventory rows with targeted criteria."
    reset-label="Clear filters"
    @update:model-value="$emit('update:modelValue', $event)"
    @apply="onApply"
    @reset="onClear"
  >
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Inventory Status</label>
      <Select :value="draft.inventoryStatus" @change="onSelectChange('inventoryStatus', $event)">
        <option value="">All</option>
        <option v-for="status in options.inventoryStatus" :key="status" :value="status">{{ status }}</option>
      </Select>
    </div>
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Location</label>
      <Select :value="draft.location" @change="onSelectChange('location', $event)">
        <option value="">All</option>
        <option v-for="location in options.location" :key="location" :value="location">{{ location }}</option>
      </Select>
    </div>
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Condition</label>
      <Select :value="draft.condition" @change="onSelectChange('condition', $event)">
        <option value="">All</option>
        <option v-for="condition in options.condition" :key="condition" :value="condition">{{ condition }}</option>
      </Select>
    </div>
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Staging Status</label>
      <Select :value="draft.stagingStatus" @change="onSelectChange('stagingStatus', $event)">
        <option value="">All</option>
        <option v-for="stage in options.stagingStatus" :key="stage" :value="stage">{{ stage }}</option>
      </Select>
    </div>
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Warehouse Location</label>
      <Select :value="draft.warehouseLocation" @change="onSelectChange('warehouseLocation', $event)">
        <option value="">All</option>
        <option v-for="warehouse in options.warehouseLocation" :key="warehouse" :value="warehouse">{{ warehouse }}</option>
      </Select>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Date From</label>
        <Input :value="draft.dateFrom" type="date" @input="onInputChange('dateFrom', $event)" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Date To</label>
        <Input :value="draft.dateTo" type="date" @input="onInputChange('dateTo', $event)" />
      </div>
    </div>
  </FilterSheet>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'

type InventoryFilters = {
  inventoryStatus: string
  location: string
  condition: string
  stagingStatus: string
  warehouseLocation: string
  dateFrom: string
  dateTo: string
}

const props = defineProps<{
  modelValue: boolean
  filters: InventoryFilters
  options: {
    inventoryStatus: string[]
    location: string[]
    condition: string[]
    stagingStatus: string[]
    warehouseLocation: string[]
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  apply: [filters: InventoryFilters]
  clear: []
}>()

const draft = reactive<InventoryFilters>({
  inventoryStatus: '',
  location: '',
  condition: '',
  stagingStatus: '',
  warehouseLocation: '',
  dateFrom: '',
  dateTo: '',
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      Object.assign(draft, props.filters)
    }
  },
)

watch(
  () => props.filters,
  (next) => {
    if (!props.modelValue) {
      Object.assign(draft, next)
    }
  },
  { deep: true },
)

const onClear = () => {
  Object.assign(draft, {
    inventoryStatus: '',
    location: '',
    condition: '',
    stagingStatus: '',
    warehouseLocation: '',
    dateFrom: '',
    dateTo: '',
  })
  emit('clear')
  emit('update:modelValue', false)
}

const onApply = () => {
  emit('apply', { ...draft })
  emit('update:modelValue', false)
}

const onSelectChange = (key: keyof InventoryFilters, event: Event) => {
  const target = event.target as HTMLSelectElement
  draft[key] = target.value
}

const onInputChange = (key: keyof InventoryFilters, event: Event) => {
  const target = event.target as HTMLInputElement
  draft[key] = target.value
}
</script>
