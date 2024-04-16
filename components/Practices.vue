<template>
  <div>
    <div
      v-for="item of computedData"
      :key="item.date"
      class="mb-3 border rounded shadow-sm"
    >
      <a
        :href="item.url"
        class="text-decoration-none text-body mb-3"
      >
        <div class="bg-primary px-1">
          {{ item.date.toLocaleDateString(locale) }} {{ item.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) }}
        </div>
        <div class="fw-bold px-1">
          {{ item.title }}
        </div>
        <div class="small border-top mt-2" v-html="item.description" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// const { data } = useFetch('https://test.mhx.fi/sleepwalkers/calendar/csv?'+new Date().getDate())
const { data } = useFetch('/api/practices', {})
// console.log(data.value)
const { locale } = useI18n()
const computedData = computed(() => {
  if (!data.value)
    return []
  // console.log('data', data.value)
  return data.value.map((item) => {
    return {
      ...item,
      date: new Date(item.date),
    }
  }).slice(0, 5)
})
</script>
