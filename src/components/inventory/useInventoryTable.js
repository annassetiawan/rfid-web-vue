import { computed, reactive, ref, watch } from 'vue';
const defaultFilters = () => ({
    inventoryStatus: '',
    location: '',
    condition: '',
    stagingStatus: '',
    warehouseLocation: '',
    dateFrom: '',
    dateTo: '',
});
export function useInventoryTable() {
    const rows = ref([
        { id: 1, name: 'Pallet Sensor A', serialNumber: 'SN-9001', rfidCode: 'RFID-A1X2', inventoryStatus: 'In Stock', location: 'Warehouse A', taggedDate: '2026-01-04', status: 'active', condition: 'Good', stagingStatus: 'Received', warehouseLocation: 'A-R01' },
        { id: 2, name: 'Crate Tag B', serialNumber: 'SN-9002', rfidCode: 'RFID-B2Y3', inventoryStatus: 'In Transit', location: 'Dock 2', taggedDate: '2026-01-09', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-02' },
        { id: 3, name: 'Bin Marker C', serialNumber: 'SN-9003', rfidCode: 'RFID-C3Z4', inventoryStatus: 'Reserved', location: 'Warehouse B', taggedDate: '2026-01-12', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R04' },
        { id: 4, name: 'Asset Cart D', serialNumber: 'SN-9004', rfidCode: 'RFID-D4Q5', inventoryStatus: 'Assigned', location: 'Packing', taggedDate: '2026-01-16', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'P-11' },
        { id: 5, name: 'Tool Kit E', serialNumber: 'SN-9005', rfidCode: 'RFID-E5W6', inventoryStatus: 'In Stock', location: 'Warehouse C', taggedDate: '2026-01-18', status: 'active', condition: 'Refurbished', stagingStatus: 'Received', warehouseLocation: 'C-R09' },
        { id: 6, name: 'Module Unit F', serialNumber: 'SN-9006', rfidCode: 'RFID-F6R7', inventoryStatus: 'In Transit', location: 'Staging Area', taggedDate: '2026-01-21', status: 'inactive', condition: 'Good', stagingStatus: 'Inbound', warehouseLocation: 'S-03' },
        { id: 7, name: 'Tag Bundle G', serialNumber: 'SN-9007', rfidCode: 'RFID-G7T8', inventoryStatus: 'Reserved', location: 'Warehouse A', taggedDate: '2026-01-26', status: 'active', condition: 'Good', stagingStatus: 'Reserved', warehouseLocation: 'A-R08' },
        { id: 8, name: 'Spare Label H', serialNumber: 'SN-9008', rfidCode: 'RFID-H8U9', inventoryStatus: 'Assigned', location: 'QC Room', taggedDate: '2026-01-30', status: 'active', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'Q-01' },
        { id: 9, name: 'Return Bin I', serialNumber: 'SN-9009', rfidCode: 'RFID-I9V0', inventoryStatus: 'In Stock', location: 'Warehouse B', taggedDate: '2026-02-01', status: 'inactive', condition: 'Damaged', stagingStatus: 'Hold', warehouseLocation: 'B-R02' },
        { id: 10, name: 'Transit Box J', serialNumber: 'SN-9010', rfidCode: 'RFID-J0W1', inventoryStatus: 'In Transit', location: 'Dock 1', taggedDate: '2026-02-05', status: 'active', condition: 'Good', stagingStatus: 'Outbound', warehouseLocation: 'D-01' },
        { id: 11, name: 'Rack Sensor K', serialNumber: 'SN-9011', rfidCode: 'RFID-K1X2', inventoryStatus: 'Reserved', location: 'Warehouse C', taggedDate: '2026-02-08', status: 'active', condition: 'Refurbished', stagingStatus: 'Reserved', warehouseLocation: 'C-R11' },
        { id: 12, name: 'Batch Item L', serialNumber: 'SN-9012', rfidCode: 'RFID-L2Y3', inventoryStatus: 'Assigned', location: 'Dispatch', taggedDate: '2026-02-10', status: 'inactive', condition: 'Good', stagingStatus: 'Assigned', warehouseLocation: 'DS-07' },
    ]);
    const columns = ref([
        { key: 'name', label: 'Name', hideable: true },
        { key: 'serialNumber', label: 'Serial Number', hideable: true },
        { key: 'rfidCode', label: 'RFID Code', hideable: true },
        { key: 'inventoryStatus', label: 'Inventory Status', hideable: true },
        { key: 'location', label: 'Location', hideable: true },
        { key: 'taggedDate', label: 'Tagged Date', hideable: true },
        { key: 'status', label: 'Status', hideable: true },
        { key: 'actions', label: 'Actions', hideable: false },
    ]);
    const searchQuery = ref('');
    const density = ref('comfortable');
    const pageSize = ref(10);
    const page = ref(1);
    const visibleColumns = reactive({
        name: true,
        serialNumber: true,
        rfidCode: true,
        inventoryStatus: true,
        location: true,
        taggedDate: true,
        status: true,
        actions: true,
    });
    const filters = reactive(defaultFilters());
    const filterOptions = computed(() => ({
        inventoryStatus: ['In Stock', 'In Transit', 'Reserved', 'Assigned'],
        location: Array.from(new Set(rows.value.map((row) => row.location))),
        condition: Array.from(new Set(rows.value.map((row) => row.condition))),
        stagingStatus: Array.from(new Set(rows.value.map((row) => row.stagingStatus))),
        warehouseLocation: Array.from(new Set(rows.value.map((row) => row.warehouseLocation))),
    }));
    const filteredRows = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return rows.value.filter((row) => {
            const matchesSearch = query.length === 0
                || [
                    row.name,
                    row.serialNumber,
                    row.rfidCode,
                    row.location,
                    row.warehouseLocation,
                    row.inventoryStatus,
                    row.status,
                ].some((value) => value.toLowerCase().includes(query));
            if (!matchesSearch)
                return false;
            if (filters.inventoryStatus && row.inventoryStatus !== filters.inventoryStatus)
                return false;
            if (filters.location && row.location !== filters.location)
                return false;
            if (filters.condition && row.condition !== filters.condition)
                return false;
            if (filters.stagingStatus && row.stagingStatus !== filters.stagingStatus)
                return false;
            if (filters.warehouseLocation && row.warehouseLocation !== filters.warehouseLocation)
                return false;
            if (filters.dateFrom && row.taggedDate < filters.dateFrom)
                return false;
            if (filters.dateTo && row.taggedDate > filters.dateTo)
                return false;
            return true;
        });
    });
    const totalPages = computed(() => {
        const count = Math.ceil(filteredRows.value.length / pageSize.value);
        return count > 0 ? count : 1;
    });
    const paginatedRows = computed(() => {
        const start = (page.value - 1) * pageSize.value;
        return filteredRows.value.slice(start, start + pageSize.value);
    });
    const activeColumns = computed(() => columns.value.filter((column) => visibleColumns[column.key]));
    const totalRows = computed(() => rows.value.length);
    watch([searchQuery, pageSize, () => ({ ...filters })], () => {
        page.value = 1;
    });
    const setPage = (nextPage) => {
        page.value = Math.max(1, Math.min(nextPage, totalPages.value));
    };
    const setPageSize = (value) => {
        pageSize.value = value;
    };
    const setDensity = (value) => {
        density.value = value;
    };
    const toggleColumn = (key) => {
        const column = columns.value.find((item) => item.key === key);
        if (!column || column.hideable === false)
            return;
        visibleColumns[key] = !visibleColumns[key];
    };
    const applyFilters = (nextFilters) => {
        Object.assign(filters, nextFilters);
    };
    const clearFilters = () => {
        Object.assign(filters, defaultFilters());
    };
    return {
        rows,
        columns,
        searchQuery,
        density,
        pageSize,
        page,
        filters,
        filterOptions,
        visibleColumns,
        activeColumns,
        filteredRows,
        paginatedRows,
        totalPages,
        totalRows,
        setPage,
        setPageSize,
        setDensity,
        toggleColumn,
        applyFilters,
        clearFilters,
    };
}
