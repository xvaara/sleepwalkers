<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import InstagramIcon from '~icons/bi/instagram'
import FacebookIcon from '~icons/bi/facebook'
import MoonStarsFill from '~icons/bi/moon-stars-fill'
import SunFill from '~icons/bi/sun-fill'

import CircleHalf from '~icons/bi/circle-half'

const { locale, setLocale } = useI18n()

const route = useRoute()

const locales = [
  {
    id: 'fi',
    route: ('/fi'),
    label: 'Suomi',
  },
  {
    id: 'en',
    route: ('/en'),
    label: 'English',
  },
]

const headerExternalLinks = [
  {
    url: 'https://instagram.com/sleepwalkersultimate',
    label: 'Instagram',
    icon: () => InstagramIcon,
  },
  {
    url: 'https://www.facebook.com/sleepwalkersultimate',
    label: 'Facebook',
    icon: () => FacebookIcon,
  },
]

const dark = useColorMode({
  persist: true,
})

const map = {
  dark: MoonStarsFill,
  light: SunFill,
  auto: CircleHalf,
}

const options = Object.keys(map) as (keyof typeof map)[]

const currentIcon = computed(() => map[dark.value])

function set(newValue: keyof typeof map) {
  dark.value = newValue
}
</script>
