<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

const props = defineProps<{
  type: TrainingType
}>()

const iconClass = computed(() => [
  'i-mingcute-shoe-fill -scale-x-100',
  'i-mdi-arm-flex',
  'i-ant-design-aim-outlined',
  'i-majesticons-book-open',
][props.type])
</script>

<template>
  <div :class="iconClass" />
</template>
