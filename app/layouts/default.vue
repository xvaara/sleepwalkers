<template>
  <div>
    <DefineTemplate>
      <div
        v-b-color-mode="'dark'"
        class="d-flex gap-2 flex-wrap socials ms-auto"
        :style="{
          '--bs-link-color': 'var(--white)',
        }"
      >
        <BNav class="d-flex">
          <li class="nav-item py-1">
            <NuxtLink
              :to="computedSwitchLocalePath.to"
              class="nav-link"
              active-class="active fw-bold"
            >
              {{ computedSwitchLocalePath.label }}
            </NuxtLink>
          </li>
          <BNavItem
            v-for="link in headerExternalLinks"
            :key="link.label"
            :href="link.url"
            :link-attrs="{ 'aria-label': link.label }"
            target="_blank"
            rel="noopener"
            link-classes="py-1 px-0"
          >
            <component :is="link.icon()" height="1.1rem" aria-hidden />
          </BNavItem>
          <div class="border spacer align-self-center border-secondary ms-2 me-3" />
          <ClientOnly>
            <BNavItemDropdown toggle-class="px-0">
              <template #button-content>
                <component :is="currentIcon" height="1.1rem" :aria-label="`Toggle theme (${dark})`" />
              </template>
              <BDropdownItem v-for="el in options" :key="el" :active="dark === el" @click="set(el)">
                <component :is="map[el]" /> {{ el }}
              </BDropdownItem>
            </BNavItemDropdown>
          </ClientOnly>
        </BNav>
      </div>
    </DefineTemplate>
    <BNavbar v-b-color-mode="'dark'" class="shadow" variant="primary" sticky="top" toggleable="lg" :container="true" style="--bs-navbar-padding-y: 0;">
      <div class="d-flex gap-2 align-items-center nav">
        <BNavbarToggle v-b-toggle.sidebar-menu class="my-1" />
        <NuxtLink :to="localePath('/')" class="navbar-brand p-0 m-auto">
          <img src="/images/sleepwalkers-logo.png" alt="Sleepwalkers" class="logo">
        </NuxtLink>
        <div class="border spacer border-secondary ms-3 me-0" />
      </div>

      <ReuseTemplate class="d-none d-lg-block" />
    </BNavbar>
    <BContainer fluid class="container-lg bd-layout">
      <aside class="bd-sidebar">
        <BOffcanvas
          id="sidebar-menu"
          v-model="sidebar"
          :teleport-disabled="true"
          no-backdrop
          no-trap
          class="h-100 border-0"
          :body-scrolling="isLargeScreen"
          header-class="bg-primary py-0"
          @shown="fixOffcanvasModal"
        >
          <template #header="{ hide }">
            <div v-b-color-mode="'dark'" class="d-flex align-items-center w-100">
              <div class="d-block d-lg-none">
                <ReuseTemplate />
              </div>
              <BCloseButton
                class="ms-auto"

                aria-label="close"
                @click="hide('close')"
              />
            </div>
          </template>
          <ul class="nav flex-column shadow rounded mb-3">
            <li
              v-for="link in navigationComputed"
              :key="link.route"
              class="nav-item py-1"
            >
              <NuxtLink
                :to="link.route"
                class="nav-link"
                active-class="active fw-bold"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <Practices small />
        </BOffcanvas>
      </aside>
      <main class="mt-3">
        <!-- <div>{{ locale }} - {{ otherLocale }}  -- {{ computedSwitchLocalePath }}</div>
        <pre>
          {{ navigation }}
          {{ navigationOtherLocale }}
        </pre> -->
        <BContainer>
          <slot />
        </BContainer>
      </main>
    </BContainer>
    <footer>
      <ul class="nav d-none">
        <li
          v-for="link in navigationComputed"
          :key="link.route"
          class="nav-item py-1"
        >
          <NuxtLink
            :to="link.route"
            class="nav-link"
            active-class="active fw-bold"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup lang="ts">
import InstagramIcon from '~icons/bi/instagram'
import FacebookIcon from '~icons/bi/facebook'
import MoonStarsFill from '~icons/bi/moon-stars-fill'
import SunFill from '~icons/bi/sun-fill'

import CircleHalf from '~icons/bi/circle-half'

const { locale, setLocale } = useI18n()
const otherLocale = computed(() => (locale.value === 'fi' ? 'en' : 'fi'))
const isLargeScreen = useMediaQuery('(min-width: 992px)')
const sidebar = ref(true)

function fixOffcanvasModal() {
  const el = document.getElementById('sidebar-menu')
  if (el) {
    el.removeAttribute('aria-modal')
    el.removeAttribute('role')
  }
}

onMounted(() => {
  sidebar.value = isLargeScreen.value
  nextTick(fixOffcanvasModal)
  watch(isLargeScreen, (value) => {
    sidebar.value = value
  })
})

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const { data: blogPosts } = await useAsyncData(() => `home-blogposts-${locale.value}`, () =>
  queryCollection('blog')
    .where('path', 'LIKE', `/${locale.value}/blog%`)
    .andWhere(query => query.where('published', '=', true))
    .order('date', 'DESC')
    .limit(4).all())
// console.log(blogPosts)

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
// const switchLocalePath = useSwitchLocalePath()

// const router = useRouter()
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
  // let link = switchLocalePath(otherLocale.value)
  // let link = ''
  let link = route.value.path
  link = link.replace(new RegExp(`^/${locale.value}`), `/${otherLocale.value}`)

  while (!hasLocaleSwitch(link) && link.includes('/') && link !== '/')
    link = link.replace(/\/[^/]*$/, '')
  return {
    to: link,
    label: locale.value === 'fi' ? 'English' : 'Suomi',
  }
})

// const localePath = useLocalePath()
function localePath(path: string) {
  return `/${locale.value}${path.startsWith('/') ? path : `/${path}`}`
}

// const route = useRoute()

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

onMounted(() => {
  watch(
    dark,
    (newValue) => {
      if (newValue === 'dark')
        document.documentElement.classList.add('dark')
      else
        document.documentElement.classList.remove('dark')
    },
    { immediate: true },
  )
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

<style lang="scss">
#__nuxt {
  --black: #000000;
  --white: #ffffff;
  --pink: #e83e8c;
  --bvn-bg-primary: linear-gradient(
    45deg,
    var(--bs-primary) 0%,
    rgb(190, 35, 35) 72%,
    rgb(39, 27, 27) 100%
  );
  --bs-nav-link-color: var(--white);

  .negative-margin-offcanvas {
    margin-left: calc(-1 * var(--bs-offcanvas-padding-x));
  }
  svg {
    display: inline;
  }

  .bg-primary {
    background: var(--bvn-bg-primary) !important;
    border-color: var(--bvn-bg-primary);
    color: var(--white);
  }

  @mixin hover-focus-active() {
    &:hover,
    &:focus,
    &:active {
      @content;
    }
  }

  // Navbar.
  > .navbar {
    color: var(--white);
    // box-shadow:
    //   0 0.5rem 1rem rgba(0, 0, 0, 0.15),
    //   inset 0 -1px 0 rgba(255, 255, 255, 0.15);

    .nav-link,
    .navbar-brand,
    .btn {
      color: var(--white);
    }

    .socials {
      .nav-link {
        padding: 0 0.5rem;
      }
    }
  }

  // Sidebar.
  .offcanvas {
    .offcanvas-header{
      color: var(--white);
      button.btn-close {
        --bs-btn-close-color: var(--white);
        color: var(--white) !important;
      }
    }
    box-shadow: none;
    // box-shadow:
    //   0 0.5rem 1rem rgba(0, 0, 0, 0.15),
    //   inset 0 -1px 0 rgba(255, 255, 255, 0.15);

    .list-group {
      border: none;
      padding: 0 0 1.5rem 0;
      font-size: 0.875em;
      .list-group-item {
        border-left: none;
        border-right: none;
        &:last-child {
          border-bottom: none;
        }

        padding: 0.3em 0.5em;

        a {
          // color: var(--bs-body-color);
          // display: block;
          // padding: 0.13rem 0.7rem 0.13rem 0;
          // margin: 0.125rem 0;
          text-decoration: none;
        }
      }
    }
  }
}

// Sidebar onscreen.
@media (min-width: 992px) {
  .bd-layout {
    display: grid !important;
    grid-template-areas: 'sidebar main';
    grid-template-columns: 1fr 5fr;
    gap: 1.5rem;

    .bd-sidebar {
      grid-area: sidebar;
      position: -webkit-sticky;
      position: sticky;
      top: 3rem;
      display: block !important;
      height: calc(100vh - 3rem);
      padding-left: 0.25rem;
      margin-left: -0.25rem;
      overflow-y: auto;

      .offcanvas {
        transition: none !important;
        transform: 0;
        position: relative !important;

        .offcanvas-header {
          padding: 0;
          .btn-close {
            display: none;
          }
        }
      }
    }
  }
}

// Sidebar width.
.bd-sidebar,
.otp-sidebar {
  @media (min-width: 992px) {
    min-width: 15rem;
  }

  .offcanvas.offcanvas-start,
  .offcanvas.offcanvas-end {
    @media (min-width: 992px) {
      width: 15rem !important;
    }

    @media (max-width: 991px) {
      .bd-links-nav {
        -moz-column-count: 2;
        column-count: 2;
        -moz-column-gap: 1.5rem;
        column-gap: 1.5rem;
      }
    }
  }

  .offcanvas.offcanvas-end {
    @media (max-width: 991px) {
      max-width: 15rem;
    }
  }
}
</style>
