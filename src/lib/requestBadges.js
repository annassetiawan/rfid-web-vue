import { getWorkflowStatusBadgeClass } from '@/lib/statusBadges';
export const getRequestStatusBadgeClass = (status) => {
    return getWorkflowStatusBadgeClass(status);
};
