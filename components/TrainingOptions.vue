<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

defineProps<{
  type: TrainingType
}>()

const operations = defineModel<TrainingOperation[]>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      <TheCheckbox v-model="operations" :value="{ type, score: 3 }">
        +3
      </TheCheckbox>
    </div>
    <div>
      <TheCheckbox v-model="operations" :value="{ type, score: 5 }">
        +5
      </TheCheckbox>
    </div>
    <div>
      <TheCheckbox v-model="operations" :value="{ type, score: 9 }">
        +9
      </TheCheckbox>
    </div>
  </div>
</template>
