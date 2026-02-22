<template>
  <div>
    <div class="relative overflow-hidden rounded aspect-video">
      <img
        v-for="(image, i) in images"
        :key="image"
        :src="image"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        :class="i === currentSlide ? 'opacity-100' : 'opacity-0'"
        alt=""
      >
      <button class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60" @click="prev">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60" @click="next">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(_, i) in images"
          :key="i"
          class="w-2 h-2 rounded-full transition-colors"
          :class="i === currentSlide ? 'bg-white' : 'bg-white/50'"
          @click="currentSlide = i"
        />
      </div>
    </div>

    <ContentRenderer :value="data">
      <template #empty />
    </ContentRenderer>

    <div class="w-full">
      <h3>{{ $t('Seuraavat harjoitukset') }}</h3>
      <Practices
        class="grid grid-cols-1 lg:grid-cols-2 gap-4" item-class=""
      />
    </div>
    <ClientOnly>
      <Instagram />
    </ClientOnly>
  </div>
</template>

<script setup>
import gallery from '../public/images/gallery.json'

const { path } = useRoute()
const { data, error } = await useAsyncData(() => `index-${path}`, () => queryCollection('content').path(path).first())
if (error.value)
  console.error(error.value)
const images = ref(['/images/sleepwalkers.png', ...gallery])
const currentSlide = ref(0)

let interval
onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.value.length
  }, 5000)
})
onUnmounted(() => clearInterval(interval))

function prev() {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length
}
function next() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length
}
</script>
