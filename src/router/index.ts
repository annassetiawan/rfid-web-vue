import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/demo/inventory',
    name: 'inventory-demo',
    component: () => import('../pages/InventoryDemoPage.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard/overview',
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard/overview',
        name: 'dashboard-overview',
        component: () => import('../pages/dashboard/OverviewPage.vue'),
      },
      {
        path: 'requests/local',
        name: 'requests-local',
        component: () => import('../pages/requests/LocalRequestsPage.vue'),
      },
      {
        path: 'requests/local/new',
        name: 'requests-local-new',
        component: () => import('../pages/requests/NewLocalRequestPage.vue'),
      },
      {
        path: 'requests/local/:id',
        name: 'requests-local-detail',
        component: () => import('../pages/requests/LocalRequestDetailPage.vue'),
      },
      {
        path: 'requests/local/:id/edit',
        name: 'requests-local-edit',
        component: () => import('../pages/requests/LocalRequestEditPage.vue'),
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('../pages/inventory/InventoryPage.vue'),
      },
      {
        path: 'master-data/units',
        name: 'master-data-units',
        component: () => import('../pages/master-data/UnitsPage.vue'),
      },
      {
        path: 'master-data/unit-relation',
        name: 'master-data-unit-relation',
        component: () => import('../pages/master-data/UnitRelationPage.vue'),
      },
      {
        path: 'cycle-count',
        name: 'cycle-count',
        component: () => import('../pages/cycle-count/CycleCountPage.vue'),
      },
      {
        path: 'cycle-count/:id',
        name: 'cycle-count-detail',
        component: () => import('../pages/cycle-count/CycleCountDetailPage.vue'),
      },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('../pages/customers/CustomersPage.vue'),
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: () => import('../pages/warehouses/WarehousesPage.vue'),
      },
      {
        path: 'scanner',
        name: 'scanner',
        component: () => import('../pages/scanner/ScannerPage.vue'),
      },
      {
        path: 'logistic-email',
        name: 'logistic-email',
        component: () => import('../pages/logistic-email/LogisticEmailPage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        path: 'support-center',
        name: 'support-center',
        component: () => import('../pages/support-center/SupportCenterPage.vue'),
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../pages/search/SearchPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
