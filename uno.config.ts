import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetTypography(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: {
    'input-number-hide-spin': '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  },
})
