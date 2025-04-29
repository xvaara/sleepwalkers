import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getIgData } from './utils/ig'
import { getPracticesData } from './utils/practices'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    resetSecret: '',
  },
  hooks: {
    'build:before': async (nuxt) => {
      console.log('Building gallery json...')
      const files = await readdir('public/images/gallery')
      const images = files.filter(i => i.match(/\.(jpeg|jpg|gif|png)/) !== null).map(i => `/images/gallery/${i}`)
      const target = path.join('public', 'images/gallery.json')
      await writeFile(target, JSON.stringify(images, null, 2))

      try {
        console.log('get ig...')
        let ig = null
        for (let attempt = 1; attempt <= 4; attempt++) {
          const timeStart = Date.now()
          ig = await getIgData()
          const timeEnd = Date.now()
          const timeDiff = timeEnd - timeStart
          console.log(`Attempt ${attempt} took ${timeDiff}ms`)
          if (Array.isArray(ig) && ig.length > 0) {
            console.log(`got ig data on attempt ${attempt}`, ig.length)
            await writeFile(path.join('public', 'data', 'ig.json'), JSON.stringify(ig, null, 2))
            break
          }
          else {
            console.warn(`Attempt ${attempt} failed to get ig data`, ig)
          }
        }
        if (!Array.isArray(ig) || ig.length === 0)
          console.error('Error getting ig data after 4 attempts', ig)
      }
      catch (e) {
        console.error('Error getting ig data', e)
      }
      try {
        console.log('get practices...')
        const practices = await getPracticesData()
        await writeFile(path.join('public', 'data', 'practices.json'), JSON.stringify(practices, null, 2))
      }
      catch (e) {
        console.error('Error getting practices data', e)
      }
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      title: 'Sleepwalkers',
      titleTemplate: '%s - Sleepwalkers',
      meta: [{ name: 'description', content: 'Sleepwalkers ultimate in Jyväskylä' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  sitemap: {
    strictNuxtContentPaths: true,
  },
  site: {
    url: 'https://sleepwalkers.fi',
    identity: {
      type: 'organization',
    },
    instagram: 'https://www.instagram.com/sleepwalkersultimate/',
    facebook: 'https://www.facebook.com/sleepwalkersultimate',
  },

  typescript: {
    strict: true,
  },
  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt'],
    },
    publicAssets: [
      {
        baseURL: 'images',
        dir: path.join(__dirname, `public/images`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },
      {
        baseURL: 'data',
        dir: path.join(__dirname, `public/data`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },
      {
        baseURL: 'files',
        dir: path.join(__dirname, `public/files`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },

    ],
  },
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@bootstrap-vue-next/nuxt',
    '@nuxtjs/i18n',
    ['unplugin-icons/nuxt', { /* options */ }],
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/bootstrap.scss'],
  i18n: {
    locales: ['fi', 'en'], // used in URL path prefix
    defaultLocale: 'fi', // default locale of your project for Nuxt pages and routings
    switchLocalePath: '/:lang/:route',
    setLocaleCookie: true,
    strategy: 'prefix',
    getLocaleCookie: 'i18n_loc',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
  },
  // routeRules: {
  //   '/': { prerender: false },
  //   '/fi': { prerender: true },
  //   '/en': { prerender: true },
  // },
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    renderer: {
      anchorLinks: false,
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },
  image: {
    screens: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
  features: {
    inlineStyles: false,
  },
  ssr: true,
  // target: 'static',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          charset: false,
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
        },
      },
    },
  },
  compatibilityDate: '2025-04-29',
})
