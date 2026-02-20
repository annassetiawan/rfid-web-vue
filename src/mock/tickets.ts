export type TicketType = 'bug' | 'request' | 'question'
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCommentVisibility = 'public' | 'internal'

export type TicketComment = {
  id: string
  author: string
  message: string
  createdAt: string
  visibility: TicketCommentVisibility
}

export type Ticket = {
  id: string
  subject: string
  requestorName: string
  requestorEmail: string
  type: TicketType
  category: string
  subcategory: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignee?: string
  createdAt: string
  updatedAt: string
  comments: TicketComment[]
}

const categories = ['Request', 'Inventory', 'Warehouse', 'Scanner', 'Cycle Count']
const subjects = [
  'Scanner sync failed on inbound dock',
  'Need new tag allocation workflow',
  'Inventory mismatch after retagging',
  'Warehouse mapping not updated',
  'Cycle count report export error',
  'Need permission update for operator',
]
const requestors = ['Kamal', 'Ayu', 'Rizal', 'Dina', 'Farhan', 'Nadia', 'Mika']
const types: TicketType[] = ['bug', 'request', 'question']
const statuses: TicketStatus[] = ['open', 'in-progress', 'resolved', 'closed']
const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent']

const dateOf = (seed: number) => `2026-02-${String((seed % 27) + 1).padStart(2, '0')}`

export const ticketsMock: Ticket[] = Array.from({ length: 28 }).map((_, index) => {
  const requestorName = requestors[index % requestors.length]
  const requestorEmail = `${requestorName.toLowerCase()}@rfidops.com`
  const createdAt = dateOf(index + 2)
  const type = types[index % types.length]
  const category = categories[index % categories.length]
  const status = statuses[index % statuses.length]
  const priority = priorities[index % priorities.length]
  const id = `TCK-2026-${String(index + 1).padStart(4, '0')}`

  return {
    id,
    subject: subjects[index % subjects.length],
    requestorName,
    requestorEmail,
    type,
    category,
    subcategory: `${category} Ops`,
    description: `Issue detail for ${id}. Please review and follow standard support workflow.`,
    status,
    priority,
    assignee: index % 3 === 0 ? undefined : requestors[(index + 2) % requestors.length],
    createdAt,
    updatedAt: dateOf(index + 6),
    comments: index % 4 === 0
      ? [{
          id: `${id}-C1`,
          author: 'System',
          message: 'Ticket created and routed to support queue.',
          createdAt: `${createdAt} 09:30`,
          visibility: 'public',
        }]
      : [],
  }
})
