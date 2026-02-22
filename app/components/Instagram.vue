<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InstagramPost v-for="post of data" :key="post.id" :url="post.url" class="mb-3" />
  </div>
</template>

<script setup>
import igdata from '../public/data/ig.json'

const data = ref(igdata.splice(0, 6))

onMounted(() => {
  nextTick(() => {
    window.instgrm?.Embeds?.process?.()
    || setTimeout(() => {
      try {
        window.instgrm.Embeds.process()
      }
      catch (e) {
        console.error(e)
      }
    }, 1000)
  })
})
useHead({
  script: [
    {
      src: '//www.instagram.com/embed.js',
      async: true,
      onload: 'window.instgrm.Embeds.process()',
    },
  ],
})
</script>
