<script setup lang="ts">
import { TrainingType } from '~/utils/training'

definePageMeta({
  alias: ['/personalities', '/personalities/:personality?'],
})

const route = useRoute()

const selectedPersonality = computed(() => {
  const { personality } = route.params
  return typeof personality === 'string' ? personalities[personality] : null
})

const inputs = shallowRef({
  basic: {
    [TrainingType.agility]: 0,
    [TrainingType.focus]: 0,
    [TrainingType.intellect]: 0,
    [TrainingType.strength]: 0,
  },
  trained: {
    [TrainingType.agility]: 0,
    [TrainingType.focus]: 0,
    [TrainingType.intellect]: 0,
    [TrainingType.strength]: 0,
  },
})

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

  return `${selectedPersonality.value.title} 性格訓練計劃\n${resultNotes(result.value)}`
})

const { copy, copied, isSupported } = useClipboard({ source: notes })

async function handleSubmit() {
  if (!selectedPersonality.value || loading.value)
    return

  loading.value = true

  const status = {
    [TrainingType.agility]: inputs.value.basic[TrainingType.agility] + inputs.value.trained[TrainingType.agility],
    [TrainingType.focus]: inputs.value.basic[TrainingType.focus] + inputs.value.trained[TrainingType.focus],
    [TrainingType.intellect]: inputs.value.basic[TrainingType.intellect] + inputs.value.trained[TrainingType.intellect],
    [TrainingType.strength]: inputs.value.basic[TrainingType.strength] + inputs.value.trained[TrainingType.strength],
  }

  setTimeout(() => {
    try {
      result.value = calcMinimumOperations(status, selectedPersonality.value!.requirements)
      resultTrainedStatus.value = inputs.value.trained
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
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="mt-4 text-2xl font-semibold">
      訓練性格計算器
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-1">
      <NuxtLink
        v-for="personality, key in personalities"
        :key="key"
        active-class="bg-neutral-300"
        class="rounded bg-neutral-100 hover:bg-neutral-200 px3 py-2"
        :to="`/personalities/${key}`"
      >
        {{ personality.title }}
      </NuxtLink>
    </div>

    <div v-if="selectedPersonality">
      <form class="space-y-3" @submit.prevent="handleSubmit">
        <div>
          <div class="text-lg font-semibold mb-1">
            {{ selectedPersonality.title }}
          </div>
          {{ selectedPersonality.requirementsDescription }}
        </div>
        <div class="grid sm:grid-cols-2 gap-2">
          <TrainingItem
            v-model:basic="inputs.basic[TrainingType.agility]"
            v-model:trained="inputs.trained[TrainingType.agility]"
            :type="TrainingType.agility"
          />
          <TrainingItem
            v-model:basic="inputs.basic[TrainingType.strength]"
            v-model:trained="inputs.trained[TrainingType.strength]"
            :type="TrainingType.strength"
          />
          <TrainingItem
            v-model:basic="inputs.basic[TrainingType.focus]"
            v-model:trained="inputs.trained[TrainingType.focus]"
            :type="TrainingType.focus"
          />
          <TrainingItem
            v-model:basic="inputs.basic[TrainingType.intellect]"
            v-model:trained="inputs.trained[TrainingType.intellect]"
            :type="TrainingType.intellect"
          />
        </div>
        <input class="w-full py-2.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg cursor-pointer" type="submit" :disabled="loading" :value="loading ? '計算中...' : '計算'">
      </form>
    </div>

    <div v-if="!loading && result !== undefined">
      <h1 class="my-4 text-2xl font-semibold">
        計算結果
      </h1>
      <div v-if="result === null" class="bg-red-200 py-4 text-center rounded-lg text-red-600">
        目標無法達成
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
