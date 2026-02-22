<template>
  <div>
    <BCarousel id="front-carousel" :key="`b${images.length}`" controls indicators ride="carousel" class="rounded">
      <BCarouselSlide
        v-for="image in images"
        :key="image"
        class="ratio ratio-16x9"
        :img-src="image"
      />
    </BCarousel>

    <ContentRenderer :value="data">
      <template #empty />
    </ContentRenderer>

    <div class="w-100">
      <h3>{{ $t('Seuraavat harjoitukset') }}</h3>
      <Practices
        class="row" item-class="col-12 col-lg-6"
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
</script>

<style>
.ratio img {
  object-fit: cover;
}
.carousel.rounded > .carousel-inner {
  border-radius: var(--bs-border-radius) !important;
}
</style>
