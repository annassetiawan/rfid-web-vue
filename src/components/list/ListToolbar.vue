<template>
  <div class="flex items-center justify-between gap-2 py-4 px-4">
    <div class="min-w-0 flex-1">
      <slot name="search" />
    </div>
    <div class="ml-auto flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
