<template>
  <main class="container max-w-6xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Settings/Support</p>
      <PageHeader title="Users" description="Manage access, roles, and warehouse assignments.">
        <template #actions>
          <Button @click="openCreate">
            <Plus class="h-4 w-4" />
            Add New User
          </Button>
        </template>
      </PageHeader>
      <Separator />
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Total Users</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.total }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <Users class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">All registered user accounts.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Active</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.active }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Accounts with active access.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Inactive</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.inactive }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <CirclePause class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Disabled user accounts.</CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">Warehouse Operators</p>
              <p class="text-4xl font-semibold leading-none">{{ kpi.warehouseOperators }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <HardHat class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">Users assigned to operations role.</CardContent>
      </Card>
    </div>

    <ListCard title="User List" description="Review and manage account access across the organization." compact>
      <DataTableToolbar
        :table="table"
        :density="density"
        :applied-filters-count="appliedFiltersCount"
        search-column-id="searchText"
        search-placeholder="Search name, email, warehouse..."
        :view-options="[
          { key: 'showEmail', label: 'Show email', checked: showEmail },
          { key: 'showRole', label: 'Show role', checked: showRole },
          { key: 'showWarehouse', label: 'Show warehouse', checked: showWarehouse },
          { key: 'showStatus', label: 'Show status', checked: showStatus },
          { key: 'showUpdated', label: 'Show updated', checked: showUpdated },
          { key: 'showRowNumbers', label: 'Show row numbers', checked: showRowNumbers },
        ]"
        @open-filters="filtersOpen = true"
        @toggle:view-option="onToggleViewOption"
        @update:density="onDensityChange"
        @export-csv="onExportCsv"
        @export-excel="onExportExcel"
      />

      <p class="px-4 pb-2 text-sm text-muted-foreground">{{ table.getFilteredRowModel().rows.length }} results</p>

      <DataTable
        :table="table"
        :density="density"
        :wrap-text="false"
        empty-title="No users found"
        empty-description="Try adjusting filters."
      />

      <DataTablePagination
        :table="table"
        :density="density"
        :total-rows="table.getFilteredRowModel().rows.length"
      />
    </ListCard>

    <FilterSheet
      v-model="filtersOpen"
      title="User Filters"
      description="Filter users by status, role, warehouse location, and email domain."
      reset-label="Reset"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Status</label>
        <Select :value="draftFilters.status" @change="onSelectChange('status', $event)">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Role</label>
        <Select :value="draftFilters.role" @change="onSelectChange('role', $event)">
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="admin-eval">Admin Eval</option>
          <option value="warehouse-operator">Warehouse Operator</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Warehouse</label>
        <Select :value="draftFilters.warehouseLocation" @change="onSelectChange('warehouseLocation', $event)">
          <option value="all">All</option>
          <option v-for="item in warehouseOptions" :key="item" :value="item">{{ item }}</option>
        </Select>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email Domain</label>
        <Input :value="draftFilters.emailDomain" placeholder="mail.com" @input="onInputChange('emailDomain', $event)" />
      </div>
    </FilterSheet>

    <Sheet v-model="detailOpen">
      <div v-if="selectedUser" class="flex h-full flex-col gap-4">
        <div class="space-y-2 border-b border-border/60 pb-4">
          <div class="flex items-start gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-muted font-semibold text-muted-foreground">
              {{ getInitials(selectedUser.name) }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ selectedUser.name }}</h2>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <p class="font-mono text-xs text-muted-foreground">{{ selectedUser.email }}</p>
                <Badge variant="outline" :class="getUserRoleBadgeClass(selectedUser.role)">{{ roleLabelMap[selectedUser.role] }}</Badge>
                <Badge variant="outline" :class="getActiveBadgeClass(selectedUser.status)">
                  {{ selectedUser.status === 'active' ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Assignment</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Role</p>
                <p>{{ roleLabelMap[selectedUser.role] }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Warehouse</p>
                <p>{{ selectedUser.warehouseLocation || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-border/60 p-4 text-sm">
            <h3 class="font-semibold">Activity</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Last Login</p>
                <p>{{ selectedUser.lastLoginAt || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Created</p>
                <p>{{ selectedUser.createdAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Updated</p>
                <p>{{ selectedUser.updatedAt }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <Button variant="outline" @click="openEdit(selectedUser)">Edit</Button>
          <Button variant="outline" @click="toggleStatus(selectedUser)">
            {{ selectedUser.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
          <Button variant="outline" @click="openResetPassword(selectedUser)">Reset Password</Button>
          <Button variant="destructive" @click="openDelete(selectedUser)">Delete</Button>
        </div>
      </div>
      <div v-else class="p-2 text-sm text-muted-foreground">User not found.</div>
    </Sheet>

    <Dialog v-model="formOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">{{ formMode === 'edit' ? 'Edit User' : 'Add New User' }}</h2>
          <p class="text-sm text-muted-foreground">Manage access, roles, and warehouse assignments.</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Name *</label>
          <Input :value="formValues.name" placeholder="Enter name" @input="onFormInput('name', $event)" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Email *</label>
          <Input :value="formValues.email" type="email" placeholder="Enter email" @input="onFormInput('email', $event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Role</label>
            <Select :value="formValues.role" @change="onFormSelect('role', $event)">
              <option value="admin">Admin</option>
              <option value="admin-eval">Admin Eval</option>
              <option value="warehouse-operator">Warehouse Operator</option>
            </Select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Status</label>
            <Select :value="formValues.status" @change="onFormSelect('status', $event)">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Warehouse Location</label>
          <Select :value="formValues.warehouseLocation || 'none'" @change="onFormSelect('warehouseLocation', $event)">
            <option value="none">No warehouse</option>
            <option v-for="item in warehouseOptions" :key="item" :value="item">{{ item }}</option>
          </Select>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="closeForm">Cancel</Button>
          <Button @click="saveUser">{{ formMode === 'edit' ? 'Save Changes' : 'Create User' }}</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="deleteOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Delete User</h2>
          <p class="text-sm text-muted-foreground">
            Delete {{ deleteCandidate?.email || 'selected user' }}? This action is mock and cannot be undone.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model="resetOpen">
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Reset Password</h2>
          <p class="text-sm text-muted-foreground">
            Send password reset link to {{ resetCandidate?.email || 'selected user' }}?
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" @click="resetOpen = false">Cancel</Button>
          <Button @click="confirmResetPassword">Confirm</Button>
        </div>
      </div>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useVueTable,
} from '@tanstack/vue-table'
import { CircleCheckBig, CirclePause, HardHat, Plus, Users } from 'lucide-vue-next'
import { createUserColumns, roleLabelMap, type UserTableRow } from '@/components/users/columns'
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
import { getActiveBadgeClass, getUserRoleBadgeClass } from '@/lib/statusBadges'
import { valueUpdater } from '@/lib/utils'
import { usersMock, type User, type UserRole, type UserStatus } from '@/mock/users'

type Density = 'compact' | 'comfortable'
type FormMode = 'create' | 'edit'

type FilterState = {
  status: 'all' | UserStatus
  role: 'all' | UserRole
  warehouseLocation: string
  emailDomain: string
}

type FormState = {
  name: string
  email: string
  role: UserRole
  warehouseLocation: string
  status: UserStatus
}

const DENSITY_STORAGE_KEY = 'table-density:users'
const VIEW_STORAGE_KEY = 'table-view:users'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const defaultFilters: FilterState = {
  status: 'all',
  role: 'all',
  warehouseLocation: 'all',
  emailDomain: '',
}

const defaultForm: FormState = {
  name: '',
  email: '',
  role: 'warehouse-operator',
  warehouseLocation: '',
  status: 'active',
}

const users = ref<User[]>([...usersMock])
const density = ref<Density>(loadDensity())
const showEmail = ref(true)
const showRole = ref(true)
const showWarehouse = ref(true)
const showStatus = ref(true)
const showUpdated = ref(true)
const showRowNumbers = ref(true)
const filtersOpen = ref(false)

const filters = reactive<FilterState>({ ...defaultFilters })
const draftFilters = reactive<FilterState>({ ...defaultFilters })

const rowSelection = ref({})
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([])
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const detailOpen = ref(false)
const selectedUserId = ref<string | null>(null)

const formOpen = ref(false)
const formMode = ref<FormMode>('create')
const editingId = ref<string | null>(null)
const formError = ref('')
const formValues = reactive<FormState>({ ...defaultForm })

const deleteOpen = ref(false)
const deleteCandidate = ref<User | null>(null)
const resetOpen = ref(false)
const resetCandidate = ref<User | null>(null)

loadViewState()
columnVisibility.value.number = showRowNumbers.value
columnVisibility.value.searchText = false
columnVisibility.value.email = showEmail.value
columnVisibility.value.role = showRole.value
columnVisibility.value.warehouseLocation = showWarehouse.value
columnVisibility.value.status = showStatus.value
columnVisibility.value.updatedAt = showUpdated.value

const warehouseOptions = computed(() =>
  Array.from(new Set(users.value.map((user) => user.warehouseLocation).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
)

const filteredRows = computed<UserTableRow[]>(() =>
  users.value
    .filter((user) => {
      if (filters.status !== 'all' && user.status !== filters.status) return false
      if (filters.role !== 'all' && user.role !== filters.role) return false
      if (filters.warehouseLocation !== 'all' && user.warehouseLocation !== filters.warehouseLocation) return false
      if (filters.emailDomain.trim() && !user.email.toLowerCase().includes(`@${filters.emailDomain.toLowerCase().trim()}`)) return false
      return true
    })
    .map((user) => ({
      ...user,
      searchText: `${user.name} ${user.email} ${user.warehouseLocation} ${roleLabelMap[user.role]}`.toLowerCase(),
    })),
)

const selectedUser = computed(() => users.value.find((user) => user.id === selectedUserId.value) ?? null)

const kpi = computed(() => ({
  total: users.value.length,
  active: users.value.filter((item) => item.status === 'active').length,
  inactive: users.value.filter((item) => item.status === 'inactive').length,
  warehouseOperators: users.value.filter((item) => item.role === 'warehouse-operator').length,
}))

const appliedFiltersCount = computed(() =>
  (filters.status !== 'all' ? 1 : 0)
  + (filters.role !== 'all' ? 1 : 0)
  + (filters.warehouseLocation !== 'all' ? 1 : 0)
  + (filters.emailDomain.trim() ? 1 : 0),
)

const onView = (row: UserTableRow) => {
  selectedUserId.value = row.id
  detailOpen.value = true
}

const openCreate = () => {
  resetForm()
  formMode.value = 'create'
  formOpen.value = true
}

const openEdit = (row: Pick<User, 'id' | 'name' | 'email' | 'role' | 'warehouseLocation' | 'status'>) => {
  formMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formValues, {
    name: row.name,
    email: row.email,
    role: row.role,
    warehouseLocation: row.warehouseLocation,
    status: row.status,
  })
  formError.value = ''
  formOpen.value = true
}

const toggleStatus = (row: Pick<User, 'id' | 'status'>) => {
  const nextStatus: UserStatus = row.status === 'active' ? 'inactive' : 'active'
  users.value = users.value.map((item) =>
    item.id === row.id ? { ...item, status: nextStatus, updatedAt: today() } : item,
  )
}

const openDelete = (row: User) => {
  deleteCandidate.value = row
  deleteOpen.value = true
}

const onDelete = (row: UserTableRow) => {
  const original = users.value.find((item) => item.id === row.id)
  if (!original) return
  openDelete(original)
}

const openResetPassword = (row: User) => {
  resetCandidate.value = row
  resetOpen.value = true
}

const onResetPassword = (row: UserTableRow) => {
  const original = users.value.find((item) => item.id === row.id)
  if (!original) return
  openResetPassword(original)
}

const columns = computed<ColumnDef<UserTableRow>[]>(() => createUserColumns({
  onView,
  onEdit: openEdit,
  onToggle: toggleStatus,
  onReset: onResetPassword,
  onDelete,
}))

const table = useVueTable({
  get data() {
    return filteredRows.value
  },
  get columns() {
    return columns.value
  },
  state: {
    get rowSelection() {
      return rowSelection.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onRowSelectionChange: (updater) => valueUpdater(updater, rowSelection),
  onColumnVisibilityChange: (updater) => valueUpdater(updater, columnVisibility),
  onColumnFiltersChange: (updater) => valueUpdater(updater, columnFilters),
  onSortingChange: (updater) => valueUpdater(updater, sorting),
  onPaginationChange: (updater) => valueUpdater(updater, pagination),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

watch(
  () => filtersOpen.value,
  (isOpen) => {
    if (isOpen) Object.assign(draftFilters, filters)
  },
)

watch(
  () => density.value,
  (value) => localStorage.setItem(DENSITY_STORAGE_KEY, value),
)

watch(
  () => [showEmail.value, showRole.value, showWarehouse.value, showStatus.value, showUpdated.value, showRowNumbers.value],
  () => localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
    showEmail: showEmail.value,
    showRole: showRole.value,
    showWarehouse: showWarehouse.value,
    showStatus: showStatus.value,
    showUpdated: showUpdated.value,
    showRowNumbers: showRowNumbers.value,
  })),
)

const onDensityChange = (value: Density) => {
  density.value = value
}

const onToggleViewOption = (payload: { key: string; value: boolean }) => {
  if (payload.key === 'showEmail') {
    showEmail.value = payload.value
    table.getColumn('email')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showRole') {
    showRole.value = payload.value
    table.getColumn('role')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showWarehouse') {
    showWarehouse.value = payload.value
    table.getColumn('warehouseLocation')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showStatus') {
    showStatus.value = payload.value
    table.getColumn('status')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showUpdated') {
    showUpdated.value = payload.value
    table.getColumn('updatedAt')?.toggleVisibility(payload.value)
    return
  }
  if (payload.key === 'showRowNumbers') {
    showRowNumbers.value = payload.value
    table.getColumn('number')?.toggleVisibility(payload.value)
  }
}

const applyFilters = () => {
  Object.assign(filters, draftFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const resetFilters = () => {
  Object.assign(draftFilters, defaultFilters)
  Object.assign(filters, defaultFilters)
  table.setPageIndex(0)
  filtersOpen.value = false
}

const onSelectChange = (key: keyof FilterState, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'status') {
    draftFilters.status = target.value as FilterState['status']
    return
  }
  if (key === 'role') {
    draftFilters.role = target.value as FilterState['role']
    return
  }
  if (key === 'warehouseLocation') {
    draftFilters.warehouseLocation = target.value
  }
}

const onInputChange = (key: 'emailDomain', event: Event) => {
  const target = event.target as HTMLInputElement
  draftFilters[key] = target.value
}

const onFormInput = (key: 'name' | 'email', event: Event) => {
  const target = event.target as HTMLInputElement
  formValues[key] = target.value
}

const onFormSelect = (key: 'role' | 'status' | 'warehouseLocation', event: Event) => {
  const target = event.target as HTMLSelectElement
  if (key === 'role') {
    formValues.role = target.value as UserRole
    return
  }
  if (key === 'status') {
    formValues.status = target.value as UserStatus
    return
  }
  formValues.warehouseLocation = target.value === 'none' ? '' : target.value
}

const saveUser = () => {
  const name = formValues.name.trim()
  const email = formValues.email.trim().toLowerCase()

  if (!name || !email) {
    formError.value = 'Name and Email are required.'
    return
  }
  if (!emailRegex.test(email)) {
    formError.value = 'Email format is invalid.'
    return
  }
  if (users.value.some((user) => user.email.toLowerCase() === email && user.id !== editingId.value)) {
    formError.value = 'Email must be unique.'
    return
  }
  if (formValues.role === 'warehouse-operator' && !formValues.warehouseLocation.trim()) {
    formError.value = 'Warehouse location is required for Warehouse Operator.'
    return
  }

  const now = today()

  if (formMode.value === 'edit' && editingId.value) {
    users.value = users.value.map((user) =>
      user.id === editingId.value
        ? {
            ...user,
            name,
            email,
            role: formValues.role,
            warehouseLocation: formValues.warehouseLocation.trim(),
            status: formValues.status,
            updatedAt: now,
          }
        : user,
    )
  } else {
    const maxId = users.value.reduce((max, user) => {
      const parsed = Number(user.id.split('-').pop() ?? '0')
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0)
    const newUser: User = {
      id: `USR-${String(maxId + 1).padStart(3, '0')}`,
      name,
      email,
      role: formValues.role,
      warehouseLocation: formValues.warehouseLocation.trim(),
      status: formValues.status,
      lastLoginAt: formValues.status === 'active' ? `${now} 09:00` : undefined,
      createdAt: now,
      updatedAt: now,
    }
    users.value = [newUser, ...users.value]
  }

  closeForm()
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const resetForm = () => {
  formMode.value = 'create'
  editingId.value = null
  Object.assign(formValues, defaultForm)
  formError.value = ''
}

const confirmDelete = () => {
  if (!deleteCandidate.value) return
  users.value = users.value.filter((item) => item.id !== deleteCandidate.value?.id)
  if (selectedUserId.value === deleteCandidate.value.id) {
    selectedUserId.value = null
    detailOpen.value = false
  }
  deleteOpen.value = false
  deleteCandidate.value = null
}

const confirmResetPassword = () => {
  if (!resetCandidate.value) return
  console.log(`Password reset link sent to ${resetCandidate.value.email}`)
  resetOpen.value = false
  resetCandidate.value = null
}

const onExportCsv = () => {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original)
  const header = ['Name', 'Email', 'Role', 'Warehouse', 'Status', 'Last Login', 'Created', 'Updated']
  const body = rows.map((row) => [
    row.name,
    row.email,
    roleLabelMap[row.role],
    row.warehouseLocation || '-',
    row.status,
    row.lastLoginAt || '-',
    row.createdAt,
    row.updatedAt,
  ])

  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `users-${today()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const onExportExcel = () => {
  console.log('Export Excel (stub) clicked')
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).slice(0, 2)
  return words.map((word) => word[0]?.toUpperCase() ?? '').join('') || 'U'
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function loadDensity(): Density {
  const value = localStorage.getItem(DENSITY_STORAGE_KEY)
  if (value === 'compact' || value === 'comfortable') return value
  return 'comfortable'
}

function loadViewState() {
  const raw = localStorage.getItem(VIEW_STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as {
      showEmail?: boolean
      showRole?: boolean
      showWarehouse?: boolean
      showStatus?: boolean
      showUpdated?: boolean
      showRowNumbers?: boolean
    }
    showEmail.value = parsed.showEmail ?? true
    showRole.value = parsed.showRole ?? true
    showWarehouse.value = parsed.showWarehouse ?? true
    showStatus.value = parsed.showStatus ?? true
    showUpdated.value = parsed.showUpdated ?? true
    showRowNumbers.value = parsed.showRowNumbers ?? true
  } catch {
    showEmail.value = true
    showRole.value = true
    showWarehouse.value = true
    showStatus.value = true
    showUpdated.value = true
    showRowNumbers.value = true
  }
}
</script>
