<script setup lang="ts">
import type { TrainingType } from '~/utils/training'

const props = defineProps<{
  type: TrainingType
  trainedScore: number
  scores: TrainingScore[]
}>()

// count each scores times
const groupedScores = computed(() => {
  const group: Record<TrainingScore, number> = {
    0: 0,
    3: 0,
    5: 0,
    9: 0,
  }

  for (const score of props.scores) {
    group[score]++
  }

  return group
})

const targetScore = computed(() => props.scores.reduce<number>((acc, cur) => acc + cur, 0))
</script>

<template>
  <TrainingItemFrame :type="type">
    <div class="flex flex-col gap-2 px-3 py-3 bg-green-200 h-full">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 bg-green-900 py-1 justify-center rounded">
          <span class="text-green-200">目標訓練值</span>
          <span class="text-yellow-300">(+{{ targetScore + trainedScore }})</span>
        </div>
        <div v-if="trainedScore > 0" class="flex">
          <div class="flex gap-2 text-sm text-green-500">
            已訓練值: {{ trainedScore }} (尚欠: {{ targetScore }})
          </div>
        </div>
      </div>

      <div>
        <template v-for="times, score in groupedScores" :key="score">
          <div v-if="times > 0">
            {{ titleForScore(score) }}
            <span class="text-red-500">× {{ times }}</span>
          </div>
        </template>
      </div>
    </div>
  </TrainingItemFrame>
</template>
