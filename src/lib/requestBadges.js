export const getRequestStatusBadgeClass = (status) => {
    if (status === 'new')
        return 'border border-amber-200 bg-amber-50 text-amber-800 font-medium whitespace-nowrap';
    if (status === 'approved')
        return 'border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium whitespace-nowrap';
    if (status === 'rejected')
        return 'border border-rose-200 bg-rose-50 text-rose-700 font-medium whitespace-nowrap';
    if (status === 'in-progress')
        return 'border border-blue-200 bg-blue-50 text-blue-700 font-medium whitespace-nowrap';
    return 'border border-slate-200 bg-slate-50 text-slate-700 font-medium whitespace-nowrap';
};
