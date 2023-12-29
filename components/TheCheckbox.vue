<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel()
</script>

<template>
  <label class="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-300">
    <input v-model="modelValue" v-bind="$attrs" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded">

    <slot />
  </label>
</template>
