<template>
  <section class="space-y-6">
    <header class="space-y-4">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Dashboard</p>
        <h1 class="text-2xl font-semibold tracking-tight">Operations Summary</h1>
        <p class="text-sm text-muted-foreground">Real-time overview of requests, labels, and warehouse movement.</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <Input value="01/20/2026, 10:27 - 02/19/2026, 10:27" class="h-9" />
        <Select class="h-9">
          <option>All Warehouse</option>
          <option>Warehouse A</option>
          <option>Warehouse B</option>
          <option>Warehouse C</option>
        </Select>
      </div>
    </header>

    <div class="grid gap-4 lg:grid-cols-4">
      <Card v-for="item in dashboardKpis" :key="item.key" class="rounded-lg">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs text-muted-foreground">{{ item.title }}</p>
              <p class="text-2xl font-semibold">{{ item.value }}</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40">
              <component :is="kpiIcons[item.key]" class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 pt-0">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">{{ item.helper }}</span>
            <Badge :variant="item.key === 'transit' ? 'default' : 'secondary'">{{ item.value }}</Badge>
          </div>
          <div class="h-2 rounded-full bg-muted">
            <div
              class="h-2 rounded-full"
              :class="item.key === 'pickup' || item.key === 'missing' ? 'bg-muted-foreground/30' : 'bg-primary'"
              :style="{ width: `${item.progress}%` }"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-lg">
      <CardHeader>
        <h2 class="text-base font-semibold">Label Management</h2>
      </CardHeader>
      <CardContent class="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div class="flex items-center justify-between rounded-lg border bg-accent/40 p-5">
          <div>
            <p class="text-3xl font-semibold">150</p>
            <p class="text-sm text-muted-foreground">Your Warehouse Label</p>
          </div>
          <Badge variant="secondary">Updated today</Badge>
        </div>
        <div class="rounded-lg border p-5">
          <div class="flex items-center gap-2">
            <Tag class="h-4 w-4 text-muted-foreground" />
            <p class="text-sm font-medium">Pearl Paper Label</p>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Untagged Label</span>
              <span class="font-medium">0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Tagged Label</span>
              <span class="font-medium">60</span>
            </div>
          </div>
        </div>
        <div class="rounded-lg border p-5">
          <div class="flex items-center gap-2">
            <Tags class="h-4 w-4 text-muted-foreground" />
            <p class="text-sm font-medium">Anti Metal Tag</p>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Untagged Label</span>
              <span class="font-medium">0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Tagged Label</span>
              <span class="font-medium">49</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-4 xl:grid-cols-2">
      <Card class="rounded-lg">
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <h2 class="text-base font-semibold">Delivery Request</h2>
            <p class="text-sm text-muted-foreground">Daily trend in the selected period.</p>
          </div>
          <ChartLegend :items="deliveryLegend" />
        </CardHeader>
        <CardContent>
          <VisXYContainer :data="deliveryChartSeries" :height="260" :padding="{ top: 12, right: 16, bottom: 32, left: 36 }">
            <VisStackedBar :x="(d: ChartSeriesPoint) => d.x" :y="(d: ChartSeriesPoint) => d.total" :color="() => 'hsl(var(--primary))'" :rounded-corners="4" />
            <VisAxis type="x" :grid-line="false" :tick-format="formatDeliveryTick" :tick-text-color="'hsl(var(--muted-foreground))'" />
            <VisAxis type="y" :tick-line="false" :domain-line="false" :tick-text-color="'hsl(var(--muted-foreground))'" />
            <VisTooltip />
          </VisXYContainer>
        </CardContent>
      </Card>

      <Card class="rounded-lg">
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <h2 class="text-base font-semibold">Pickup Request</h2>
            <p class="text-sm text-muted-foreground">Daily pickup movement by date.</p>
          </div>
          <ChartLegend :items="pickupLegend" />
        </CardHeader>
        <CardContent>
          <VisXYContainer :data="pickupChartSeries" :height="260" :padding="{ top: 12, right: 16, bottom: 32, left: 36 }">
            <VisStackedBar :x="(d: ChartSeriesPoint) => d.x" :y="(d: ChartSeriesPoint) => d.total" :color="() => 'hsl(var(--accent-foreground))'" :rounded-corners="4" />
            <VisAxis type="x" :grid-line="false" :tick-format="formatPickupTick" :tick-text-color="'hsl(var(--muted-foreground))'" />
            <VisAxis type="y" :tick-line="false" :domain-line="false" :tick-text-color="'hsl(var(--muted-foreground))'" />
            <VisTooltip />
          </VisXYContainer>
        </CardContent>
      </Card>
    </div>

    <WarehouseMapCard :points="warehouseMapPoints" />
  </section>
</template>

<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts'
import { Box, CircleAlert, PackageCheck, Truck, Tag, Tags } from 'lucide-vue-next'
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import WarehouseMapCard from '@/components/dashboard/WarehouseMapCard.vue'
import { ChartLegend } from '@/components/ui/chart'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import {
  dashboardKpis,
  deliveryChartData,
  pickupChartData,
  warehouseMapPoints
} from '@/mock/dashboard'

type ChartSeriesPoint = {
  x: number
  label: string
  total: number
}

const deliveryChartSeries: ChartSeriesPoint[] = deliveryChartData.map((item, index) => ({
  x: index,
  label: item.date,
  total: item.total,
}))

const pickupChartSeries: ChartSeriesPoint[] = pickupChartData.map((item, index) => ({
  x: index,
  label: item.date,
  total: item.total,
}))

const kpiIcons = {
  delivery: Truck,
  pickup: PackageCheck,
  missing: CircleAlert,
  transit: Box,
}

const deliveryLegend: BulletLegendItemInterface[] = [
  { name: 'Delivery', color: 'hsl(var(--primary))', inactive: false },
]

const pickupLegend: BulletLegendItemInterface[] = [
  { name: 'Pickup', color: 'hsl(var(--accent-foreground))', inactive: false },
]

const formatDeliveryTick = (tick: number | Date) => {
  if (typeof tick !== 'number') return ''
  return deliveryChartSeries[tick]?.label ?? ''
}

const formatPickupTick = (tick: number | Date) => {
  if (typeof tick !== 'number') return ''
  return pickupChartSeries[tick]?.label ?? ''
}
</script>
