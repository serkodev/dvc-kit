// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@pinia/nuxt'],
  vue: {
    defineModel: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
  ],
  app: {
    head: {
      title: 'DVC Kit',
    },
  },
  typescript: {
    typeCheck: 'build',
  },
  ssr: false,
})
