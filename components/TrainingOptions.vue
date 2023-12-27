<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

defineProps<{
  type: TrainingType
}>()

const operations = defineModel<TrainingOperation[]>()
</script>

<template>
  <TrainingItemFrame :type="type">
    <div class="grid grid-cols-3 gap-2 px-3 py-3 bg-green-200 h-full">
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
  </TrainingItemFrame>
</template>
