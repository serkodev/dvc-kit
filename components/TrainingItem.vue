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
    basicScore.value = Number.parseInt(value) || 0
  },
})

const inputTrainedScore = computed<string>({
  get() {
    return trainedScore.value === 0 ? '' : trainedScore.value.toString()
  },
  set(value) {
    trainedScore.value = Number.parseInt(value) || 0
  },
})

const totalScore = computed(() => basicScore.value + trainedScore.value)
watch(totalScore, (score) => {
  emit('updateScore', score)
})
</script>

<template>
  <TrainingItemFrame :type="type">
    <div class="flex gap-2 px-4 py-2 justify-between">
      <div class="flex items-center justify-center gap-2">
        <span class="text-sm text-green-700">基礎值</span>
        <input v-model.number="inputBasicScore" class="input-score bg-green-200 text-green-900 placeholder:text-green-500" type="number" placeholder="0">
      </div>

      <div class="flex items-center justify-center gap-2">
        <span class="text-sm text-yellow-500">已訓練 +</span>
        <input v-model.number="inputTrainedScore" class="input-score bg-yellow-100 text-yellow-700 placeholder:text-yellow-400" type="number" placeholder="0">
      </div>
    </div>
  </TrainingItemFrame>
</template>

<style scoped>
.input-score {
  --at-apply:  input-number-hide-spin rounded text-center py-2 w-12 h-8 text-lg  font-semibold;
}
</style>
