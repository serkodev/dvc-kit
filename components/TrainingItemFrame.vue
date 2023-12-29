<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

const props = defineProps<{
  type: TrainingType
}>()

const title = operationTypeTitle(props.type)
</script>

<template>
  <div class="of-hidden rounded-lg bg-green-50 ring-1 ring-green-200">
    <div class="py-2 flex items-center justify-center gap-2 relative">
      <TrainingIcon :type="type" class="text-xl text-green-700" />
      <div class="font-bold">
        {{ title }}
      </div>
    </div>

    <slot />
  </div>
</template>
