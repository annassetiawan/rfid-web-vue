export type PagePrimaryAction = {
  label: string
  route: string
}

export type PageTableColumn = {
  id: string
  label: string
  defaultVisible: boolean
}

export type PageTableConfig = {
  columns: PageTableColumn[]
  rowActions: string[]
}

export type PageFilterConfig = {
  simpleFilters: string[]
  advancedFilters: string[]
}

export type AdminPageConfig = {
  key: string
  route: string
  title: string
  description: string
  primaryAction: PagePrimaryAction
  table: PageTableConfig
  filters: PageFilterConfig
}

export const adminPages: AdminPageConfig[] = [
  {
    key: 'inventory',
    route: '/inventory',
    title: 'Inventory',
    description: 'Review current RFID-tagged inventory snapshots and status.',
    primaryAction: { label: 'New Inventory Item', route: '/inventory/new' },
    table: {
      columns: [
        { id: 'name', label: 'Name', defaultVisible: true },
        { id: 'serialNumber', label: 'Serial Number', defaultVisible: true },
        { id: 'rfidCode', label: 'RFID Code', defaultVisible: true },
        { id: 'inventoryStatus', label: 'Inventory Status', defaultVisible: true },
        { id: 'location', label: 'Location', defaultVisible: true },
        { id: 'condition', label: 'Condition', defaultVisible: true },
        { id: 'stagingStatus', label: 'Staging Status', defaultVisible: true },
        { id: 'warehouseLocation', label: 'Warehouse Location', defaultVisible: true },
        { id: 'taggedDate', label: 'Tagged Date', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'deactivate'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['inventoryStatus', 'location', 'condition', 'stagingStatus', 'warehouseLocation', 'dateFrom', 'dateTo'],
    },
  },
  {
    key: 'requests',
    route: '/requests/local',
    title: 'Requests',
    description: 'Track and process local RFID requests from operations teams.',
    primaryAction: { label: 'New Request', route: '/requests/local/new' },
    table: {
      columns: [
        { id: 'requestNumber', label: 'Request Number', defaultVisible: true },
        { id: 'warehouse', label: 'Warehouse', defaultVisible: true },
        { id: 'companyName', label: 'Company Name', defaultVisible: true },
        { id: 'requestType', label: 'Request Type', defaultVisible: true },
        { id: 'serviceLevel', label: 'Service Level', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'createdDate', label: 'Created Date', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'deactivate'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: [
        'requestType',
        'status',
        'warehouse',
        'companyName',
        'requestDateFrom',
        'requestDateTo',
        'createdDateFrom',
        'createdDateTo',
      ],
    },
  },
  {
    key: 'search',
    route: '/search',
    title: 'Search',
    description: 'Find tagged items, requests, and activity records quickly.',
    primaryAction: { label: 'Open Advanced Search', route: '/search' },
    table: {
      columns: [
        { id: 'type', label: 'Type', defaultVisible: true },
        { id: 'reference', label: 'Reference', defaultVisible: true },
        { id: 'warehouse', label: 'Warehouse', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'updatedAt', label: 'Updated At', defaultVisible: true },
      ],
      rowActions: ['view'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['type', 'warehouse', 'status', 'updatedFrom', 'updatedTo'],
    },
  },
  {
    key: 'cycle-count',
    route: '/cycle-count',
    title: 'Cycle Count',
    description: 'Monitor cycle count execution and reconciliation status.',
    primaryAction: { label: 'Create Cycle Count', route: '/cycle-count/new' },
    table: {
      columns: [
        { id: 'countNo', label: 'Count No', defaultVisible: true },
        { id: 'warehouse', label: 'Warehouse', defaultVisible: true },
        { id: 'scope', label: 'Scope', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'scheduledAt', label: 'Scheduled At', defaultVisible: true },
      ],
      rowActions: ['view', 'start', 'close'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['warehouse', 'status', 'scheduledFrom', 'scheduledTo'],
    },
  },
  {
    key: 'customers',
    route: '/customers',
    title: 'Customers',
    description: 'Manage customer records and RFID profile assignments.',
    primaryAction: { label: 'New Customer', route: '/customers/new' },
    table: {
      columns: [
        { id: 'customerCode', label: 'Customer Code', defaultVisible: true },
        { id: 'name', label: 'Name', defaultVisible: true },
        { id: 'segment', label: 'Segment', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'updatedAt', label: 'Updated At', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'deactivate'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['segment', 'status', 'updatedFrom', 'updatedTo'],
    },
  },
  {
    key: 'warehouses',
    route: '/warehouses',
    title: 'Warehouses',
    description: 'Control warehouse hierarchy, zones, and RFID activation settings.',
    primaryAction: { label: 'New Warehouse', route: '/warehouses/new' },
    table: {
      columns: [
        { id: 'code', label: 'Code', defaultVisible: true },
        { id: 'name', label: 'Name', defaultVisible: true },
        { id: 'city', label: 'City', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'updatedAt', label: 'Updated At', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'deactivate'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['city', 'status', 'updatedFrom', 'updatedTo'],
    },
  },
  {
    key: 'scanner',
    route: '/scanner',
    title: 'Scanner',
    description: 'Review scanner registrations and connectivity health.',
    primaryAction: { label: 'Register Scanner', route: '/scanner/new' },
    table: {
      columns: [
        { id: 'scannerId', label: 'Scanner ID', defaultVisible: true },
        { id: 'model', label: 'Model', defaultVisible: true },
        { id: 'location', label: 'Location', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'lastSeen', label: 'Last Seen', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'deactivate'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['location', 'status', 'lastSeenFrom', 'lastSeenTo'],
    },
  },
  {
    key: 'logistic-email',
    route: '/logistic-email',
    title: 'Logistic Email',
    description: 'Manage outbound logistics notifications and templates.',
    primaryAction: { label: 'Create Template', route: '/logistic-email/new' },
    table: {
      columns: [
        { id: 'templateName', label: 'Template', defaultVisible: true },
        { id: 'trigger', label: 'Trigger', defaultVisible: true },
        { id: 'recipientGroup', label: 'Recipients', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'updatedAt', label: 'Updated At', defaultVisible: true },
      ],
      rowActions: ['view', 'edit', 'disable'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['trigger', 'status', 'updatedFrom', 'updatedTo'],
    },
  },
  {
    key: 'support-center',
    route: '/support-center',
    title: 'Support Center',
    description: 'Track support tickets and operational escalations.',
    primaryAction: { label: 'Create Ticket', route: '/support-center/new' },
    table: {
      columns: [
        { id: 'ticketNo', label: 'Ticket No', defaultVisible: true },
        { id: 'subject', label: 'Subject', defaultVisible: true },
        { id: 'priority', label: 'Priority', defaultVisible: true },
        { id: 'status', label: 'Status', defaultVisible: true },
        { id: 'updatedAt', label: 'Updated At', defaultVisible: true },
      ],
      rowActions: ['view', 'assign', 'close'],
    },
    filters: {
      simpleFilters: ['search'],
      advancedFilters: ['priority', 'status', 'updatedFrom', 'updatedTo'],
    },
  },
]

export const getAdminPageConfig = (key: string) => adminPages.find((page) => page.key === key)
