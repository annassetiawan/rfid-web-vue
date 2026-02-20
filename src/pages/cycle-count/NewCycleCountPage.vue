<template>
  <main class="container max-w-4xl py-6 space-y-6">
    <section class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cycle Count</p>
      <PageHeader
        title="Create Cycle Count"
        description="Setup a new cycle count session with warehouse scope and scheduling details."
      />
      <Separator />
    </section>

    <Card class="rounded-lg">
      <CardHeader>
        <h2 class="text-base font-semibold">New Session</h2>
        <p class="text-sm text-muted-foreground">Form implementation will follow React parity in the next step.</p>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">Use this page as the entry point from the Cycle Count list action.</p>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import PageHeader from '@/components/list/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import Separator from '@/components/ui/Separator.vue'
</script>
