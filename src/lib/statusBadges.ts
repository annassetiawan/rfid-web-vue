const baseBadgeClass = 'border font-medium whitespace-nowrap !rounded-md'

type BadgeTone = 'emerald' | 'blue' | 'amber' | 'violet' | 'indigo' | 'rose' | 'slate'

const toneClassMap: Record<BadgeTone, string> = {
  emerald: `${baseBadgeClass} bg-emerald-50 text-emerald-700 border-emerald-200`,
  blue: `${baseBadgeClass} bg-blue-50 text-blue-700 border-blue-200`,
  amber: `${baseBadgeClass} bg-amber-50 text-amber-800 border-amber-200`,
  violet: `${baseBadgeClass} bg-violet-50 text-violet-700 border-violet-200`,
  indigo: `${baseBadgeClass} bg-indigo-50 text-indigo-700 border-indigo-200`,
  rose: `${baseBadgeClass} bg-rose-50 text-rose-700 border-rose-200`,
  slate: `${baseBadgeClass} bg-slate-50 text-slate-700 border-slate-200`,
}

const tone = (value: BadgeTone) => toneClassMap[value]
const normalized = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-')

export const getInventoryBadgeClass = (value: string) => {
  if (value === 'In Stock') return tone('emerald')
  if (value === 'In Transit') return tone('blue')
  if (value === 'Reserved') return tone('amber')
  if (value === 'Assigned') return tone('violet')
  return tone('slate')
}

export const getConditionBadgeClass = (value: string) => {
  if (value === 'Good') return tone('emerald')
  if (value === 'Damaged') return tone('rose')
  if (value === 'Refurbished') return tone('indigo')
  if (value === 'Needs Check') return tone('amber')
  return tone('slate')
}

export const getStagingBadgeClass = (value: string) => {
  if (value === 'Received') return tone('emerald')
  if (value === 'Inbound') return tone('blue')
  if (value === 'Outbound') return tone('indigo')
  if (value === 'Hold') return tone('slate')
  if (value === 'Assigned') return tone('violet')
  return tone('slate')
}

export const getActiveBadgeClass = (value: string) => {
  if (normalized(value) === 'active') return tone('emerald')
  if (normalized(value) === 'inactive') return tone('slate')
  return tone('slate')
}

export const getWorkflowStatusBadgeClass = (value: string) => {
  const status = normalized(value)
  if (['active', 'approved', 'in-stock', 'received', 'good'].includes(status)) return tone('emerald')
  if (['in-progress', 'in-transit', 'inbound'].includes(status)) return tone('blue')
  if (['pending', 'new', 'reserved', 'needs-check'].includes(status)) return tone('amber')
  if (['completed', 'assigned', 'outbound', 'refurbished'].includes(status)) return tone('violet')
  if (['rejected', 'damaged'].includes(status)) return tone('rose')
  if (['inactive', 'hold', 'canceled', 'cancelled'].includes(status)) return tone('slate')
  return tone('slate')
}

export const getSearchTypeBadgeClass = (value: string) => {
  const status = normalized(value)
  if (status === 'inventory') return tone('indigo')
  if (status === 'request') return tone('violet')
  if (status === 'cycle-count') return tone('blue')
  if (status === 'scanner') return tone('amber')
  return tone('slate')
}
