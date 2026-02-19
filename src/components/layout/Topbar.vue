<template>
  <header class="border-b bg-background/95 backdrop-blur">
    <div class="flex h-14 items-center gap-3 px-4 sm:px-6">
      <Button variant="ghost" class="px-3 md:hidden" @click="$emit('toggleMenu')">
        Menu
      </Button>
      <div class="hidden min-w-[140px] text-sm font-medium md:block">
        {{ title || 'Dashboard' }}
      </div>

      <div class="flex flex-1 items-center">
        <Input
          type="search"
          placeholder="Search inventory, requests, RFID code..."
          class="w-full md:max-w-md"
        />
      </div>

      <DropdownMenu>
        <template #trigger>
          <Button variant="outline" class="px-3">Admin</Button>
        </template>
        <button type="button" class="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted">
          Profile
        </button>
        <button type="button" class="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted">
          Settings
        </button>
        <button type="button" class="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted">
          Sign out
        </button>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import DropdownMenu from '@/components/ui/DropdownMenu.vue'
import Input from '@/components/ui/Input.vue'

defineProps<{
  title?: string
}>()

defineEmits<{
  toggleMenu: []
}>()
</script>
