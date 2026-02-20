export type ScannerState = 'new' | 'working' | 'faulty' | 'test'

export type Scanner = {
  id: string
  serialNumber: string
  modelName: string
  brand: string
  location: string
  description: string
  state: ScannerState
  createdAt: string
  updatedAt: string
}

const brands = ['Zebra', 'Honeywell', 'Urovo', 'Unitech', 'Chainway']
const models = ['RFD40', '8680i', 'DT50', 'EA630', 'C72']
const locations = ['Warehouse A', 'Warehouse B', 'Dock 1', 'Dock 2', 'Staging Area', 'Packing Zone']
const states: ScannerState[] = ['new', 'working', 'faulty', 'test']

const dateOf = (seed: number) => {
  const day = ((seed % 27) + 1).toString().padStart(2, '0')
  return `2026-02-${day}`
}

export const scannersMock: Scanner[] = Array.from({ length: 18 }).map((_, index) => {
  const serial = `SCN-${String(4400 + index)}`
  const brand = brands[index % brands.length]
  const modelName = models[index % models.length]
  const location = locations[index % locations.length]
  const state = states[index % states.length]
  const createdAt = dateOf(index + 2)
  const updatedAt = dateOf(index + 10)

  return {
    id: `SC-${String(index + 1).padStart(3, '0')}`,
    serialNumber: serial,
    modelName,
    brand,
    location,
    description: `${brand} ${modelName} assigned to ${location}`,
    state,
    createdAt,
    updatedAt,
  }
})

