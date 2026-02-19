export type SearchRecordType = 'inventory' | 'request' | 'cycle-count' | 'scanner'
export type SearchRecordStatus = 'active' | 'in-progress' | 'completed' | 'pending' | 'inactive'

export type SearchRecord = {
  id: string
  type: SearchRecordType
  reference: string
  title: string
  warehouse: string
  status: SearchRecordStatus
  rfidCode: string
  updatedAt: string
}

export const searchMockData: SearchRecord[] = [
  { id: 'sr-001', type: 'inventory', reference: 'INV-1001', title: 'Pallet Sensor A', warehouse: 'Warehouse A', status: 'active', rfidCode: 'B0000000000000123', updatedAt: '2026-02-19 09:42' },
  { id: 'sr-002', type: 'inventory', reference: 'INV-1002', title: 'Crate Tag B', warehouse: 'Warehouse B', status: 'in-progress', rfidCode: 'B0000000000000124', updatedAt: '2026-02-19 09:20' },
  { id: 'sr-003', type: 'request', reference: 'REQ-2026-028', title: 'New Local Request', warehouse: 'Warehouse A', status: 'pending', rfidCode: 'B0000000000001123', updatedAt: '2026-02-18 16:12' },
  { id: 'sr-004', type: 'request', reference: 'REQ-2026-027', title: 'Additional Delivery', warehouse: 'Warehouse C', status: 'in-progress', rfidCode: 'B0000000000001124', updatedAt: '2026-02-18 13:47' },
  { id: 'sr-005', type: 'cycle-count', reference: 'CC-2026-081', title: 'Cycle Count Batch 81', warehouse: 'Warehouse B', status: 'completed', rfidCode: 'B0000000000002123', updatedAt: '2026-02-17 15:09' },
  { id: 'sr-006', type: 'scanner', reference: 'SCN-4412', title: 'Handheld Scanner 4412', warehouse: 'Warehouse A', status: 'active', rfidCode: 'B0000000000003123', updatedAt: '2026-02-17 08:55' },
  { id: 'sr-007', type: 'inventory', reference: 'INV-1003', title: 'Bin Marker C', warehouse: 'Warehouse C', status: 'inactive', rfidCode: 'B0000000000000125', updatedAt: '2026-02-16 11:31' },
  { id: 'sr-008', type: 'request', reference: 'REQ-2026-026', title: 'Warehouse Transfer', warehouse: 'Warehouse B', status: 'completed', rfidCode: 'B0000000000001125', updatedAt: '2026-02-16 10:08' },
  { id: 'sr-009', type: 'cycle-count', reference: 'CC-2026-079', title: 'Cycle Count Batch 79', warehouse: 'Warehouse A', status: 'in-progress', rfidCode: 'B0000000000002124', updatedAt: '2026-02-15 18:14' },
  { id: 'sr-010', type: 'scanner', reference: 'SCN-4470', title: 'Dock Scanner 4470', warehouse: 'Warehouse C', status: 'pending', rfidCode: 'B0000000000003124', updatedAt: '2026-02-15 13:59' },
]
