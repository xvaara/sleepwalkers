<template>
  <div>
    <div
      v-for="item of computedData"
      :key="item.date"
      class="mb-3"
      :class="props.itemClass"
    >
      <div class=" rounded shadow">
        <a
          :href="item.url"
          class="text-decoration-none text-body mb-3 "
        >
          <div class="bg-primary px-1 rounded-top">
            {{ item.date.toLocaleDateString(locale, { weekday: 'short' }) }} {{ item.date.toLocaleDateString(locale) }} {{ item.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) }}
          </div>
          <div class="fw-bold px-1">
            {{ item.title }}
          </div>
          <div class="text-small border-top mt-2 px-1">{{ small ? item.location.split(',')[0] : item.location }}</div>
          <div class="text-small border-top mt-2 px-1" v-html="item.description" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
// const { data } = useFetch('https://test.mhx.fi/sleepwalkers/calendar/csv?'+new Date().getDate())
const { data } = useFetch('/practices.json', {})
// console.log(data.value)
const { locale } = useI18n()
const limit = new Date()
limit.setDate((limit.getDate() + 15))
const computedData = computed(() => {
  if (!data.value)
    return []
  // console.log('data', data.value)
  return data.value.map((item) => {
    return {
      ...item,
      date: new Date(item.date),
    }
  }).filter((item) => {
    return item.date < limit
  }).sort((a, b) => {
    return a.date - b.date
  })
})
</script>

<style scoped>
.text-small {
  font-size: 0.8rem;
}
</style>
