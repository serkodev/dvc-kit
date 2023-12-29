import { TrainingType } from '~/utils/training'

export const useTrainingStore = defineStore('training', () => {
  function getDefaults() {
    return {
      enableOptions: false,
      customOperations: allTrainingOperationsExpectFocus59,
      trainingOrder: [
        TrainingType.intellect,
        TrainingType.strength,
        TrainingType.agility,
        TrainingType.focus,
      ],
    }
  }

  const preference = useLocalStorage('training-preference', getDefaults(), { mergeDefaults: true })

  function reset() {
    preference.value.trainingOrder = getDefaults().trainingOrder
  }
  return { reset, preference }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTrainingStore, import.meta.hot))
