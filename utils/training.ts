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

export interface TrainingRequirements {
  valid?: (status: TrainingStatus) => boolean
  goal?: (status: TrainingStatus) => boolean
  allowedOperations?: TrainingOperation[]
  maxOperations?: number
}

export function getTrainedStatus(
  status: TrainingStatus,
  operations: TrainingOperation[],
): TrainingStatus {
  const cloneStatus = { ...status } as TrainingStatus
  for (const { type, score } of operations) {
    cloneStatus[type] += score
  }
  return cloneStatus
}

export function calcMinimumOperations(
  status: TrainingStatus,
  {
    goal,
    valid = () => true,
    allowedOperations: operations = allTrainingOperations,
    maxOperations = 14,
  }: TrainingRequirements = {},
): TrainingOperation[] | null {
  if (goal === undefined)
    throw new Error('goal is required')

  if (!valid(status))
    throw new Error('invalid status')

  if (goal(status))
    return []

  for (let numOps = 1; numOps <= maxOperations; numOps++) {
    for (const ops of product(operations, numOps)) {
      const trainedStatus = getTrainedStatus(status, ops)
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
