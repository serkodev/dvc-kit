export type TrainingScore = 0 | 3 | 5 | 9

export enum TrainingType {
  agility,
  strength,
  focus,
  intellect,
}

export interface TrainingOperation {
  type: TrainingType
  score: TrainingScore
}

export type TrainingStatus = Record<TrainingType, number>

export type TrainingStatusNormalized = [number, number, number, number]

export const allTrainingOperations: TrainingOperation[] = [
  { type: TrainingType.agility, score: 3 },
  { type: TrainingType.agility, score: 5 },
  { type: TrainingType.agility, score: 9 },
  { type: TrainingType.strength, score: 3 },
  { type: TrainingType.strength, score: 5 },
  { type: TrainingType.strength, score: 9 },
  { type: TrainingType.focus, score: 3 },
  { type: TrainingType.focus, score: 5 },
  { type: TrainingType.focus, score: 9 },
  { type: TrainingType.intellect, score: 3 },
  { type: TrainingType.intellect, score: 5 },
  { type: TrainingType.intellect, score: 9 },
]

export const allTrainingOperationsExpectFocus59: TrainingOperation[] = [
  { type: TrainingType.agility, score: 3 },
  { type: TrainingType.agility, score: 5 },
  { type: TrainingType.agility, score: 9 },
  { type: TrainingType.strength, score: 3 },
  { type: TrainingType.strength, score: 5 },
  { type: TrainingType.strength, score: 9 },
  { type: TrainingType.focus, score: 3 },
  { type: TrainingType.intellect, score: 3 },
  { type: TrainingType.intellect, score: 5 },
  { type: TrainingType.intellect, score: 9 },
]

export interface TrainingRequirements {
  valid?: (status: TrainingStatusNormalized) => boolean
  goal?: (status: TrainingStatusNormalized) => boolean
  transformOperations?: (operations: TrainingOperation[]) => TrainingOperation[]
  maxOperations?: number
}

export function getTrainedStatus(
  status: TrainingStatusNormalized,
  operations: TrainingOperation[],
): TrainingStatusNormalized {
  const cloneStatus = [...status] as TrainingStatusNormalized
  for (const { type, score } of operations) {
    cloneStatus[type] += score
  }
  return cloneStatus
}

export function normalizeStatus(status: TrainingStatus): TrainingStatusNormalized {
  return [
    status[TrainingType.agility] || 0,
    status[TrainingType.strength] || 0,
    status[TrainingType.focus] || 0,
    status[TrainingType.intellect] || 0,
  ]
}

export function calcMinimumOperations(
  status: TrainingStatus,
  operations: TrainingOperation[] = allTrainingOperations,
  {
    goal,
    valid = () => true,
    transformOperations,
    maxOperations = 18,
  }: TrainingRequirements = {},
  trainingOrder?: TrainingType[],
): TrainingOperation[] | null {
  if (goal === undefined)
    throw new Error('goal is required')

  const normalizedStatus = normalizeStatus(status)

  if (!valid(normalizedStatus))
    throw new Error('invalid status')

  if (goal(normalizedStatus))
    return []

  if (transformOperations) {
    operations = transformOperations(operations)
  }

  if (trainingOrder) {
    operations = operations.sort((a, b) => {
      const aIndex = trainingOrder.indexOf(a.type)
      const bIndex = trainingOrder.indexOf(b.type)
      return aIndex - bIndex
    })
  }

  for (let numOps = 1; numOps <= maxOperations; numOps++) {
    for (const ops of product(operations, numOps)) {
      const trainedStatus = getTrainedStatus(normalizedStatus, ops)
      if (goal(trainedStatus)) {
        return ops
      }
    }
  }

  return null
}

export function operationTypeTitle(type: TrainingType): string {
  return [
    '爆發力',
    '肌力',
    '集中力',
    '智力',
  ][type]
}

export function titleForScore(score: TrainingScore) {
  const title = {
    0: 'FAIL',
    3: 'SO-SO',
    5: 'GOOD',
    9: 'PERFECT',
  }[score]

  return `+${score} ${title}`
}

export function operationDescription(operation: TrainingOperation): string {
  const title = operationTypeTitle(operation.type)
  return `${title} +${operation.score}`
}

export function resultNotes(result: TrainingOperation[]): string {
  const sortedResult = result.sort((a, b) => a.type - b.type)
  const lines = sortedResult.map(op => `[ ] ${operationDescription(op)}`)
  return lines.join('\n')
}
