<template>
  <textarea
    v-bind="$attrs"
    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
