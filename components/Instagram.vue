<template>
  <div class="row">
    <InstagramPost v-for="post of data" :key="post.id" :url="post.url" class="col-12 col-md-6 mb-3" />
  </div>
</template>

<script setup>
import igdata from '../public/data/ig.json'

const data = ref(igdata.splice(0, 6))
// const url = useRequestURL()
// const { data } = useAsyncData('ig.json', () => $fetch(`${url.protocol}//${url.host}/data/ig.json`))
// const { data } = useFetch(`${url.protocol}//${url.host}/data/ig.json`)
// const { data } = useFetch(`/ig.json`)

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
