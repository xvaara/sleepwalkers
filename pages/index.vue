<template>
  <div>
    <BCarousel id="front-carousel" controls indicators ride="carousel" class="rounded">
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
    <div class="row">
      <BlogList :limit="4" class="col-12 col-lg-6" />
    </div>
    <ClientOnly>
      <Instagram />
    </ClientOnly>
  </div>
</template>

<script setup>
const { path } = useRoute()
const { data, error } = await useAsyncData(`index-${path}`, () => queryContent(path).findOne())
if (error.value)
  console.error(error.value)

const images = ref(['/images/sleepwalkers.png'])
onMounted(async () => {
  const newImage = await fetch('/images/gallery.json').then(res => res.json())
  images.value = [images.value[0], ...newImage]
})
</script>

<style>
.ratio img {
  object-fit: cover;
}
.carousel.rounded > .carousel-inner {
  border-radius: var(--bs-border-radius) !important;
}
</style>
