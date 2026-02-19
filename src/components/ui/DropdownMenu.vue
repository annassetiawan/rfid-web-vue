<template>
  <details class="relative inline-block">
    <summary class="inline-flex list-none cursor-pointer items-center [&::-webkit-details-marker]:hidden">
      <slot name="trigger" />
    </summary>
    <div class="absolute right-0 z-50 mt-2 min-w-44 rounded-lg border bg-card p-1 text-card-foreground shadow-md">
      <slot />
    </div>
  </details>
</template>
