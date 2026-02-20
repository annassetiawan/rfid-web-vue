export type MasterUnitCategory = 'main' | 'accessory'
export type MasterUnitStatus = 'active' | 'inactive'

export type MasterUnit = {
  id: string
  name: string
  category: MasterUnitCategory
  status: MasterUnitStatus
  imageUrl?: string
  updatedAt: string
}

const dateOf = (seed: number) => {
  const day = ((seed % 27) + 1).toString().padStart(2, '0')
  return `2026-02-${day}`
}

const namesMain = ['PAN-PA-M-100', 'PAN-PA-M-220', 'RFID Cart Unit', 'Smart Bin Reader', 'Dock Reader Pro', 'Warehouse Base Hub']
const namesAccessory = ['Power Cord', 'Mount Bracket', 'RFID Label Kit', 'Antenna Extension', 'Cable Lock Set', 'Adapter Module']

export const masterUnitsMock: MasterUnit[] = Array.from({ length: 20 }).map((_, index) => {
  const category: MasterUnitCategory = index % 3 === 0 ? 'accessory' : 'main'
  const source = category === 'main' ? namesMain : namesAccessory
  const name = `${source[index % source.length]} ${String((index % 5) + 1).padStart(2, '0')}`

  return {
    id: `MU-${String(index + 1).padStart(3, '0')}`,
    name,
    category,
    status: index % 5 === 0 ? 'inactive' : 'active',
    updatedAt: dateOf(index + 4),
  }
})

