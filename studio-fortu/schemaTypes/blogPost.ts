import {defineField, defineType} from 'sanity'
import {seoFields} from './seoFields'

export default defineType({
  name: 'blogPost',
  title: 'Blog: Artikel',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'media', title: 'Media'},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basic',
      description: 'Blog post title',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      description: 'URL slug — generated from title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'basic',
      rows: 3,
      description: 'Short summary shown on the blog listing card',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'basic',
      description: 'Author name',
      initialValue: 'FORTU Digital',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'basic',
      description: 'Publication date',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Berita', value: 'news'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Produk', value: 'product'},
          {title: 'Tips', value: 'tips'},
          {title: 'Lainnya', value: 'other'},
        ],
      },
      initialValue: 'news',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'basic',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      description: 'Main image shown on the listing card and at the top of the post',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      description: 'Article body content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Override the default <title>. Defaults to post title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Override the default meta description. Defaults to excerpt.',
      validation: (Rule) => Rule.max(160),
    }),
    ...seoFields({withTitleDescription: false}),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'basic',
      description: 'Highlight this post on the listing page',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Published',
      type: 'boolean',
      group: 'basic',
      description: 'Toggle to publish/unpublish this post',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      publishedAt: 'publishedAt',
      media: 'coverImage',
      active: 'isActive',
    },
    prepare({title, author, publishedAt, media, active}) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'No date'
      return {
        title: title || 'Untitled Post',
        subtitle: `${date} • ${author || 'No author'}${active ? '' : ' • Draft'}`,
        media,
      }
    },
  },
})
