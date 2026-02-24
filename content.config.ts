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
      schema: z.object({
        subtitle: z.string().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        contacts: z.array(z.object({
          href: z.string(),
          label: z.string(),
          icon: z.string().optional(),
          iconSrc: z.string().optional(),
          external: z.boolean().optional(),
          text: z.string(),
        })).optional(),
      }),

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
        location_en: z.string().optional(),
        map: z.string(),
      }),
    }),
    practiceTemplates: defineCollection({
      type: 'page',
      source: 'practices/*.template.md',
      schema: z.object({
        title: z.string(),
        title_en: z.string().optional(),
        start: z.string(),
        end: z.string(),
        weekday: z.number(),
        location: z.string(),
        location_en: z.string().optional(),
        map: z.string(),
      }),
    }),
    data: defineCollection({
      type: 'data',
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
