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
    description: '4 能力值 (基礎值+訓練值) 總和 = 100；不能 4 數值同時為25，否則會是「平凡的」個性',
    requirements: {
      valid: (status: TrainingStatusNormalized) => {
        const total = status.reduce((acc, cur) => acc + cur, 0)
        return total <= 100
      },
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
  classy: {
    title: '有格調的',
    description: '4 項能力值 (基礎值+訓練值) 皆 ≧20，3 代內純種',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v.every(s => s >= 20) && !isAllEqual(v)
      },
    },
  },
  noble: {
    title: '高貴的',
    description: '4 項能力值 (基礎值+訓練值) 皆 ≧20，5 代內純種',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v.every(s => s >= 20) && !isAllEqual(v)
      },
    },
  },
  arrogant: {
    title: '傲慢的',
    description: '4 項能力值 (基礎值+訓練值) 皆 ≧25，觀看數 ≧200',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v.every(s => s >= 25) && !isAllEqual(v)
      },
    },
  },
  perfectionist: {
    title: '完美主義者',
    description: '4 項能力值 (基礎值+訓練值) 皆 ≧20，在特定時間內進化至亞成體 (每隻龍的時間不一定，通常在 3 至 4 天內)',
    requirements: {
      goal: (v: TrainingStatusNormalized) => {
        return v.every(s => s >= 20) && !isAllEqual(v)
      },
    },
  },
  immersed: {
    title: '專注的',
    description: '任意其中一種能力值 ≧150',
    requirements: {
      maxOperations: 20,
      goal: (v: TrainingStatusNormalized) => {
        return v.some(s => s >= 150) && !isAllEqual(v)
      },
      transformOperations: (operations: TrainingOperation[]) => {
        const onlyNines = operations.filter(({ score }) => score === 9)
        return onlyNines.length > 0 ? onlyNines : operations
      },
    },
  },
}
