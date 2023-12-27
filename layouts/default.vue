<script setup lang="ts">
const route = useRoute()

const enableDragonList = computed(() => route.hash === '#dragon-list')
</script>

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
        資料來源 :
        <br>
        <template v-if="enableDragonList">
          <NuxtLink class="text-blue" to="https://github.com/YCCCCode/yccccode.github.io">
            yccccode
          </NuxtLink> 中文翻譯
          <br>
          <NuxtLink class="text-blue" to="https://github.com/jbilee/dvc">
            jbilee
          </NuxtLink>
          <br>
        </template>
        <NuxtLink class="text-blue" to="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki">
          DVC Wiki
        </NuxtLink>
      </div>

      <div class="self-start">
        Made by
        <NuxtLink class="text-blue" to="https://serko.dev/">
          SerKo
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
