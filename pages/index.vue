<template>
  <div>
    <BCarousel id="front-carousel" controls indicators ride="carousel">
      <BCarouselSlide
        v-for="image in images"
        :key="image"
        class="ratio ratio-16x9"
        :img-src="image"
      />
    </BCarousel>

    <ContentRenderer v-if="data" :value="data">
      <template #empty>
        <p>No content found.</p>
      </template>
    </ContentRenderer>
    <div class="row">
      <BlogList :limit="4" class="col-12 col-md-12" />
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
</style>
