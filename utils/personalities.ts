import { TrainingType, allTrainingOperations } from './training'
import type { TrainingRequirements, TrainingStatus } from './training'

interface Personality {
  title: string
  requirementsDescription?: string
  requirements?: TrainingRequirements
}

export const personalities: Record<string, Personality> = {
  meticulous: {
    title: '一絲不苟的',
    requirementsDescription: '4 能力值 (基礎值+訓練值) 總和 = 100；能力值之間不得相等，否則會是「平凡的」性格',
    requirements: {
      valid: (status: TrainingStatus) => Object.values(status).every((s) => {
        return s <= 25
      }),
      goal: (v: TrainingStatus) => {
        // Check if all values are different
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j < 4; j++) {
            if (v[i as TrainingType] === v[j as TrainingType]) {
              return false
            }
          }
        }

        // Check if the sum is 100
        const total = Object.values(v).reduce((acc, cur) => acc + cur, 0)
        return total === 100
      },
    },
  },
  distracted: {
    title: '漫不經心的',
    requirementsDescription: '4 項能力值 (基礎值+訓練值) 每項能力值之間相差 ≧15 (例如：0, 15, 30, 45)；不得訓練集中力',
    requirements: {
      goal: (v: TrainingStatus) => {
        for (let i: TrainingType = 0; i < 4; i++) {
          for (let j: TrainingType = i + 1; j < 4; j++) {
            if (Math.abs(v[i] - v[j]) < 15) {
              return false
            }
          }
        }
        return true
      },
      allowedOperations: allTrainingOperations.filter(({ type }) => type !== TrainingType.focus),
    },
  },
  dull: {
    title: '平凡的',
    requirementsDescription: '4 種能力值 (基礎值+訓練值) 相同，總和 ≦100',
    requirements: {
      maxOperations: 12,
      valid: (status: TrainingStatus) => Object.values(status).every((s) => {
        return s <= 25
      }),
      goal: (v: TrainingStatus) => {
        // Check if all values are same
        for (let i: TrainingType = 0; i < 4; i++) {
          for (let j: TrainingType = i + 1; j < 4; j++) {
            if (v[i] !== v[j]) {
              return false
            }
          }
        }

        // Check if the sum is <= 100
        const total = Object.values(v).reduce((acc, cur) => acc + cur, 0)
        return total <= 100
      },
    },
  },
  solitary: {
    title: '孤獨的',
    requirementsDescription: '4 項能力值 (基礎值+訓練值) 的尾數皆 = 1；觀看數 = 1',
    requirements: {
      goal: (v: TrainingStatus) => {
        for (let i: TrainingType = 0; i < 4; i++) {
          if (v[i] % 10 !== 1) {
            return false
          }
        }
        return true
      },
    },
  },
  capable: {
    title: '有能力的',
    requirementsDescription: '4 能力值 (基礎值+訓練值) 總和 ≧104，4 能力值相同',
    requirements: {
      goal: (v: TrainingStatus) => {
        // Check if all values are same
        for (let i: TrainingType = 0; i < 4; i++) {
          for (let j: TrainingType = i + 1; j < 4; j++) {
            if (v[i] !== v[j]) {
              return false
            }
          }
        }

        // Check if the sum is >= 104
        const total = Object.values(v).reduce((acc, cur) => acc + cur, 0)
        return total >= 104
      },
    },
  },
}
