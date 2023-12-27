<script setup lang="ts">
import { TrainingType } from '~/utils/training'
import type { Personality } from '~/utils/personalities'

const selectedPersonality = ref<Personality>(personalities.meticulous)

const inputsBasic = ref({
  [TrainingType.agility]: 0,
  [TrainingType.focus]: 0,
  [TrainingType.intellect]: 0,
  [TrainingType.strength]: 0,
})

const inputsTrained = ref({
  [TrainingType.agility]: 0,
  [TrainingType.focus]: 0,
  [TrainingType.intellect]: 0,
  [TrainingType.strength]: 0,
})

const enableOptions = ref(false)
const customOperations = ref(allTrainingOperationsExpectFocus59)

const result = ref<TrainingOperation[] | null | undefined>(undefined)
const resultTrainedStatus = ref<TrainingStatus>({
  [TrainingType.agility]: 0,
  [TrainingType.focus]: 0,
  [TrainingType.intellect]: 0,
  [TrainingType.strength]: 0,
})

const loading = ref(false)

const groupedResult = computed(() => {
  const group: Record<TrainingType, TrainingScore[]> = {
    [TrainingType.agility]: [],
    [TrainingType.focus]: [],
    [TrainingType.intellect]: [],
    [TrainingType.strength]: [],
  }

  if (result.value) {
    for (const operation of result.value) {
      group[operation.type].push(operation.score)
    }
  }

  return group
})

const notes = computed(() => {
  if (!selectedPersonality.value || !result.value)
    return ''

  return `${selectedPersonality.value.title} 個性訓練計劃\n${resultNotes(result.value)}`
})

const { copy, copied, isSupported } = useClipboard({ source: notes })

async function handleSubmit() {
  if (!selectedPersonality.value || loading.value)
    return

  loading.value = true

  const status = {
    [TrainingType.agility]: inputsBasic.value[TrainingType.agility] + inputsTrained.value[TrainingType.agility],
    [TrainingType.focus]: inputsBasic.value[TrainingType.focus] + inputsTrained.value[TrainingType.focus],
    [TrainingType.intellect]: inputsBasic.value[TrainingType.intellect] + inputsTrained.value[TrainingType.intellect],
    [TrainingType.strength]: inputsBasic.value[TrainingType.strength] + inputsTrained.value[TrainingType.strength],
  }

  setTimeout(() => {
    try {
      result.value = calcMinimumOperations(
        status,
        (enableOptions.value ? JSON.parse(JSON.stringify(customOperations.value)) : undefined),
        selectedPersonality.value!.requirements,
      )
      resultTrainedStatus.value = JSON.parse(JSON.stringify(inputsTrained.value))
    } catch (e) {
      console.error(e)
      result.value = null
    }
    loading.value = false
  }, 100)
}

watch(selectedPersonality, () => {
  result.value = undefined
})

function handleSelectedTrait(trait: TrainingStatus) {
  Object.assign(inputsBasic.value, trait)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="mt-4 mb-3 text-2xl font-semibold">
        個性訓練計算器
      </h1>

      本工具可以幫助你計算出達成目標個性所需的最少訓練次數，並且自動產生龍的註釋，讓你可以輕鬆地在遊戲中進行訓練。
    </div>

    <DragonSelector @selected-trait="handleSelectedTrait" />

    <form class="space-y-8" @submit.prevent="handleSubmit">
      <section>
        <div class="grid sm:grid-cols-2 gap-2">
          <TrainingItem
            v-model:basic="inputsBasic[TrainingType.agility]"
            v-model:trained="inputsTrained[TrainingType.agility]"
            :type="TrainingType.agility"
          />
          <TrainingItem
            v-model:basic="inputsBasic[TrainingType.strength]"
            v-model:trained="inputsTrained[TrainingType.strength]"
            :type="TrainingType.strength"
          />
          <TrainingItem
            v-model:basic="inputsBasic[TrainingType.focus]"
            v-model:trained="inputsTrained[TrainingType.focus]"
            :type="TrainingType.focus"
          />
          <TrainingItem
            v-model:basic="inputsBasic[TrainingType.intellect]"
            v-model:trained="inputsTrained[TrainingType.intellect]"
            :type="TrainingType.intellect"
          />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">
          目標個性
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-1">
          <button
            v-for="personality, key in personalities"
            :key="key"
            class="rounded px3 py-2"
            :class="selectedPersonality?.title === personality.title ? 'bg-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200'"
            @click.prevent="selectedPersonality = personality"
          >
            {{ personality.title }}
          </button>
        </div>

        <div v-if="selectedPersonality">
          <div>
            <div class="text-lg font-semibold mb-1">
              {{ selectedPersonality.title }}
            </div>
            {{ selectedPersonality.description }}
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          特殊訓練要求
          <TheSwitcher v-model="enableOptions" />
        </h2>

        <template v-if="enableOptions">
          <div class="my-2 text-sm text-neutral-500">
            當把部份訓練取消勾選時，計算時將強制不會使用該訓練的分數。<br>
            例如你可以把比較難玩的集中力 +5 及 +9 取消勾選，來增加訓練的成功率。
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <TrainingOptions v-model="customOperations" :type="TrainingType.agility" />
            <TrainingOptions v-model="customOperations" :type="TrainingType.strength" />
            <TrainingOptions v-model="customOperations" :type="TrainingType.focus" />
            <TrainingOptions v-model="customOperations" :type="TrainingType.intellect" />
          </div>
        </template>
      </section>

      <input
        class="w-full py-2.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        :disabled="loading || !selectedPersonality"
        :value="loading ? '計算中...' : '計算'"
      >
    </form>

    <div v-if="!loading && result !== undefined">
      <h1 class="my-4 text-2xl font-semibold">
        計算結果
      </h1>
      <div v-if="result === null" class="bg-red-200 py-4 text-center rounded-lg text-red-600">
        目標無法達成，或訓練次數過多
      </div>
      <div v-else-if="result.length === 0" class="bg-green-200 py-4 text-center rounded-lg text-green-600">
        已達成目標，無需進行訓練
      </div>
      <template v-else>
        <div class="mb-4">
          你需要進行最少 <span class="text-red-500 font-semibold">{{ result.length }}</span> 次訓練才能達成目標
        </div>
        <div class="grid sm:grid-cols-2 gap-2">
          <TrainingResult :type="TrainingType.agility" :trained-score="resultTrainedStatus[TrainingType.agility]" :scores="groupedResult[TrainingType.agility]" />
          <TrainingResult :type="TrainingType.strength" :trained-score="resultTrainedStatus[TrainingType.strength]" :scores="groupedResult[TrainingType.strength]" />
          <TrainingResult :type="TrainingType.focus" :trained-score="resultTrainedStatus[TrainingType.focus]" :scores="groupedResult[TrainingType.focus]" />
          <TrainingResult :type="TrainingType.intellect" :trained-score="resultTrainedStatus[TrainingType.intellect]" :scores="groupedResult[TrainingType.intellect]" />
        </div>

        <h2 class="mt-8 mb-4 text-xl font-semibold">
          龍的註釋
        </h2>

        <div class="my-2 text-sm text-neutral-500">
          你可以把以下內容粘貼到龍的註釋中，並在每次完成訓練後在 [ ] 內打勾。
        </div>

        <div>
          <pre class="p-2 bg-neutral-100 rounded-lg">{{ notes }}</pre>
          <button
            v-if="isSupported"
            class="mt-3 w-full py-2.5 rounded-lg"
            :class="[
              copied ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            ]"
            @click="copy()"
          >
            <span v-if="copied">已複製</span>
            <span v-else>複製到剪貼簿</span>
          </button>
          <div v-else class="w-full py-2.5 text-center text-neutral text-sm">
            請自行複製註釋文字
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
