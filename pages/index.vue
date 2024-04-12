<template>
  <div>
    <img alt="Sleepwalkers" src="/images/sleepwalkers.png" class="img-fluid rounded my-3">

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

const config = useRuntimeConfig()
const images = config.public.images
console.log('images', images)
</script>
