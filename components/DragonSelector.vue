<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Tab,
  TabGroup,
  TabList,
  TransitionRoot,
} from '@headlessui/vue'

import { TrainingType } from '~/utils/training'

const props = defineProps<{
  userInputBasicStatus?: TrainingStatus
}>()

const emit = defineEmits<{
  selectedTrait: [trait: TrainingStatus]
}>()

const query = ref('')
const selectedDragon = ref<Dragon>()
const selectedTraitIndex = ref<number>(-1)

const selectedTrait = computed(() => {
  if (!selectedDragon.value || selectedTraitIndex.value === -1)
    return null
  return selectedDragon.value.traits[selectedTraitIndex.value].status
})

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

const normalizedInput = computed(() => {
  if (!props.userInputBasicStatus)
    return null

  return normalizeStatus(props.userInputBasicStatus)
})

const isMatchUserInput = computed(() => {
  if (!props.userInputBasicStatus || !selectedTrait.value)
    return false

  return JSON.stringify(normalizedInput.value) === JSON.stringify(selectedTrait.value)
})

watch(selectedDragon, () => {
  selectTraits(0)
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

function selectTraits(index: number) {
  if (!selectedDragon.value || selectedDragon.value.traits.length <= index) {
    selectedTraitIndex.value = -1
    return
  }
  selectedTraitIndex.value = index
  emitSelectedTrait()
}
</script>

<template>
  <div>
    <form v-if="dragonList.length" class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <Combobox v-model="selectedDragon" class="z10">
          <div class="relative">
            <div
              class="relative w-full rounded-lg border cursor-default overflow-hidden bg-white text-left"
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
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white  text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
              >
                <div v-if="!selectedDragon" class="px-4 py-2 text-blue-400 font-semibold bg-white border-b">
                  艾弗利亞專屬品種的預設個性是固定的，不會出現在本選單中。
                </div>

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

      <TabGroup v-if="selectedDragon" class="flex-1" :selected-index="selectedTraitIndex">
        <TabList class="flex space-x-1 rounded-xl bg-yellow-900/20 p-1">
          <Tab
            v-for="trait, i in selectedDragon.traits"
            :key="i"
            as="template"
          >
            <button
              class="w-full rounded-lg py-2 font-medium leading-5 focus:outline-none" :class="[
                selectedTraitIndex === i && isMatchUserInput
                  ? 'bg-white text-yellow-700 shadow'
                  : 'text-yellow-700 op-50 hover:bg-white/[0.12] hover:op-65',
              ]"
              @click="selectTraits(i)"
            >
              {{ trait.name }}
            </button>
          </Tab>
        </TabList>
      </TabGroup>
    </form>
  </div>
</template>
