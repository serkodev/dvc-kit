interface Dragon {
  name: string[]
  traitsEn: string[]
  traitsKo: string[]
  [key: string]: number[] | string[]
}

const dragonList = [/* #fetch-dragon-list */] as Dragon[]

export { dragonList }
