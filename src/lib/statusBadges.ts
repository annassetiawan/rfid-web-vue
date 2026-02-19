const baseBadgeClass = 'border font-medium whitespace-nowrap !rounded-md'

export const getInventoryBadgeClass = (value: string) => {
  if (value === 'In Stock') return `${baseBadgeClass} bg-emerald-50 text-emerald-700 border-emerald-200`
  if (value === 'In Transit') return `${baseBadgeClass} bg-blue-50 text-blue-700 border-blue-200`
  if (value === 'Reserved') return `${baseBadgeClass} bg-amber-50 text-amber-800 border-amber-200`
  if (value === 'Assigned') return `${baseBadgeClass} bg-violet-50 text-violet-700 border-violet-200`
  return `${baseBadgeClass} bg-slate-50 text-slate-700 border-slate-200`
}

export const getConditionBadgeClass = (value: string) => {
  if (value === 'Good') return `${baseBadgeClass} bg-emerald-50 text-emerald-700 border-emerald-200`
  if (value === 'Damaged') return `${baseBadgeClass} bg-rose-50 text-rose-700 border-rose-200`
  if (value === 'Refurbished') return `${baseBadgeClass} bg-indigo-50 text-indigo-700 border-indigo-200`
  if (value === 'Needs Check') return `${baseBadgeClass} bg-amber-50 text-amber-800 border-amber-200`
  return `${baseBadgeClass} bg-slate-50 text-slate-700 border-slate-200`
}

export const getStagingBadgeClass = (value: string) => {
  if (value === 'Received') return `${baseBadgeClass} bg-emerald-50 text-emerald-700 border-emerald-200`
  if (value === 'Inbound') return `${baseBadgeClass} bg-blue-50 text-blue-700 border-blue-200`
  if (value === 'Outbound') return `${baseBadgeClass} bg-indigo-50 text-indigo-700 border-indigo-200`
  if (value === 'Hold') return `${baseBadgeClass} bg-slate-100 text-slate-700 border-slate-200`
  if (value === 'Assigned') return `${baseBadgeClass} bg-violet-50 text-violet-700 border-violet-200`
  return `${baseBadgeClass} bg-slate-50 text-slate-700 border-slate-200`
}

export const getActiveBadgeClass = (value: string) => {
  if (value === 'active') return `${baseBadgeClass} bg-emerald-50 text-emerald-700 border-emerald-200`
  if (value === 'inactive') return `${baseBadgeClass} bg-slate-100 text-slate-700 border-slate-200`
  return `${baseBadgeClass} bg-slate-50 text-slate-700 border-slate-200`
}
