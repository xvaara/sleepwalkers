<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-50 shadow bg-linear-to-l dark:bg-linear-to-r from-brand via-brand-dark to-[#271b1b]">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
        <div class="flex items-center gap-2">
          <!-- Mobile hamburger -->
          <button class="lg:hidden text-white p-1" aria-label="Menu" @click="mobileOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <NuxtLink :to="localePath('/')" class="p-0">
            <img src="/images/sleepwalkers-logo.png" alt="Sleepwalkers" class="h-10">
          </NuxtLink>
        </div>

        <!-- Desktop header links -->
        <div class="hidden lg:flex items-center gap-2 text-white">
          <NuxtLink
            :to="computedSwitchLocalePath.to"
            class="text-white no-underline hover:underline px-2 py-1 text-sm"
            active-class="font-bold"
          >
            {{ computedSwitchLocalePath.label }}
          </NuxtLink>
          <a href="https://instagram.com/sleepwalkersultimate" aria-label="Instagram" target="_blank" rel="noopener" class="flex items-center text-white hover:opacity-80 px-1">
            <UIcon name="i-lucide-instagram" class="size-[1.1rem]" aria-hidden />
          </a>
          <a href="https://www.facebook.com/sleepwalkersultimate" aria-label="Facebook" target="_blank" rel="noopener" class="flex items-center text-white hover:opacity-80 px-1">
            <UIcon name="i-lucide-facebook" class="size-[1.1rem]" aria-hidden />
          </a>
          <div class="border-l border-white/30 h-5 mx-1" />
          <UColorModeButton />
        </div>
      </div>
    </header>

    <!-- Mobile Slideover -->
    <USlideover v-model:open="mobileOpen" side="left" title="Menu">
      <template #body>
        <nav class="mb-4">
          <ul class="space-y-1">
            <li v-for="link in navigationComputed" :key="link.route">
              <NuxtLink
                :to="link.route"
                class="block px-3 py-2 rounded no-underline text-inherit hover:bg-gray-100 dark:hover:bg-gray-800"
                active-class="font-bold"
                @click="mobileOpen = false"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Mobile social links + theme -->
        <div class="flex items-center gap-2 px-3 mb-4">
          <NuxtLink
            :to="computedSwitchLocalePath.to"
            class="text-sm no-underline text-inherit hover:underline"
            @click="mobileOpen = false"
          >
            {{ computedSwitchLocalePath.label }}
          </NuxtLink>
          <a href="https://instagram.com/sleepwalkersultimate" aria-label="Instagram" target="_blank" rel="noopener" class="text-inherit hover:opacity-80 px-1">
            <UIcon name="i-lucide-instagram" class="size-[1.1rem]" aria-hidden />
          </a>
          <a href="https://www.facebook.com/sleepwalkersultimate" aria-label="Facebook" target="_blank" rel="noopener" class="text-inherit hover:opacity-80 px-1">
            <UIcon name="i-lucide-facebook" class="size-[1.1rem]" aria-hidden />
          </a>
          <div class="border-l border-gray-300 dark:border-gray-600 h-5 mx-1" />
          <UColorModeButton />
        </div>

        <Practices small />
      </template>
    </USlideover>

    <!-- Main layout with sidebar -->
    <div class="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-6">
      <!-- Desktop sidebar -->
      <aside class="hidden lg:block sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto py-4">
        <nav class="mb-3">
          <ul class="shadow rounded space-y-1 py-2">
            <li v-for="link in navigationComputed" :key="link.route">
              <NuxtLink
                :to="link.route"
                class="block px-3 py-1.5 no-underline text-inherit hover:bg-gray-100 dark:hover:bg-gray-800"
                active-class="font-bold"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <Practices small />
      </aside>

      <!-- Main content -->
      <main class="py-4">
        <slot />
      </main>
    </div>

    <footer>
      <ul class="hidden">
        <li
          v-for="link in navigationComputed"
          :key="link.route"
        >
          <NuxtLink
            :to="link.route"
            class="no-underline text-inherit"
            active-class="font-bold"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup lang="ts">

const { locale } = useI18n()
const otherLocale = computed(() => (locale.value === 'fi' ? 'en' : 'fi'))
const mobileOpen = ref(false)

const { data: blogPosts } = await useAsyncData(() => `home-blogposts-${locale.value}`, () =>
  queryCollection('blog')
    .where('path', 'LIKE', `/${locale.value}/blog%`)
    .andWhere(query => query.where('published', '=', true))
    .order('date', 'DESC')
    .limit(4).all())

const { data: navigation } = await useAsyncData(() => `navigation-${locale.value}`, () => queryCollectionNavigation('content').where('path', 'LIKE', `/${locale.value}/%`))
const { data: navigationOtherLocale } = await useAsyncData(() => `navigationOtherLocale-${locale.value}`, () => queryCollectionNavigation('content').where('path', 'LIKE', `/${otherLocale.value}/%`))

const navigationComputed = computed(() => {
  if (!navigation.value?.[0].children)
    return []
  return navigation.value[0].children
    .map(i => ({
      label: i.title,
      route: i.path,
    }))
})

const { data: otherBlogPosts } = await useAsyncData(() => `all-blogposts-${otherLocale.value}`, () =>
  queryCollection('blog')
    .where('path', 'LIKE', `/${otherLocale.value}/blog%`)
    .andWhere(query => query.where('published', '=', true))
    .all())

function hasLocaleSwitch(link: string) {
  if (navigationOtherLocale.value?.[0]?.path === link)
    return true
  if (navigationOtherLocale.value?.[0]?.children?.some(i => i.path === link))
    return true
  if (link === `/${otherLocale.value}/blog`)
    return true
  if (link.includes('/blog')) {
    if (otherBlogPosts.value?.some(i => i.path === link))
      return true
  }
  return false
}

const route = useNuxtApp().$router.currentRoute
const computedSwitchLocalePath = computed(() => {
  let link = route.value.path
  link = link.replace(new RegExp(`^/${locale.value}`), `/${otherLocale.value}`)

  while (!hasLocaleSwitch(link) && link.includes('/') && link !== '/')
    link = link.replace(/\/[^/]*$/, '')
  return {
    to: link,
    label: locale.value === 'fi' ? 'English' : 'Suomi',
  }
})

function localePath(path: string) {
  return `/${locale.value}${path.startsWith('/') ? path : `/${path}`}`
}

// Theme / color mode
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<style>
svg {
  display: inline;
}
</style>
