<template>
  <div>
    <div class="d-flex justify-content-between">
      <NuxtLink :to="prev?._path">
        <ChevronLeft />{{ $t('Edellinen') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/blog')">
        <ChevronUp />{{ $t('Takaisin') }}
      </NuxtLink>
      <NuxtLink :to="next?._path">
        {{ $t('Seuraava') }}<ChevronRight />
      </NuxtLink>
    </div>
    <h2>{{ data.title }}</h2>
    <p>{{ new Date(data.date).toLocaleDateString(locale) }}</p>
    <BlogImage :src="data.image" />
    <div>
      <ContentRenderer v-if="postData" :value="postData">
        <template #empty>
          <p>No content found.</p>
        </template>
      </ContentRenderer>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChevronRight from '~icons/bi/chevron-right'
import ChevronLeft from '~icons/bi/chevron-left'
import ChevronUp from '~icons/bi/chevron-up'
import type { BlogPost } from '~/types/blog'

const localePath = useLocalePath()
const { path } = useRoute()
const { locale } = useI18n()

const { data: postData, error } = await useAsyncData(`blog-post-${path}`, () => queryContent(path).findOne())
const [prev, next] = await queryContent(locale.value, 'blog').where({
  $and: [
    {
      _file: {
        $ne: '_dir.yml',
      },
    },
    {
      published: true,
    },
  ],
}).sort({ date: -1 }).findSurround(path)

if (error.value)
  navigateTo('/404')

const data = computed<BlogPost>(() => {
  return makeBLogPost(postData)
})

useHead({
  title: data.value.title || '',
  meta: [
    { name: 'description', content: data.value.description },
    {
      name: 'description',
      content: data.value.description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Sleepwalkers ultimate' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `https://sleepwalkers.fi/${path}`,
    },
    {
      property: 'og:title',
      content: data.value.title,
    },
    {
      property: 'og:description',
      content: data.value.description,
    },
    {
      property: 'og:image',
      content: data.value.ogImage || data.value.image,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@qdnvubp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: `https://sleepwalkers.fi/${path}`,
    },
    {
      name: 'twitter:title',
      content: data.value.title,
    },
    {
      name: 'twitter:description',
      content: data.value.description,
    },
    {
      name: 'twitter:image',
      content: data.value.ogImage || data.value.image,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://sleepwalkers.fi/${path}`,
    },
  ],
})

// Generate OG Image
// defineOgImageComponent('NuxtSeo', {
//   headline: 'Greetings 👋',
//   title: data.value.title || '',
//   description: data.value.description || '',
//   link: data.value.ogImage,

// })
</script>
