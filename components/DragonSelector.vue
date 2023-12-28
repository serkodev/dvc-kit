<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'

import { TrainingType } from '~/utils/training'

const emit = defineEmits<{
  selectedTrait: [trait: TrainingStatus]
}>()

const query = ref('')
const selectedDragon = ref()
const selectedTraitIndex = ref(-1)

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

watch(selectedDragon, () => {
  selectedTraitIndex.value = -1
})

watch(selectedTraitIndex, emitSelectedTrait)

function emitSelectedTrait() {
  if (selectedTraitIndex.value === -1 || !selectedDragon.value)
    return
  const trait = selectedDragon.value.traits[selectedTraitIndex.value].status
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
        <select v-model="selectedTraitIndex" class="appearance-none bg-transparent focus:outline-none w-full px-3">
          <option disabled value="-1">
            {{ selectedDragon ? '請選擇初始個性' : '-' }}
          </option>
          <template v-if="selectedDragon">
            <option v-for="trait, i in selectedDragon.traits" :key="i" :value="i">{{ trait.name }}</option>
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
