import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import JSON5 from 'json5'

async function fetchRawData() {
  const url = 'https://raw.githubusercontent.com/jbilee/dvc/main/calc/rawdata.js'
  const content = await fetch(url).then(res => res.text())

  const dragonListRegex = /const dragonList\s*=\s*(\[(?:(?:[^[\]]|\[(?:[^\[\]]*)\])*)\]);?/s
  const match = content.match(dragonListRegex)

  if (!match)
    throw new Error(`fetch dragonList failed: ${content}`)

  return {
    dragonList: JSON5.parse(match[1]),
  }
}

export default defineNuxtModule({
  meta: {
    name: 'data-loader',
  },
  setup() {
    const MAGIC_COMMENT = '[/* #fetch-dragon-list */]'

    addVitePlugin({
      name: 'rawdata:data-loader',
      enforce: 'pre',
      async transform(code) {
        if (!code.includes(MAGIC_COMMENT))
          return

        const { dragonList } = await fetchRawData()
        return code.replace(MAGIC_COMMENT, JSON.stringify(dragonList))
      },
    })
  },
})
