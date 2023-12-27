<script setup lang="ts">
import { TrainingType } from '~/utils/training'

const emit = defineEmits<{
  selectedTrait: [trait: TrainingStatus]
}>()

const inputDragon = ref('')
const selectedDragon = computed(() => dragonList.find(dragon => dragon.name[1] === inputDragon.value))
const selectedTraitIndex = ref(-1)

watch(selectedDragon, () => {
  selectedTraitIndex.value = -1
})

watch(selectedTraitIndex, emitSelectedTrait)

function emitSelectedTrait() {
  if (selectedTraitIndex.value === -1 || !selectedDragon.value)
    return

  const selectedTraitKey = selectedDragon.value.traitsEn[selectedTraitIndex.value]
  const trait = selectedDragon.value[selectedTraitKey] as number[]
  if (trait)
    emit('selectedTrait', {
      [TrainingType.agility]: trait[0],
      [TrainingType.focus]: trait[1],
      [TrainingType.intellect]: trait[2],
      [TrainingType.strength]: trait[3],
    })
}
</script>

<template>
  <form v-if="dragonList.length" class="flex">
    <div class="flex-1">
      <input v-model="inputDragon" list="dragons" class="w-full border border-r-none rounded rounded-r-0 py-2 px-3" placeholder="輸入或選擇龍 ...">
      <datalist id="dragons">
        <option v-for="dragon, i in dragonList" :key="i" :value="dragon.name[1]" />
      </datalist>
    </div>

    <label class="flex-1 flex items-center bg-slate-50 border rounded rounded-l-0">
      <div class="w-full relative">
        <select v-model="selectedTraitIndex" class="appearance-none bg-transparent focus:outline-none w-full px-3">
          <option disabled value="-1">
            {{ selectedDragon ? '選擇性格' : '-' }}
          </option>
          <template v-if="selectedDragon">
            <option v-for="trait, i in selectedDragon.traitsKo" :key="trait" :value="i">{{ trait }}</option>
          </template>
        </select>
        <div class="absolute top-1 right-3 i-tabler:chevron-down pointer-events-none" />
      </div>
    </label>

    <button
      class="flex items-center justify-center py-2 px-2 ml-2 rounded bg-blue-100 hover:bg-blue-200 text-blue disabled:grayscale disabled:pointer-events-none"
      :disabled="selectedTraitIndex === -1"
      @click.prevent="emitSelectedTrait"
    >
      <div class="i-tabler:refresh text-2xl" />
    </button>
  </form>
</template>
