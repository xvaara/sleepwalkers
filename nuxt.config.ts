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
        const ig = await getIgData()
        if (ig.error)
          console.error('Error getting ig data', ig.error)
        else
          await writeFile(path.join('public', 'data', 'ig.json'), JSON.stringify(ig, null, 2))
        console.log('get practices...')
        const practices = await getPracticesData()
        await writeFile(path.join('public', 'data', 'practices.json'), JSON.stringify(practices, null, 2))
      }
      catch (e) {
        console.error('Error getting data', e)
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
    prerender: {
      autoSubfolderIndex: false,
      // crawlLinks: true,
      // routes: [
      //   '/',
      // ],
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
  hub: {
    database: true,
  },
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@bootstrap-vue-next/nuxt',
    '@nuxtjs/i18n',
    ['unplugin-icons/nuxt', { /* options */ }],
    '@nuxt/image',
    'nuxt-simple-robots',
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
    highlight: false,
    markdown: {
      anchorLinks: false,
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
})
