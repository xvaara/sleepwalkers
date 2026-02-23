import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: [
          'blog-arkisto/*.md',
          'practices/**',
        ],
      },

    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog-arkisto/*.md',

      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
        published: z.boolean(),
        alt: z.string(),
        ogImage: z.string(),

      }),
    }),
    practices: defineCollection({
      type: 'page',
      source: {
        include: 'practices/*.md',
        exclude: ['practices/*.template.md', 'practices/_**.md'],
      },

      schema: z.object({
        title: z.string(),
        title_en: z.string().optional(),
        start: z.string(),
        end: z.string(),
        weekday: z.number(),
        location: z.string(),
        map: z.string(),
      }),
    }),
    data: defineCollection({
      type: 'page',
      source: '**/*.yml',
      schema: z.object({
        links: z.object({
          // facebook: z.string(),
          // instagram: z.object({
          //   text: z.string(),
          //   link: z.string(),

          // }),
          // email: z.object({
          //   text: z.string(),
          //   link: z.string(),
          // }),
        }),
      }),
    }),
  },
})
