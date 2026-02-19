<template>
  <section>
    <PageHeader title="Cycle Count Detail" subtitle="Inspect an individual cycle count run by its identifier." action-label="Mark Complete" />

    <div class="rounded-lg border border-slate-200 bg-white p-6">
      <p class="text-sm text-slate-600">Showing details for cycle count id: <span class="font-semibold text-slate-900">{{ id }}</span>.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PageHeader from '../../components/common/PageHeader.vue'

const route = useRoute()
const id = computed(() => route.params.id)
</script>

