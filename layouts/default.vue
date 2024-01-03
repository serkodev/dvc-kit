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
      <div class="flex justify-between">
        <div class="flex gap-1 items-center">
          <div>
            <span>Made by</span>
            <NuxtLink class="text-blue" to="https://serko.dev/" target="_blank">
              SerKo
            </NuxtLink>
          </div>
          <NuxtLink class="text-gray" to="https://github.com/serkodev/dvc-kit" target="_blank">
            <div class="i-tabler-brand-github text-lg" />
          </NuxtLink>
        </div>

        <NuxtLink to="https://discord.com/channels/1136126615919800400/1192168335211773972" target="_blank">
          <div class="flex gap-1 items-center bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded w-max">
            <div class="text-indigo-300 i-tabler-brand-discord text-lg" />
            <div class="text-indigo-500">
              問題／意見
            </div>
          </div>
        </NuxtLink>
      </div>

      <div>
        資料來源 :
        <br>
        <NuxtLink class="text-blue" to="https://github.com/YCCCCode" target="_blank">
          yccccode
        </NuxtLink> 中文翻譯
        <br>
        <NuxtLink class="text-blue" to="https://github.com/jbilee/dvc" target="_blank">
          jbilee
        </NuxtLink>
        <br>
        <NuxtLink class="text-blue" to="https://community.withhive.com/dvc/ko/board/22" target="_blank">
          dvc@withhive
        </NuxtLink>
        <br>
        <NuxtLink class="text-blue" to="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki" target="_blank">
          DVC Wiki
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
