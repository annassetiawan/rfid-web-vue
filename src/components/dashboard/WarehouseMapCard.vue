<template>
  <Card class="rounded-lg">
    <CardHeader>
      <h2 class="text-base font-semibold">Warehouse Positions</h2>
      <p class="text-sm text-muted-foreground">Live warehouse locations with mocked status markers.</p>
    </CardHeader>
    <CardContent>
      <div ref="mapRef" class="h-[320px] w-full rounded-lg border" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import type { WarehouseMapPoint } from '@/mock/dashboard'

const props = defineProps<{
  points: WarehouseMapPoint[]
}>()

const mapRef = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapRef.value) return

  map = L.map(mapRef.value, {
    zoomControl: true,
    attributionControl: true,
  }).setView([-2.5, 117], 4)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  props.points.forEach((point) => {
    const color = point.status === 'active' ? '#16a34a' : '#f59e0b'
    L.circleMarker([point.latitude, point.longitude], {
      radius: 7,
      weight: 2,
      color,
      fillColor: color,
      fillOpacity: 0.85,
    })
      .addTo(map as L.Map)
      .bindPopup(`<strong>${point.name}</strong><br/>${point.city} (${point.status})`)
  })
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
