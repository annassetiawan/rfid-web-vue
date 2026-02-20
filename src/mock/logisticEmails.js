const names = [
    'WJKT Operations',
    'Warehouse CCC Team',
    'JAPAC Logistics',
    'UPS SCS Admin',
    'Bulog Notification',
    'Kai Distribution',
    'Linda Procurement',
    'Miftha Saristika',
    'Farhan Setiawan',
    'Dina Salsabila',
];
const domains = ['paloaltonetworks.com', 'gmail.com', 'logisticshub.co', 'supplymail.net'];
const warehouseLocations = [
    'c/o PT.Tiga-Tiga Nusantara (WJKT1)',
    'UPS SCS Taiwan Co., Ltd.',
    'JAPAC Test warehouse',
    'warehouse - WNRT1',
    'warehouse - WSSY1',
    'warehouse - WSEL1',
    'office - Jakarta',
    'office - Taipei',
];
const types = ['warehouse', 'cc'];
const dateOf = (seed) => `2026-02-${String((seed % 27) + 1).padStart(2, '0')}`;
export const logisticEmailsMock = Array.from({ length: 40 }).map((_, index) => {
    const name = names[index % names.length];
    const domain = domains[index % domains.length];
    const type = types[index % types.length];
    const warehouseLocation = warehouseLocations[index % warehouseLocations.length];
    const localPart = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    return {
        id: `LE-${String(index + 1).padStart(3, '0')}`,
        name,
        email: `${localPart}${index % 3 === 0 ? '' : index}@${domain}`,
        warehouseLocation,
        type,
        createdAt: dateOf(index + 4),
        updatedAt: dateOf(index + 10),
    };
});
