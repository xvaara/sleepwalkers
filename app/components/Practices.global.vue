<template>
  <div>
    <div
      v-for="item of computedData"
      :key="item.date"
      class="mb-3"
      :class="props.itemClass"
    >
      <div class="rounded shadow">
        <a
          :href="item.url"
          class="no-underline text-inherit mb-3"
        >
          <div class="bg-brand px-1 rounded-t text-white">
            {{ item.date.toLocaleDateString(locale, { weekday: 'short', timeZone: 'Europe/Helsinki' }) }} {{ item.date.toLocaleDateString(locale, { timeZone: 'Europe/Helsinki' }) }} {{ item.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' }) }}
          </div>
          <div class="font-bold px-1">
            {{ item.title }}
          </div>
          <div class="text-sm border-t mt-2 px-1">{{ small ? item.location.split(',')[0] : item.location }}</div>
          <div class="text-sm border-t mt-2 px-1" v-html="item.description" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import pdata from '../public/data/practices.json'

const props = defineProps({
  itemClass: {
    type: String,
    default: '',
  },
  small: {
    type: Boolean,
    default: false,
  },
})

const data = ref(pdata)
const { locale } = useI18n()
const limit = new Date()
limit.setDate((limit.getDate() + 15))
const computedData = computed(() => {
  if (!data.value)
    return []
  return data.value.map((item) => {
    return {
      ...item,
      date: new Date(item.date),
    }
  }).filter((item) => {
    return item.date > new Date()
  }).filter((item) => {
    return item.date < limit
  }).sort((a, b) => {
    return a.date - b.date
  })
})
</script>
