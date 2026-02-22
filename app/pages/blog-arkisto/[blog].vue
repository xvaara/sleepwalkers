<template>
  <div>
    <template v-if="postData">
      <div class="card p-1 mb-3 shadow">
        <div class="d-flex justify-content-between align-items-end">
          <NuxtLink :to="prev?.path">
            <ChevronLeft />{{ $t('Edellinen') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/blog-arkisto')" class="text-center">
            <ChevronUp /><br>
            {{ $t('Takaisin') }}
          </NuxtLink>
          <NuxtLink :to="next?.path">
            {{ $t('Seuraava') }}<ChevronRight />
          </NuxtLink>
        </div>
      </div>
      <h2>{{ data.title }}</h2>
      <p>{{ new Date(data.date).toLocaleDateString(locale) }}</p>
      <BlogImage v-if="showDefaultImage" :src="data.image" />
      <div>
        <ContentRenderer :value="postData">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
    </template>
    <div v-else>
      <p class="text-center">
        {{ $t('404 Not Found') }}
      </p>
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

const { data: postData } = await useAsyncData(() => `blog-post-${path}`, () => queryCollection('blog').path(path.replace(`/${locale.value}/`, '/')).first())
const [prev, next] = await queryCollectionItemSurroundings('blog', path)
  .where('path', 'LIKE', `/blog-arkisto%`)
  .andWhere(query => query.where('published', '=', true))
  .order('date', 'ASC')

if (!postData.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Blog post not found',
  })
}

setTimeout(() => {
  console.log(postData.value)
}, 1000)

const data = computed<BlogPost>(() => {
  return makeBLogPost(postData)
})

const showDefaultImage = computed(() => postData.value?.image && !JSON.stringify(postData.value?.body).includes(postData.value?.image))

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
      content: data.value.ogImage.startsWith('http') ? data.value.ogImage : `https://sleepwalkers.fi/${data.value.ogImage}`,
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
      content: data.value.ogImage.startsWith('http') ? data.value.ogImage : `https://sleepwalkers.fi/${data.value.ogImage}`,
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
