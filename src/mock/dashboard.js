export const dashboardKpis = [
    { key: 'delivery', title: 'Delivery Request', value: 2, helper: 'Processed', progress: 100 },
    { key: 'pickup', title: 'Pickup Request', value: 0, helper: 'Processed', progress: 0 },
    { key: 'missing', title: 'Missing Part', value: 0, helper: 'No issue', progress: 0 },
    { key: 'transit', title: 'In Transit', value: 36, helper: 'Active flow', progress: 72 },
];
export const deliveryChartData = [
    { date: '20/1', total: 0 },
    { date: '23/1', total: 0 },
    { date: '27/1', total: 1 },
    { date: '30/1', total: 0 },
    { date: '03/2', total: 0 },
    { date: '08/2', total: 0 },
    { date: '13/2', total: 4 },
    { date: '19/2', total: 0 },
];
export const pickupChartData = [
    { date: '20/1', total: 0 },
    { date: '23/1', total: 0 },
    { date: '27/1', total: 0 },
    { date: '30/1', total: 0 },
    { date: '03/2', total: 0 },
    { date: '08/2', total: 0 },
    { date: '13/2', total: 1 },
    { date: '19/2', total: 0 },
];
export const warehouseMapPoints = [
    { id: 'wh-jkt', name: 'Warehouse Jakarta', city: 'Jakarta', latitude: -6.2088, longitude: 106.8456, status: 'active' },
    { id: 'wh-sby', name: 'Warehouse Surabaya', city: 'Surabaya', latitude: -7.2575, longitude: 112.7521, status: 'active' },
    { id: 'wh-sgp', name: 'Warehouse Singapore', city: 'Singapore', latitude: 1.3521, longitude: 103.8198, status: 'warning' },
    { id: 'wh-tok', name: 'Warehouse Tokyo', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503, status: 'active' },
    { id: 'wh-dxb', name: 'Warehouse Dubai', city: 'Dubai', latitude: 25.2048, longitude: 55.2708, status: 'warning' },
];
