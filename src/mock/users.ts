export type UserRole = 'admin' | 'admin-eval' | 'warehouse-operator'
export type UserStatus = 'active' | 'inactive'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  warehouseLocation: string
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

const roles: UserRole[] = ['warehouse-operator', 'admin', 'admin-eval']
const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Dock 1', 'Staging Area']

const names = [
  'Kamal Pratama',
  'Ayu Prameswari',
  'Rizal Mahendra',
  'Dina Salsabila',
  'Farhan Setiawan',
  'Nadia Putri',
  'Mika Tanaka',
  'Jeong Tae Yang',
  'Kevin Panghsiang Hsi',
  'Cha Eun Seong',
  'Raka Wijaya',
  'Mila Pratiwi',
]

const dateOf = (seed: number) => `2026-02-${String((seed % 26) + 1).padStart(2, '0')}`

export const usersMock: User[] = Array.from({ length: 24 }).map((_, index) => {
  const role = roles[index % roles.length]
  const name = names[index % names.length]
  const first = name.split(' ')[0].toLowerCase()
  const last = name.split(' ').slice(1).join('.').toLowerCase()
  const email = `${first}.${last || 'user'}${index + 1}@rfidweb.com`
  const status: UserStatus = index % 6 === 0 ? 'inactive' : 'active'
  const date = dateOf(index + 2)
  return {
    id: `USR-${String(index + 1).padStart(3, '0')}`,
    name,
    email,
    role,
    warehouseLocation: warehouses[index % warehouses.length],
    status,
    lastLoginAt: status === 'active' ? `${date} 09:${String((index * 7) % 60).padStart(2, '0')}` : undefined,
    createdAt: date,
    updatedAt: dateOf(index + 5),
  }
})
