import { TrainingType, allTrainingOperations } from './training'
import type { TrainingRequirements } from './training'

export interface Personality {
  title: string
  description?: string
  requirements?: TrainingRequirements
}

function isAllEqual(status: TrainingStatusNormalized): boolean {
  return status.every(v => v === status[0])
}

export const personalities: Record<string, Personality> = {
  meticulous: {
    title: '一絲不苟的',
    description: '4 能力值 (基礎值+訓練值) 總和 = 100；能力值之間不得相等，否則會是「平凡的」性格',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        // Check if the sum is 100
        const total = v.reduce((acc, cur) => acc + cur, 0)
        return total === 100 && !isAllEqual(v)
      },
    },
  },
  distracted: {
    title: '漫不經心的',
    description: '4 項能力值 (基礎值+訓練值) 每項能力值之間相差 ≧15 (例如：0, 15, 30, 45)；不得訓練集中力（計算將會自動排除所有「集中力」訓練）',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        for (let i: TrainingType = 0; i < 4; i++) {
          for (let j: TrainingType = i + 1; j < 4; j++) {
            if (Math.abs(v[i] - v[j]) < 15) {
              return false
            }
          }
        }
        return true
      },
      transformOperations: (operations: TrainingOperation[]) => {
        return operations.filter(({ type }) => type !== TrainingType.focus)
      },
    },
  },
  dull: {
    title: '平凡的',
    description: '4 種能力值 (基礎值+訓練值) 相同，總和 ≦100',
    requirements: {
      maxOperations: 12,
      valid: (status: TrainingStatusNormalized) => status.every((s) => {
        return s <= 25
      }),
      goal: (v: TrainingStatusNormalized) => {
        return v[0] <= 25 && isAllEqual(v)
      },
    },
  },
  solitary: {
    title: '孤獨的',
    description: '4 項能力值 (基礎值+訓練值) 的尾數皆 = 1；觀看數 = 1',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v.every(s => s % 10 === 1) && !isAllEqual(v)
      },
    },
  },
  capable: {
    title: '有能力的',
    description: '4 能力值 (基礎值+訓練值) 總和 ≧104，4 能力值相同',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v[0] >= 26 && isAllEqual(v)
      },
    },
  },
}
