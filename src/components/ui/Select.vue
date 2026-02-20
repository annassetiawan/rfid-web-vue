<template>
  <ShadSelect :model-value="internalValue" :disabled="disabled" @update:model-value="onValueChange">
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="resolvedPlaceholder" />
    </SelectTrigger>
    <SelectContent class="rounded-lg">
      <SelectItem
        v-for="option in normalizedOptions"
        :key="option.key"
        :value="option.internalValue"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </ShadSelect>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots, type VNode } from 'vue'
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

defineOptions({ inheritAttrs: false })

type SelectOption = {
  key: string
  label: string
  value: string
  internalValue: string
  disabled: boolean
}

type ChangeEventLike = Event & {
  target: { value: string }
}

const EMPTY_VALUE = '__select-empty-value__'

const props = defineProps<{
  modelValue?: string | number | null
  value?: string | number | null
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [event: ChangeEventLike]
}>()

const attrs = useAttrs()
const slots = useSlots()

const stringifyValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

const stringifyAcceptableValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'object') {
    return ''
  }
  return String(value)
}

const toInternalValue = (value: string): string => {
  if (value === '') {
    return EMPTY_VALUE
  }
  return value
}

const toExternalValue = (value: string): string => {
  if (value === EMPTY_VALUE) {
    return ''
  }
  return value
}

const extractText = (node: VNode): string => {
  if (typeof node.children === 'string') {
    return node.children
  }
  if (!Array.isArray(node.children)) {
    return ''
  }
  return node.children
    .map((child) => {
      if (typeof child === 'string') {
        return child
      }
      if (typeof child === 'object' && child !== null) {
        return extractText(child as VNode)
      }
      return ''
    })
    .join('')
}

const readOptions = (nodes: VNode[] | undefined): SelectOption[] => {
  if (!nodes?.length) {
    return []
  }

  const options: SelectOption[] = []

  const walk = (items: VNode[]) => {
    for (const item of items) {
      if (typeof item.type === 'string' && item.type.toLowerCase() === 'option') {
        const propsMap = (item.props ?? {}) as Record<string, unknown>
        const value = stringifyValue((propsMap.value as string | number | null | undefined) ?? extractText(item))
        options.push({
          key: `${value}-${options.length}`,
          label: extractText(item).trim() || value,
          value,
          internalValue: toInternalValue(value),
          disabled: Boolean(propsMap.disabled),
        })
        continue
      }

      if (Array.isArray(item.children)) {
        walk(item.children as VNode[])
      }
    }
  }

  walk(nodes)
  return options
}

const normalizedOptions = computed(() => readOptions(slots.default?.()))

const resolvedValue = computed(() => stringifyValue(props.modelValue ?? props.value ?? ''))
const internalValue = computed(() => toInternalValue(resolvedValue.value))

const selectedOption = computed(() =>
  normalizedOptions.value.find((option) => option.value === resolvedValue.value),
)

const resolvedPlaceholder = computed(() => props.placeholder ?? selectedOption.value?.label ?? 'Select option')

const triggerClass = computed(() => {
  const attrClass = attrs.class
  return ['w-full', attrClass]
})

const onValueChange = (nextValue: unknown) => {
  const value = toExternalValue(stringifyAcceptableValue(nextValue))
  emit('update:modelValue', value)
  emit('change', { target: { value } } as ChangeEventLike)
}
</script>
