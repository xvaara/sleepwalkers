<template>
  <div class="d-flex flex-wrap justify-content-around">
    <InstagramPost v-for="post of data" :key="post.id" :url="post.url" class="col-12 col-md-6" />
  </div>
</template>

<script setup>
const { data } = useFetch('/api/ig')

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
