<template>
  <div>
    <div class="mx-auto max-w-xl px-4">
      <div to="/" class="py-4 font-bold">
        <NuxtLink to="/">
          DVC Kit
        </NuxtLink>
      </div>
    </div>

    <main class="mx-auto max-w-xl px-4">
      <slot />
    </main>

    <footer class="mx-auto max-w-xl px-4 py-8 text-sm flex flex-col sm:flex-row items-center sm:justify-between">
      <div>
        資料來源 : <NuxtLink class="text-blue" to="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki">
          DVC Wiki
        </NuxtLink>
      </div>

      <div>
        Made by
        <NuxtLink class="text-blue" to="https://serko.dev/">
          SerKo
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
