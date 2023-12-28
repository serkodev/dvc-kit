import { type JbileeDragon, jbileeDragonList } from './dataset/rawdata'
import { zhDragons, zhTraits } from './dataset/locales'

export interface DragonBasicTrait {
  name: string
  status: TrainingStatusNormalized
}

export interface Dragon {
  name: string
  traits: DragonBasicTrait[]
}

function normalizeJbiLeeDragonList(dragons: JbileeDragon[]): Dragon[] {
  return dragons.map<Dragon>((dragon) => {
    const { name, traitsEn } = dragon

    return {
      name: zhDragons[name[0]] ?? name[0],
      traits: traitsEn.reduce<DragonBasicTrait[]>((acc, trait) => {
        if (Array.isArray(dragon[trait])) {
          acc.push({
            name: zhTraits[trait] ?? trait,
            status: dragon[trait] as TrainingStatusNormalized,
          })
        }
        return acc
      }, []),
    }
  })
}

export const dragonList = normalizeJbiLeeDragonList(jbileeDragonList)
