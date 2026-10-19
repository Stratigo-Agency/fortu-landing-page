import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pageHero',
  title: 'Hero Produk, Tentang, Kontak',
  type: 'document',
  fields: [
    defineField({
      name: 'pageName',
      title: 'Page Name',
      type: 'string',
      description: 'Identifier for which page this hero belongs to',
      options: {
        list: [
          {title: 'Products', value: 'products'},
          {title: 'About', value: 'about'},
          {title: 'Contact', value: 'contact'},
          {title: 'Services', value: 'services'},
          {title: 'Privacy', value: 'privacy'},
          {title: 'Blog', value: 'blog'},
          {title: 'Studi Kasus', value: 'case-studies'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main heading text (e.g., "Discover Fortu")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Optional subtitle below the title',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Jelaskan apa yang terlihat dan sebut nama produk, bukan sekadar "gambar".',
          validation: (Rule) =>
            Rule.required().warning('Isi alt text: jelaskan apa yang terlihat dan sebut nama produk (bukan sekadar "gambar").'),
        },
      ],
      description: 'Background image (used if no video is provided)',
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Background video (takes priority over image if both provided)',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      type: 'number',
      description: 'Darkness of the overlay (0-100). Default is 60',
      initialValue: 60,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this hero section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pageName: 'pageName',
      media: 'backgroundImage',
      active: 'isActive',
    },
    prepare({title, pageName, media, active}) {
      return {
        title: title || 'Untitled Hero',
        subtitle: `${pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : 'No page'} - ${active ? 'Active' : 'Inactive'}`,
        media,
      }
    },
  },
})


