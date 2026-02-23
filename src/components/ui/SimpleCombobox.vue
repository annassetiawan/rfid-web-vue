<template>
  <div ref="anchorRef" class="relative">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      :class="[
        open ? 'border-ring' : 'border-input',
        invalid ? 'border-destructive ring-1 ring-destructive/30' : '',
      ]"
      :disabled="disabled"
      @click="toggleOpen"
    >
      <div class="min-w-0">
        <p v-if="selectedOption" class="truncate font-medium">{{ selectedOption.label }}</p>
        <p v-else class="truncate text-muted-foreground">{{ placeholder }}</p>
        <p v-if="selectedOption?.description" class="truncate text-xs text-muted-foreground">
          {{ selectedOption.description }}
        </p>
      </div>
      <ChevronsUpDown class="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[90]"
        @mousedown="onBackdropPointerDown"
      />
      <div
        v-if="open"
        ref="panelRef"
        class="fixed z-[100] rounded-lg border bg-popover p-2 text-popover-foreground shadow-md"
        :style="panelStyle"
      >
        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="query"
            type="text"
            :placeholder="searchPlaceholder"
            class="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            @mousedown.stop
          />
        </div>

        <div class="mt-2 max-h-64 overflow-y-auto">
          <button
            v-if="clearable"
            type="button"
            class="flex w-full items-start rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            @click="selectOption('')"
          >
            <span class="text-muted-foreground">Clear selection</span>
          </button>

          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            class="flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
            @click="selectOption(option.value)"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">{{ option.label }}</p>
              <p v-if="option.description" class="truncate text-xs text-muted-foreground">{{ option.description }}</p>
            </div>
            <Check v-if="option.value === modelValue" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          </button>

          <p v-if="filteredOptions.length === 0" class="px-3 py-3 text-sm text-muted-foreground">
            No results found.
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Check, ChevronsUpDown, Search } from 'lucide-vue-next'

export type SimpleComboboxOption = {
  value: string
  label: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: SimpleComboboxOption[]
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    invalid?: boolean
    clearable?: boolean
  }>(),
  {
    placeholder: 'Select option...',
    searchPlaceholder: 'Search...',
    disabled: false,
    invalid: false,
    clearable: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const anchorRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const query = ref('')
const panelStyle = ref<Record<string, string>>({})

const selectedOption = computed(() => props.options.find((item) => item.value === props.modelValue) ?? null)
const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((item) => {
    const hay = `${item.label} ${item.description ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})

const updatePanelPosition = () => {
  const anchor = anchorRef.value
  if (!anchor) return
  const rect = anchor.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

const close = () => {
  open.value = false
  query.value = ''
}

const toggleOpen = async () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    await nextTick()
    updatePanelPosition()
  }
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  close()
}

const onBackdropPointerDown = () => {
  close()
}

const onWindowChange = () => {
  if (!open.value) return
  updatePanelPosition()
}

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('resize', onWindowChange)
      window.addEventListener('scroll', onWindowChange, true)
    } else {
      window.removeEventListener('resize', onWindowChange)
      window.removeEventListener('scroll', onWindowChange, true)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})
</script>
