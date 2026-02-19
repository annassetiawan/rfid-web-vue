<template>
  <main class="container max-w-4xl py-6 space-y-4">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
    <h1 class="text-2xl font-semibold tracking-tight">Request Detail</h1>
    <p class="text-sm text-muted-foreground">Detail page placeholder for request ID: {{ route.params.id }}</p>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
