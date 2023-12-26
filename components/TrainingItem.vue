<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

defineProps<{
  type: TrainingType
}>()

const emit = defineEmits<{
  (event: 'updateScore', score: number): void
}>()

const basicScore = defineModel<number>('basic', { default: 0 })
const trainedScore = defineModel<number>('trained', { default: 0 })

const inputBasicScore = computed<string>({
  get() {
    return basicScore.value === 0 ? '' : basicScore.value.toString()
  },
  set(value) {
    basicScore.value = Number.parseInt(value)
  },
})

const inputTrainedScore = computed<string>({
  get() {
    return trainedScore.value === 0 ? '' : trainedScore.value.toString()
  },
  set(value) {
    trainedScore.value = Number.parseInt(value)
  },
})

const totalScore = computed(() => basicScore.value + trainedScore.value)
watch(totalScore, (score) => {
  emit('updateScore', score)
})
</script>

<template>
  <div class="of-hidden rounded-lg bg-green-100 ring-1 ring-green-200">
    <div class="py-2 text-center">
      <div class="font-bold">
        {{ operationTypeTitle(type) }}
      </div>
    </div>

    <div class="flex gap-2 px-4 py-2 justify-between">
      <div class="flex items-center justify-center gap-2">
        <span class="text-sm text-green-700">基礎值</span>
        <input v-model.number="inputBasicScore" class="input-score" type="number" placeholder="0">
      </div>

      <div class="flex items-center justify-center gap-2">
        <span class="text-sm text-green-700">已訓練</span>
        <input v-model.number="inputTrainedScore" class="input-score" type="number" placeholder="0">
      </div>
    </div>
  </div>
</template>

<style>
.input-score {
  --at-apply: bg-green-300 input-number-hide-spin rounded text-center py-2 w-12 h-8 text-sm;
}
</style>
