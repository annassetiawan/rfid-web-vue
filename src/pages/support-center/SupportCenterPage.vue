<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Settings/Support</p>
      <PageHeader title="Support Center" description="Create and track support tickets for RFID operations.">
        <template #actions>
          <div class="flex items-center gap-2">
            <Button variant="outline" @click="onExportCsv">Export</Button>
            <Button @click="openCreate"><Plus class="h-4 w-4" />Create Ticket</Button>
          </div>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card class="rounded-lg"><CardHeader class="pb-2"><p class="text-sm text-muted-foreground">Open</p><p class="text-4xl font-semibold leading-none">{{ kpi.open }}</p></CardHeader><CardContent class="pt-0 text-sm text-muted-foreground">Awaiting investigation.</CardContent></Card>
      <Card class="rounded-lg"><CardHeader class="pb-2"><p class="text-sm text-muted-foreground">In Progress</p><p class="text-4xl font-semibold leading-none">{{ kpi.inProgress }}</p></CardHeader><CardContent class="pt-0 text-sm text-muted-foreground">Currently handled.</CardContent></Card>
      <Card class="rounded-lg"><CardHeader class="pb-2"><p class="text-sm text-muted-foreground">Resolved</p><p class="text-4xl font-semibold leading-none">{{ kpi.resolved }}</p></CardHeader><CardContent class="pt-0 text-sm text-muted-foreground">Resolved this period.</CardContent></Card>
      <Card class="rounded-lg"><CardHeader class="pb-2"><p class="text-sm text-muted-foreground">Avg Response</p><p class="text-4xl font-semibold leading-none">{{ kpi.avgResponse }}</p></CardHeader><CardContent class="pt-0 text-sm text-muted-foreground">Mock metric.</CardContent></Card>
    </div>

    <ListCard title="Support Tickets" description="Monitor incidents and support requests." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search ticket, subject, requestor..."
        :view-options="viewOptions"
        @open-filters="filtersOpen = true"
        @toggle:view-option="onToggleViewOption"
        @update:density="onDensityChange"
        @export-csv="onExportCsv"
        @export-excel="onExportExcel"
      />

      <p class="px-4 pb-2 text-sm text-muted-foreground">{{ table.getFilteredRowModel().rows.length }} results</p>
      <DataTable :table="table" :density="density" :wrap-text="false" empty-title="No tickets found" empty-description="Try adjusting filters." />
      <DataTablePagination :table="table" :density="density" :total-rows="table.getFilteredRowModel().rows.length" />
    </ListCard>

    <FilterSheet v-model="filtersOpen" title="Ticket Filters" description="Filter tickets by status, priority, type, category and date." reset-label="Reset" @apply="applyFilters" @reset="resetFilters">
      <div class="space-y-1.5"><label class="text-sm font-medium">Status</label><Select :value="draftFilters.status" @change="onFilterSelect('status', $event)"><option value="all">All</option><option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></Select></div>
      <div class="space-y-1.5"><label class="text-sm font-medium">Priority</label><Select :value="draftFilters.priority" @change="onFilterSelect('priority', $event)"><option value="all">All</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></Select></div>
      <div class="space-y-1.5"><label class="text-sm font-medium">Type</label><Select :value="draftFilters.type" @change="onFilterSelect('type', $event)"><option value="all">All</option><option value="bug">Bug</option><option value="request">Request</option><option value="question">Question</option></Select></div>
      <div class="space-y-1.5"><label class="text-sm font-medium">Category</label><Select :value="draftFilters.category" @change="onFilterSelect('category', $event)"><option value="all">All</option><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></Select></div>
      <div class="grid grid-cols-2 gap-3"><div class="space-y-1.5"><label class="text-sm font-medium">Created From</label><Input :value="draftFilters.createdFrom" type="date" @input="onFilterInput('createdFrom', $event)" /></div><div class="space-y-1.5"><label class="text-sm font-medium">Created To</label><Input :value="draftFilters.createdTo" type="date" @input="onFilterInput('createdTo', $event)" /></div></div>
    </FilterSheet>

    <Sheet v-model="detailOpen">
      <div v-if="selectedTicket" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <h2 class="text-xl font-semibold">{{ selectedTicket.id }} • {{ selectedTicket.subject }}</h2>
          <div class="flex items-center gap-2">
            <Badge variant="outline" :class="getTicketStatusBadgeClass(selectedTicket.status)">{{ ticketStatusLabelMap[selectedTicket.status] }}</Badge>
            <Badge variant="outline" :class="getTicketPriorityBadgeClass(selectedTicket.priority)">{{ ticketPriorityLabelMap[selectedTicket.priority] }}</Badge>
          </div>
        </div>
        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Overview</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div><p class="text-xs text-muted-foreground">Type</p><Badge variant="outline" :class="getTicketTypeBadgeClass(selectedTicket.type)">{{ ticketTypeLabelMap[selectedTicket.type] }}</Badge></div>
              <div><p class="text-xs text-muted-foreground">Category</p><p>{{ selectedTicket.category }}</p></div>
              <div><p class="text-xs text-muted-foreground">Requestor</p><p>{{ selectedTicket.requestorName }}</p></div>
              <div><p class="text-xs text-muted-foreground">Assignee</p><p>{{ selectedTicket.assignee || 'Unassigned' }}</p></div>
            </div>
            <p class="mt-3 text-sm">{{ selectedTicket.description }}</p>
          </section>
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Comments</h3>
            <div class="mt-3 space-y-3">
              <p v-if="selectedTicket.comments.length === 0" class="text-muted-foreground">No comments yet.</p>
              <div v-for="comment in selectedTicket.comments" :key="comment.id" class="rounded-md border border-border/60 p-3">
                <p class="text-xs text-muted-foreground">{{ comment.author }} • {{ comment.createdAt }}</p>
                <p class="mt-1">{{ comment.message }}</p>
              </div>
            </div>
            <div class="mt-3 space-y-2">
              <Textarea v-model="commentMessage" placeholder="Add comment" />
              <div class="flex items-center justify-between gap-2">
                <Select :value="commentVisibility" class="w-[180px]" @change="onCommentVisibilityChange"><option value="public">Public</option><option value="internal">Internal</option></Select>
                <Button @click="addComment">Add Comment</Button>
              </div>
            </div>
          </section>
        </div>
        <div class="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Select :value="selectedTicket.status" class="w-[160px]" @change="onDetailStatusChange"><option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></Select>
          <Select :value="selectedTicket.assignee || 'unassigned'" class="w-[190px]" @change="onDetailAssigneeChange"><option value="unassigned">Unassigned</option><option v-for="item in assigneeOptions" :key="item" :value="item">{{ item }}</option></Select>
          <Button variant="outline" @click="openEdit(selectedTicket)">Edit</Button>
          <Button variant="destructive" @click="openDelete(selectedTicket)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">Ticket not found.</div>
    </Sheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div><h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit Ticket' : 'Create Ticket' }}</h2><p class="text-sm text-muted-foreground">Create and update support tickets.</p></div>
        <div class="space-y-1.5"><label class="text-sm font-medium">Subject *</label><Input :value="formValues.subject" @input="onFormInput('subject', $event)" /></div>
        <div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label class="text-sm font-medium">Requestor Name *</label><Input :value="formValues.requestorName" @input="onFormInput('requestorName', $event)" /></div><div class="space-y-1.5"><label class="text-sm font-medium">Requestor Email *</label><Input :value="formValues.requestorEmail" type="email" @input="onFormInput('requestorEmail', $event)" /></div></div>
        <div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label class="text-sm font-medium">Type</label><Select :value="formValues.type" @change="onFormSelect('type', $event)"><option value="bug">Bug</option><option value="request">Request</option><option value="question">Question</option></Select></div><div class="space-y-1.5"><label class="text-sm font-medium">Priority</label><Select :value="formValues.priority" @change="onFormSelect('priority', $event)"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></Select></div></div>
        <div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label class="text-sm font-medium">Category</label><Select :value="formValues.category" @change="onFormSelect('category', $event)"><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></Select></div><div class="space-y-1.5"><label class="text-sm font-medium">Subcategory</label><Input :value="formValues.subcategory" @input="onFormInput('subcategory', $event)" /></div></div>
        <div class="space-y-1.5"><label class="text-sm font-medium">Description *</label><Textarea v-model="formValues.description" /></div>
        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>
        <div class="flex items-center justify-end gap-2"><Button variant="ghost" @click="closeForm">Cancel</Button><Button @click="saveTicket">{{ formMode === 'edit' ? 'Save Changes' : 'Create Ticket' }}</Button></div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div><h2 class="text-lg font-semibold">Delete Ticket</h2><p class="text-sm text-muted-foreground">Delete {{ deleteCandidate?.id || 'selected ticket' }}? This action is mock and cannot be undone.</p></div>
        <div class="flex items-center justify-end gap-2"><Button variant="ghost" @click="deleteOpen = false">Cancel</Button><Button variant="destructive" @click="confirmDelete">Delete</Button></div>
      </div>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { type ColumnDef, type ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type SortingState, useVueTable } from '@tanstack/vue-table'
import { CircleCheckBig, Clock3, LoaderCircle, Plus, Ticket } from 'lucide-vue-next'
import { createSupportTicketColumns, ticketPriorityLabelMap, ticketStatusLabelMap, ticketTypeLabelMap, type TicketTableRow } from '@/components/support-center/columns'
import DataTable from '@/components/inventory/DataTable.vue'
import DataTablePagination from '@/components/inventory/DataTablePagination.vue'
import DataTableToolbar from '@/components/inventory/DataTableToolbar.vue'
import FilterSheet from '@/components/list/FilterSheet.vue'
import ListCard from '@/components/list/ListCard.vue'
import PageHeader from '@/components/list/PageHeader.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Separator from '@/components/ui/Separator.vue'
import Sheet from '@/components/ui/Sheet.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { getTicketPriorityBadgeClass, getTicketStatusBadgeClass, getTicketTypeBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { ticketsMock, type Ticket as TicketModel, type TicketCommentVisibility, type TicketPriority, type TicketStatus, type TicketType } from '@/mock/tickets'
import { usersMock } from '@/mock/users'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'
type FilterState = { status: 'all' | TicketStatus; priority: 'all' | TicketPriority; type: 'all' | TicketType; category: string; createdFrom: string; createdTo: string }
type TicketFormState = { subject: string; requestorName: string; requestorEmail: string; type: TicketType; category: string; subcategory: string; description: string; priority: TicketPriority }

const DENSITY_STORAGE_KEY = 'table-density:support-tickets'
const VIEW_STORAGE_KEY = 'table-view:support-tickets'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const defaultFilters: FilterState = { status: 'all', priority: 'all', type: 'all', category: 'all', createdFrom: '', createdTo: '' }
const defaultForm: TicketFormState = { subject: '', requestorName: '', requestorEmail: '', type: 'request', category: 'Request', subcategory: '', description: '', priority: 'medium' }

const tickets = ref<TicketModel[]>([...ticketsMock])
const density = ref<Density>(loadDensity())
const showTicketId = ref(true); const showRequestor = ref(true); const showType = ref(true); const showCategory = ref(true); const showCreated = ref(true); const showStatus = ref(true); const showPriority = ref(true); const showRowNumbers = ref(true)
const filtersOpen = ref(false); const detailOpen = ref(false); const formOpen = ref(false); const deleteOpen = ref(false)
const selectedTicketId = ref<string | null>(null); const deleteCandidate = ref<TicketModel | null>(null)
const formMode = ref<FormMode>('create'); const editingId = ref<string | null>(null); const formError = ref('')
const commentMessage = ref(''); const commentVisibility = ref<TicketCommentVisibility>('public')
const filters = reactive<FilterState>({ ...defaultFilters }); const draftFilters = reactive<FilterState>({ ...defaultFilters }); const formValues = reactive<TicketFormState>({ ...defaultForm })
const rowSelection = ref({}); const columnVisibility = ref<Record<string, boolean>>({}); const columnFilters = ref<ColumnFiltersState>([]); const sorting = ref<SortingState>([]); const pagination = ref({ pageIndex: 0, pageSize: 10 })

loadViewState()
columnVisibility.value = { number: showRowNumbers.value, searchText: false, id: showTicketId.value, requestor: showRequestor.value, type: showType.value, category: showCategory.value, createdAt: showCreated.value, status: showStatus.value, priority: showPriority.value }

const categories = computed(() => Array.from(new Set(tickets.value.map((t) => t.category))))
const assigneeOptions = computed(() => Array.from(new Set(usersMock.map((u) => u.name))))
const selectedTicket = computed(() => tickets.value.find((t) => t.id === selectedTicketId.value) ?? null)
const filteredRows = computed<TicketTableRow[]>(() => tickets.value.filter((t) => (filters.status === 'all' || t.status === filters.status) && (filters.priority === 'all' || t.priority === filters.priority) && (filters.type === 'all' || t.type === filters.type) && (filters.category === 'all' || t.category === filters.category) && (!filters.createdFrom || t.createdAt >= filters.createdFrom) && (!filters.createdTo || t.createdAt <= filters.createdTo)).map((t) => ({ ...t, searchText: `${t.id} ${t.subject} ${t.requestorName} ${t.requestorEmail}`.toLowerCase() })))
const appliedFiltersCount = computed(() => (filters.status !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0) + (filters.type !== 'all' ? 1 : 0) + (filters.category !== 'all' ? 1 : 0) + (filters.createdFrom ? 1 : 0) + (filters.createdTo ? 1 : 0))
const kpi = computed(() => ({ open: tickets.value.filter((t) => t.status === 'open').length, inProgress: tickets.value.filter((t) => t.status === 'in-progress').length, resolved: tickets.value.filter((t) => t.status === 'resolved').length, avgResponse: '2h 10m' }))
const viewOptions = computed(() => [{ key: 'showTicketId', label: 'Show ticket ID', checked: showTicketId.value }, { key: 'showRequestor', label: 'Show requestor', checked: showRequestor.value }, { key: 'showType', label: 'Show type', checked: showType.value }, { key: 'showCategory', label: 'Show category', checked: showCategory.value }, { key: 'showCreated', label: 'Show created', checked: showCreated.value }, { key: 'showStatus', label: 'Show status', checked: showStatus.value }, { key: 'showPriority', label: 'Show priority', checked: showPriority.value }, { key: 'showRowNumbers', label: 'Show row numbers', checked: showRowNumbers.value }])

const onView = (row: TicketTableRow) => { selectedTicketId.value = row.id; detailOpen.value = true }
const openCreate = () => { resetForm(); formMode.value = 'create'; formOpen.value = true }
const openEdit = (row: Pick<TicketModel, 'id' | 'subject' | 'requestorName' | 'requestorEmail' | 'type' | 'category' | 'subcategory' | 'description' | 'priority'>) => { formMode.value = 'edit'; editingId.value = row.id; Object.assign(formValues, row); formError.value = ''; formOpen.value = true }
const openDelete = (row: TicketModel) => { deleteCandidate.value = row; deleteOpen.value = true }
const onDelete = (row: TicketTableRow) => { const found = tickets.value.find((t) => t.id === row.id); if (found) openDelete(found) }
const onSetStatus = (row: TicketTableRow, status: TicketStatus) => setTicketStatus(row.id, status)

const columns = computed<ColumnDef<TicketTableRow>[]>(() => createSupportTicketColumns({ onView, onEdit: openEdit, onSetStatus, onDelete }))
const table = useVueTable({ get data() { return filteredRows.value }, get columns() { return columns.value }, state: { get rowSelection() { return rowSelection.value }, get columnVisibility() { return columnVisibility.value }, get columnFilters() { return columnFilters.value }, get sorting() { return sorting.value }, get pagination() { return pagination.value } }, onRowSelectionChange: (u) => valueUpdater(u, rowSelection), onColumnVisibilityChange: (u) => valueUpdater(u, columnVisibility), onColumnFiltersChange: (u) => valueUpdater(u, columnFilters), onSortingChange: (u) => valueUpdater(u, sorting), onPaginationChange: (u) => valueUpdater(u, pagination), getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() })

watch(() => filtersOpen.value, (open) => { if (open) Object.assign(draftFilters, filters) })
watch(() => density.value, (v) => localStorage.setItem(DENSITY_STORAGE_KEY, v))
watch(() => [showTicketId.value, showRequestor.value, showType.value, showCategory.value, showCreated.value, showStatus.value, showPriority.value, showRowNumbers.value], () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ showTicketId: showTicketId.value, showRequestor: showRequestor.value, showType: showType.value, showCategory: showCategory.value, showCreated: showCreated.value, showStatus: showStatus.value, showPriority: showPriority.value, showRowNumbers: showRowNumbers.value })))

const onToggleViewOption = ({ key, value }: { key: string; value: boolean }) => { if (key === 'showTicketId') { showTicketId.value = value; table.getColumn('id')?.toggleVisibility(value) } if (key === 'showRequestor') { showRequestor.value = value; table.getColumn('requestor')?.toggleVisibility(value) } if (key === 'showType') { showType.value = value; table.getColumn('type')?.toggleVisibility(value) } if (key === 'showCategory') { showCategory.value = value; table.getColumn('category')?.toggleVisibility(value) } if (key === 'showCreated') { showCreated.value = value; table.getColumn('createdAt')?.toggleVisibility(value) } if (key === 'showStatus') { showStatus.value = value; table.getColumn('status')?.toggleVisibility(value) } if (key === 'showPriority') { showPriority.value = value; table.getColumn('priority')?.toggleVisibility(value) } if (key === 'showRowNumbers') { showRowNumbers.value = value; table.getColumn('number')?.toggleVisibility(value) } }
const onDensityChange = (value: Density) => { density.value = value }
const applyFilters = () => { Object.assign(filters, draftFilters); table.setPageIndex(0); filtersOpen.value = false }
const resetFilters = () => { Object.assign(draftFilters, defaultFilters); Object.assign(filters, defaultFilters); table.setPageIndex(0); filtersOpen.value = false }
const onFilterSelect = (key: keyof FilterState, event: Event) => { const target = event.target as HTMLSelectElement; ;(draftFilters as Record<string, string>)[key] = target.value }
const onFilterInput = (key: 'createdFrom' | 'createdTo', event: Event) => { draftFilters[key] = (event.target as HTMLInputElement).value }
const onFormInput = (key: 'subject' | 'requestorName' | 'requestorEmail' | 'subcategory', event: Event) => { ;(formValues as Record<string, string>)[key] = (event.target as HTMLInputElement).value }
const onFormSelect = (key: 'type' | 'priority' | 'category', event: Event) => { ;(formValues as Record<string, string>)[key] = (event.target as HTMLSelectElement).value }
const onCommentVisibilityChange = (event: Event) => { commentVisibility.value = (event.target as HTMLSelectElement).value as TicketCommentVisibility }
const onDetailStatusChange = (event: Event) => { if (selectedTicket.value) setTicketStatus(selectedTicket.value.id, (event.target as HTMLSelectElement).value as TicketStatus) }
const onDetailAssigneeChange = (event: Event) => { if (selectedTicket.value) setTicketAssignee(selectedTicket.value.id, (event.target as HTMLSelectElement).value === 'unassigned' ? '' : (event.target as HTMLSelectElement).value) }

const saveTicket = () => {
  const subject = formValues.subject.trim(); const name = formValues.requestorName.trim(); const email = formValues.requestorEmail.trim().toLowerCase(); const desc = formValues.description.trim()
  if (!subject || !name || !email || !desc) { formError.value = 'Subject, Requestor Name, Requestor Email, and Description are required.'; return }
  if (!emailRegex.test(email)) { formError.value = 'Requestor Email format is invalid.'; return }
  const now = today()
  if (formMode.value === 'edit' && editingId.value) { tickets.value = tickets.value.map((t) => (t.id === editingId.value ? { ...t, subject, requestorName: name, requestorEmail: email, type: formValues.type, category: formValues.category, subcategory: formValues.subcategory.trim(), description: desc, priority: formValues.priority, updatedAt: now } : t)) }
  else { const max = tickets.value.reduce((m, t) => Math.max(m, Number(t.id.split('-').pop() ?? '0')), 0); const id = `TCK-2026-${String(max + 1).padStart(4, '0')}`; tickets.value = [{ id, subject, requestorName: name, requestorEmail: email, type: formValues.type, category: formValues.category, subcategory: formValues.subcategory.trim(), description: desc, status: 'open', priority: formValues.priority, createdAt: now, updatedAt: now, comments: [] }, ...tickets.value]; selectedTicketId.value = id; detailOpen.value = true }
  closeForm()
}
const closeForm = () => { formOpen.value = false; resetForm() }
const resetForm = () => { formMode.value = 'create'; editingId.value = null; Object.assign(formValues, defaultForm); formError.value = '' }
const setTicketStatus = (id: string, status: TicketStatus) => { tickets.value = tickets.value.map((t) => (t.id === id ? { ...t, status, updatedAt: today() } : t)) }
const setTicketAssignee = (id: string, assignee: string) => { tickets.value = tickets.value.map((t) => (t.id === id ? { ...t, assignee: assignee || undefined, updatedAt: today() } : t)) }
const addComment = () => { if (!selectedTicket.value || !commentMessage.value.trim()) return; const ticketId = selectedTicket.value.id; const msg = commentMessage.value.trim(); tickets.value = tickets.value.map((t) => (t.id === ticketId ? { ...t, comments: [...t.comments, { id: `${t.id}-C${t.comments.length + 1}`, author: 'Current User', message: msg, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '), visibility: commentVisibility.value }], updatedAt: today() } : t)); commentMessage.value = ''; commentVisibility.value = 'public' }
const confirmDelete = () => { if (!deleteCandidate.value) return; tickets.value = tickets.value.filter((t) => t.id !== deleteCandidate.value?.id); if (selectedTicketId.value === deleteCandidate.value.id) { selectedTicketId.value = null; detailOpen.value = false } deleteOpen.value = false; deleteCandidate.value = null }
const onExportCsv = () => { const rows = table.getFilteredRowModel().rows.map((row) => row.original); const csv = [['Ticket ID', 'Subject', 'Requestor', 'Type', 'Category', 'Status', 'Priority', 'Created'], ...rows.map((r) => [r.id, r.subject, `${r.requestorName} (${r.requestorEmail})`, r.type, `${r.category}/${r.subcategory}`, r.status, r.priority, r.createdAt])].map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `support-tickets-${today()}.csv`; a.click(); URL.revokeObjectURL(url) }
const onExportExcel = () => console.log('Export Excel (stub) clicked')
function today() { return new Date().toISOString().slice(0, 10) }
function loadDensity(): Density { const value = localStorage.getItem(DENSITY_STORAGE_KEY); return value === 'compact' || value === 'comfortable' ? value : 'comfortable' }
function loadViewState() { const raw = localStorage.getItem(VIEW_STORAGE_KEY); if (!raw) return; try { const p = JSON.parse(raw) as Record<string, boolean>; showTicketId.value = p.showTicketId ?? true; showRequestor.value = p.showRequestor ?? true; showType.value = p.showType ?? true; showCategory.value = p.showCategory ?? true; showCreated.value = p.showCreated ?? true; showStatus.value = p.showStatus ?? true; showPriority.value = p.showPriority ?? true; showRowNumbers.value = p.showRowNumbers ?? true } catch {} }
</script>
