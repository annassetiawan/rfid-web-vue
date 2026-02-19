import type { RequestStatus } from '@/mock/requests'
import { getWorkflowStatusBadgeClass } from '@/lib/statusBadges'

export const getRequestStatusBadgeClass = (status: RequestStatus) => {
  return getWorkflowStatusBadgeClass(status)
}
