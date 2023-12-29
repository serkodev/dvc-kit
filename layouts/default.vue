<template>
  <div>
    <div class="mx-auto max-w-xl px-3">
      <div to="/" class="py-4 font-bold">
        <NuxtLink to="/">
          DVC Kit
        </NuxtLink>
      </div>
    </div>

    <main class="mx-auto max-w-xl px-3">
      <slot />
    </main>

    <footer class="mx-auto max-w-xl px-3 py-8 text-sm flex flex-col gap-4">
      <div class="flex gap-1 items-center">
        <div>
          <span>Made by</span>
          <NuxtLink class="text-blue" to="https://serko.dev/">
            SerKo
          </NuxtLink>
        </div>
        <NuxtLink class="text-gray" to="https://github.com/serkodev/dvc-kit">
          <div class="i-tabler-brand-github text-lg" />
        </NuxtLink>
      </div>

      <div>
        資料來源 :
        <br>
        <NuxtLink class="text-blue" to="https://github.com/YCCCCode">
          yccccode
        </NuxtLink> 中文翻譯
        <br>
        <NuxtLink class="text-blue" to="https://github.com/jbilee/dvc">
          jbilee
        </NuxtLink>
        <br>
        <NuxtLink class="text-blue" to="https://community.withhive.com/dvc/ko/board/22">
          dvc@withhive
        </NuxtLink>
        <br>
        <NuxtLink class="text-blue" to="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki">
          DVC Wiki
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
