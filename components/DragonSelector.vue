<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'

import { type TrainingStatusNormalized, TrainingType } from '~/utils/training'

const props = defineProps<{
  userInputBasicStatus?: TrainingStatus
}>()

const emit = defineEmits<{
  selectedTrait: [trait: TrainingStatus]
}>()

const query = ref('')
const selectedDragon = ref<Dragon>()
const selectedTrait = ref<TrainingStatusNormalized | null>(null)

const filteredDragonList = computed(() =>
  query.value === ''
    ? dragonList
    : dragonList.filter(dragon =>
      dragon.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

const isShowRefreshButton = computed(() => {
  if (!props.userInputBasicStatus || !selectedTrait.value)
    return false

  // check if the selected trait is the same as the current user input basic status
  return props.userInputBasicStatus[TrainingType.agility] !== selectedTrait.value[0]
    || props.userInputBasicStatus[TrainingType.focus] !== selectedTrait.value[1]
    || props.userInputBasicStatus[TrainingType.intellect] !== selectedTrait.value[2]
    || props.userInputBasicStatus[TrainingType.strength] !== selectedTrait.value[3]
})

watch(selectedDragon, () => {
  selectedTrait.value = null
})

watch(selectedTrait, emitSelectedTrait)

function emitSelectedTrait() {
  if (!selectedTrait.value || !selectedDragon.value)
    return

  const trait = selectedTrait.value
  if (trait)
    emit('selectedTrait', {
      [TrainingType.agility]: trait[0],
      [TrainingType.strength]: trait[1],
      [TrainingType.focus]: trait[2],
      [TrainingType.intellect]: trait[3],
    })
}
</script>

<template>
  <div>
    <form v-if="dragonList.length" class="flex">
      <div class="flex-1">
        <Combobox v-model="selectedDragon" class="z10">
          <div class="relative">
            <div
              class="relative w-full rounded rounded-r-0 border border-r-none cursor-default overflow-hidden bg-white text-left"
            >
              <ComboboxButton>
                <ComboboxInput
                  placeholder="輸入或選擇龍 ..."
                  class="w-full py-2.5 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0 focus:outline-none"
                  :display-value="(dragon) => (dragon as any).name"
                  @change="query = $event.target.value"
                />
              </ComboboxButton>
              <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <div class="i-tabler:chevron-down text-lg" />
              </ComboboxButton>
            </div>
            <TransitionRoot
              leave="transition ease-in duration-100"
              leave-from="opacity-100"
              leave-to="opacity-0"
              @after-leave="query = ''"
            >
              <ComboboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
              >
                <div
                  v-if="filteredDragonList.length === 0 && query !== ''"
                  class="relative cursor-default select-none px-4 py-2 text-gray-700"
                >
                  沒有找到符合的龍
                </div>

                <ComboboxOption
                  v-for="dragon, i in filteredDragonList"
                  :key="i"
                  v-slot="{ selected, active }"
                  as="template"
                  :value="dragon"
                >
                  <li
                    class="relative cursor-default select-none py-2 pl-4 pr-4"
                    :class="{
                      'bg-blue-600 text-white': active,
                      'text-gray-900': !active,
                    }"
                  >
                    <span
                      class="block truncate"
                      :class="{ 'font-medium': selected, 'font-normal': !selected }"
                    >
                      {{ dragon.name }}
                    </span>

                    <span
                      v-if="selected"
                      class="absolute inset-y-0 right-0 flex items-center pr-3"
                      :class="{ 'text-white': active, 'text-blue-600': !active }"
                    >
                      <div class="i-tabler-check text-lg" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>

        <datalist id="dragons">
          <option v-for="dragon, i in dragonList" :key="i" :value="dragon.name" />
        </datalist>
      </div>

      <label class="flex-1 flex items-center bg-slate-50 border rounded rounded-l-0">
        <div class="w-full relative">
          <select v-model="selectedTrait" class="appearance-none bg-transparent focus:outline-none w-full px-3">
            <option disabled value="null">
              {{ selectedDragon ? '請選擇初始個性' : '-' }}
            </option>
            <template v-if="selectedDragon">
              <option v-for="trait, i in selectedDragon.traits" :key="i" :value="trait.status">{{ trait.name }}</option>
            </template>
          </select>
          <div class="absolute top-1 right-3 i-tabler:chevron-down pointer-events-none" />
        </div>
      </label>

      <button
        v-if="isShowRefreshButton"
        class="flex items-center justify-center py-2 px-2 ml-2 rounded bg-blue-100 hover:bg-blue-200 text-blue disabled:grayscale disabled:pointer-events-none"
        :disabled="!selectedTrait"
        @click.prevent="emitSelectedTrait"
      >
        <div class="i-tabler:refresh text-2xl" />
      </button>
    </form>

    <div class="text-sm text-gray-400 mt-2">
      由於在「艾弗利亞」專屬品種的預設個性是固定的，因此不會出現在選單中。
    </div>
  </div>
</template>
