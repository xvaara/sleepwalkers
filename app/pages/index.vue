<template>
  <div class="page-index">
    <!-- 1. HERO -->
    <section class="hero">
      <div class="hero-bg-wrap">
        <img src="/images/sleepwalkers.png" alt="" class="hero-bg">
      </div>
      <div class="hero-overlay" />
    </section>

    <!-- 2. GALLERY STRIP -->
    <section class="gallery-strip">
      <div ref="stripTrackRef" class="strip-track">
        <div v-for="n in 12" :key="n" class="strip-frame">
          <img :src="`/images/gallery/${((n - 1) % 6) + 1}.jpg`" :alt="`Gallery ${n}`">
        </div>
      </div>
    </section>

    <!-- CONTENT SECTIONS (auto-alternating backgrounds) -->
    <div class="content-sections">
      <!-- HIGHLIGHTS -->
      <section v-if="highlights" class="cs highlights">
        <span class="tag">{{ t('Kohokohdat') }}</span>
        <ContentRenderer :value="highlights" />
      </section>

      <!-- INSTAGRAM FEED -->
      <section v-if="igPosts.length" class="cs ig-feed">
        <div class="ig-feed-header">
          <span class="tag">Instagram</span>
          <a href="https://www.instagram.com/sleepwalkersultimate/" target="_blank" rel="noopener" class="ig-follow">
            @sleepwalkersultimate
          </a>
        </div>
        <div class="ig-scroll" @scroll="onIgScroll">
          <a
            v-for="post in igPosts.slice(0, 12)"
            :key="post.shortcode"
            :href="post.instagram_url"
            target="_blank"
            rel="noopener"
            class="ig-card"
          >
            <img
              v-for="(_, imgIdx) in (post.media || [])"
              :key="imgIdx"
              :src="igMediaUrl(post.shortcode, imgIdx)"
              :alt="post.caption?.slice(0, 80) || ''"
              class="ig-card-img"
              :class="{ 'ig-card-img--active': imgIdx === (igCardIndex[post.shortcode] || 0) }"
              loading="lazy"
            >
            <div v-if="post.media?.length > 1" class="ig-card-dots">
              <span
                v-for="(_, dotIdx) in (post.media || [])"
                :key="dotIdx"
                class="ig-card-dot"
                :class="{ 'ig-card-dot--active': dotIdx === (igCardIndex[post.shortcode] || 0) }"
              />
            </div>
            <div class="ig-card-overlay">
              <p class="ig-card-caption">{{ post.caption?.slice(0, 120) }}{{ post.caption?.length > 120 ? '…' : '' }}</p>
              <div class="ig-card-meta">
                <span>&#9829; {{ post.likes }}</span>
                <span>&#128172; {{ post.comments }}</span>
              </div>
            </div>
          </a>
        </div>
        <div class="ig-scroll-hint" :class="{ 'ig-scroll-hint--hidden': igScrolled }">
          <span class="ig-scroll-arrow">&rarr;</span>
        </div>
      </section>

      <!-- NEXT TRAININGS -->
      <section v-if="upcomingPractices.length" class="cs next-trainings">
        <div class="next-trainings-inner">
          <span class="tag">{{ t('Seuraavat treenit') }}</span>
          <div class="next-list">
            <a
              v-for="(p, i) in upcomingPractices"
              :key="i"
              :href="p.url"
              target="_blank"
              rel="noopener"
              class="next-item"
            >
              <div class="next-date-block">
                <span class="next-date-day">{{ p.dateFormatted }}</span>
                <span class="next-date-weekday">{{ p.dayName }}</span>
              </div>
              <div class="next-info">
                <span class="next-title">{{ p.title }}</span>
                <span class="next-loc">{{ p.location }}</span>
              </div>
              <span class="next-arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ABOUT SPLIT (text left, image right) -->
      <section v-if="about" class="cs split">
        <div class="split-text">
          <span class="tag">{{ t('Tietoa') }}</span>
          <h2 class="heading">
            {{ about.title }}
          </h2>
          <ContentRenderer :value="about" class="split-prose" />
          <div v-if="practiceItems.length" class="detail-items">
            <div v-for="p in practiceItems" :key="p.path" class="detail-item">
              <span class="detail-label">{{ weekdayName(p.weekday) }}</span>
              <span class="detail-value">{{ practiceTitle(p) }}</span>
            </div>
          </div>
        </div>
        <div class="split-img">
          <img :src="about.image || '/images/about1.jpg'" :alt="about.imageAlt || ''">
        </div>
      </section>

      <!-- THE SPORT (image left, text right) -->
      <section v-if="sport" class="cs split">
        <div class="split-img">
          <img :src="sport.image || '/images/about2.jpg'" :alt="sport.imageAlt || ''">
        </div>
        <div class="split-text">
          <span class="tag">{{ t('Laji') }}</span>
          <h2 class="heading">
            {{ sport.title }}
          </h2>
          <ContentRenderer :value="sport" class="split-prose" />
        </div>
      </section>

      <!-- PRACTICES ACCORDION -->
      <section v-if="practicesSection" class="cs practices">
        <div class="practices-inner">
          <span class="tag">{{ t('Harjoitusaikataulu') }}</span>
          <h2 class="heading">
            {{ practicesSection.title }}
          </h2>
          <ContentRenderer :value="practicesSection" class="practices-intro-content" />

          <div
            v-for="(practice, idx) in practiceItems"
            :key="practice.id"
            class="accordion"
            :class="{ 'accordion--open': openSections[idx] }"
          >
            <button class="accordion-header" @click="toggle(idx)">
              <span class="weekday-badge">{{ weekdayShort(practice.weekday) }}</span>
              <span class="accordion-day">{{ practiceTitle(practice) }}</span>
              <span class="accordion-summary">{{ practiceLocation(practice) }} &middot; {{ practice.start }}&ndash;{{ practice.end }}</span>
              <span class="accordion-chevron">&#9658;</span>
            </button>
            <div class="accordion-body">
              <div class="accordion-split">
                <div class="accordion-content">
                  <ContentRenderer v-if="practice.body" :value="practice" />
                  <div v-if="practiceCalendarDates(practice.weekday)?.length" class="date-chips">
                    <a
                      v-for="(d, i) in (practiceCalendarDates(practice.weekday) || [])"
                      :key="i"
                      :href="d.url"
                      target="_blank"
                      rel="noopener"
                      class="chip"
                    >{{ d.label }}</a>
                  </div>
                </div>
                <div class="accordion-map" v-html="practice.map" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEES -->
      <section v-if="fees" class="cs fees">
        <div class="fees-inner">
          <span class="tag">{{ t('Maksut') }}</span>
          <h2 class="heading">
            {{ fees.title }}
          </h2>
          <ContentRenderer :value="fees" class="fees-content" />
        </div>
      </section>
    </div><!-- /content-sections -->

    <!-- CTA + CONTACTS -->
    <section v-if="cta" class="cta">
      <h2 class="cta-title">
        {{ cta.title }}
      </h2>
      <p class="cta-sub">
        {{ cta.subtitle }}
      </p>
      <div class="contact-links">
        <a
          v-for="contact in cta.contacts"
          :key="contact.href"
          :href="contact.href"
          :target="contact.external ? '_blank' : undefined"
          :rel="contact.external ? 'noopener' : undefined"
          class="contact-item"
        >
          <img v-if="contact.iconSrc" :src="contact.iconSrc" alt="" class="contact-icon-img">
          <UIcon v-else-if="contact.icon" :name="contact.icon" class="contact-icon" />
          <span class="contact-label">{{ contact.label }}</span>
          <span class="contact-value">{{ contact.text }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface CalendarPractice {
  title: string
  date: string
  location: string
  url: string
  description: string
}

const { t, locale } = useI18n()

// Gallery strip: fade images to color near viewport center
const stripTrackRef = ref<HTMLElement | null>(null)
let stripRafId: number

function updateStripFilters() {
  if (!stripTrackRef.value) return
  const viewportCenter = window.innerWidth / 2
  const frames = stripTrackRef.value.children as HTMLCollectionOf<HTMLElement>
  for (const frame of frames) {
    const rect = frame.getBoundingClientRect()
    const frameCenter = rect.left + rect.width / 2
    const dist = Math.abs(frameCenter - viewportCenter)
    const radius = window.innerWidth * 0.35
    const t = Math.min(dist / radius, 1)
    const grayscale = t * 100
    const brightness = 1 - t * 0.3
    const img = frame.querySelector('img') as HTMLElement | null
    if (img) img.style.filter = `grayscale(${grayscale}%) brightness(${brightness})`
  }
  stripRafId = requestAnimationFrame(updateStripFilters)
}

onMounted(() => {
  stripRafId = requestAnimationFrame(updateStripFilters)
})

onUnmounted(() => {
  cancelAnimationFrame(stripRafId)
})

// Query all homepage content sections
const { data: homeContent } = await useAsyncData(
  `home-content-${locale.value}`,
  () => queryCollection('content')
    .where('path', 'LIKE', `/${locale.value}/%`)
    .all(),
)

function findSection(name: string) {
  return homeContent.value?.find(c => c.stem?.endsWith(name))
}

const highlights = computed(() => findSection('highlights'))
const about = computed(() => findSection('about'))
const sport = computed(() => findSection('sport'))
const fees = computed(() => findSection('fees'))
const cta = computed(() => findSection('cta'))
const practicesSection = computed(() => findSection('practices'))

// Practice schedule from Nuxt Content
const { data: practiceData } = await useAsyncData(
  'practices-content',
  () => queryCollection('practices').order('weekday', 'ASC').all(),
)

const practiceItems = computed(() => practiceData.value || [])

function practiceTitle(practice: { title: string, title_en?: string }) {
  if (locale.value === 'en' && practice.title_en)
    return practice.title_en
  return practice.title
}

function practiceLocation(practice: { location: string, location_en?: string }) {
  if (locale.value === 'en' && practice.location_en)
    return practice.location_en
  return practice.location
}

// Jan 6 2025 is a Monday, so +weekday-1 gives the correct day
function weekdayDate(weekday: number) {
  return new Date(2025, 0, 5 + weekday)
}

function weekdayName(weekday: number) {
  return new Intl.DateTimeFormat(locale.value, { weekday: 'long' }).format(weekdayDate(weekday))
}

function weekdayShort(weekday: number) {
  return new Intl.DateTimeFormat(locale.value, { weekday: 'short' }).format(weekdayDate(weekday))
}

// Accordion state
const openSections = ref<boolean[]>([])
watch(practiceItems, (items) => {
  openSections.value = items.map(() => false)
}, { immediate: true })

function toggle(i: number) {
  openSections.value[i] = !openSections.value[i]
}

// Instagram posts
interface IgPost {
  shortcode: string
  caption: string
  timestamp: number
  likes: number
  comments: number
  media: string[]
  instagram_url: string
  is_video: boolean
}

const igScrolled = ref(false)

const { data: igPosts } = await useFetch<IgPost[]>(
  'https://ig-profile.app.mhx.fi/api/posts/sleepwalkersultimate',
  {
    key: 'ig-posts',
    default: () => [],
    getCachedData: key => useNuxtData<IgPost[]>(key).data.value,
  },
)

function igMediaUrl(shortcode: string, index: number) {
  return `https://ig-profile.app.mhx.fi/media/sleepwalkersultimate/${shortcode}/${index + 1}/thumb`
}

// Auto-cycle carousel images per card
const igCardIndex = ref<Record<string, number>>({})

function scheduleNextSlide(shortcode: string, imageCount: number) {
  const delay = 3000 + Math.random() * 7000 // 3–10s
  setTimeout(() => {
    igCardIndex.value[shortcode] = ((igCardIndex.value[shortcode] || 0) + 1) % imageCount
    scheduleNextSlide(shortcode, imageCount)
  }, delay)
}

onMounted(() => {
  for (const post of igPosts.value.slice(0, 12)) {
    if ((post.media?.length || 0) > 1) {
      const initialDelay = 2000 + Math.random() * 5000
      setTimeout(() => scheduleNextSlide(post.shortcode, post.media.length), initialDelay)
    }
  }
})

function onIgScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollLeft > 20)
    igScrolled.value = true
}

// Calendar data from practices.json
const { data: calendarPractices } = await useFetch<CalendarPractice[]>('/api/practices', {
  default: () => [],
})

function contentWeekdayToJs(wd: number): number {
  return wd === 7 ? 0 : wd
}

function practiceCalendarDates(weekday: number) {
  if (!calendarPractices.value)
    return []
  const jsDay = contentWeekdayToJs(weekday)
  return calendarPractices.value
    .filter(p => new Date(p.date).getDay() === jsDay)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(p => ({
      label: `${new Date(p.date).getDate()}.${new Date(p.date).getMonth() + 1}.`,
      url: p.url,
    }))
}

const upcomingPractices = computed(() => {
  if (!calendarPractices.value)
    return []
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(now)
  weekFromNow.setDate(weekFromNow.getDate() + 7)
  return calendarPractices.value
    .filter((p) => {
      const d = new Date(p.date)
      return d >= now && d <= weekFromNow
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((p) => {
      const dt = new Date(p.date)
      return {
        ...p,
        dayName: dt.toLocaleDateString(locale.value, { weekday: 'long' }),
        dateFormatted: `${dt.getDate()}.${dt.getMonth() + 1}.`,
      }
    })
})
</script>

