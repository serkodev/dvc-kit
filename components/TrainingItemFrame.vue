<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="of-hidden rounded-lg bg-green-100 ring-1 ring-green-200">
    <div class="py-2 text-center">
      <div class="font-bold">
        {{ title }}
      </div>
    </div>

    <slot />
  </div>
</template>
