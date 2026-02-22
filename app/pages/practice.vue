<template>
  <div>
    <div class="rounded shadow">
      <div>
        <ContentRenderer v-if="page" :value="page">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
    </div>
    <div class="space-y-4 mt-4">
      <div v-for="(practice, index) in data" :key="practice.id">
        <UCard>
          <div class="flex flex-col" :class="(index % 2) === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'">
            <div class="w-full lg:w-1/2 p-4">
              <h4>
                {{ practice.weekday }} – {{ practice.title }}
              </h4>
              <p>{{ practice.location }}</p>
              <ContentRenderer :value="practice" />
              <div v-if="matchingEvents(practice).length" class="flex flex-wrap gap-2 mt-3">
                <UButton
                  v-for="event in matchingEvents(practice)"
                  :key="event.url"
                  :to="event.url"
                  target="_blank"
                  variant="soft"
                  size="sm"
                >
                  {{ event.date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'Europe/Helsinki' }) }}
                </UButton>
              </div>
            </div>
            <div class="w-full lg:w-1/2">
              <div v-if="practice.map" class="container-iframe rounded-b lg:rounded-b-none" :class="(index % 2) === 0 ? 'lg:rounded-l' : 'lg:rounded-r'" v-html="practice.map" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <div v-if="unmatchedEvents.length" class="mt-8">
      <h4>{{ $t('Muut tapahtumat') }}</h4>
      <div class="space-y-2 mt-2">
        <div v-for="event in unmatchedEvents" :key="event.url" class="rounded shadow">
          <a :href="event.url" target="_blank" class="no-underline text-inherit">
            <div class="bg-brand px-2 py-1 rounded-t text-white">
              {{ event.date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'Europe/Helsinki' }) }}
              {{ event.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' }) }}
               <span class="text-sm ms-2">
                {{ event.location }}
              </span>
            </div>
            <div class="font-bold px-2 py-1">
              {{ event.title }}
            </div>
            <div class="text-sm border-t mt-2 px-2" v-html="event.description" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import pdata from '~/../public/data/practices.json'

const { path } = useRoute()
const { locale } = useI18n()

const { data: page } = await useAsyncData(path, () => {
  return queryCollection('content').path(path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Page not found',
  })
}

const { data } = await useAsyncData(() => `practices-${path}`, () => queryCollection('practices').all())

const allEvents = pdata.map(item => ({
  ...item,
  date: new Date(item.date),
})).filter(item => item.date > new Date())
  .sort((a, b) => +a.date - +b.date)

function getHelsinkiWeekday(date: Date): string {
  return date.toLocaleDateString('fi-FI', { weekday: 'long', timeZone: 'Europe/Helsinki' })
}

function getHelsinkiTime(date: Date): string {
  return date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' }).replace('.', ':')
}

function matchingEvents(practice: { weekday: string, start: string }) {
  return allEvents.filter((event) => {
    return getHelsinkiWeekday(event.date) === practice.weekday.toLowerCase()
      && getHelsinkiTime(event.date) === practice.start
  })
}

const matchedUrls = computed(() => {
  if (!data.value) return new Set()
  const urls = new Set<string>()
  for (const practice of data.value) {
    for (const event of matchingEvents(practice)) {
      urls.add(event.url)
    }
  }
  return urls
})

const unmatchedEvents = computed(() => {
  return allEvents.filter(event => !matchedUrls.value.has(event.url))
})
</script>

<style>
.container-iframe {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-top: 56.25%;
}
.container-iframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
