import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Homepage: Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
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
      description: 'Background image for the hero (used if no video is provided)',
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
      name: 'backgroundVideoMobile',
      title: 'Background Video (mobile, lighter)',
      type: 'file',
      options: {accept: 'video/mp4'},
      description:
        'Versi ringan untuk HP (mis. 1280 px lebar, di bawah 1 MB, tanpa suara). Dipakai otomatis di layar sempit agar halaman cepat dibuka.',
    }),
    defineField({
      name: 'backgroundPoster',
      title: 'Video Poster',
      type: 'image',
      options: {hotspot: true},
      description:
        'Gambar diam yang tampil sebelum video siap, dan menggantikan video bagi pengunjung yang memilih gerakan dikurangi atau hemat data. Ambil dari satu frame video.',
      fields: [
        {name: 'alt', type: 'string', title: 'Alternative Text', description: 'Jelaskan isi gambar dan nama produk.'},
      ],
    }),
    defineField({
      name: 'ctaButtons',
      title: 'Call-to-Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Button Label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'link',
              type: 'string',
              title: 'Link URL',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'variant',
              type: 'string',
              title: 'Button Style',
              options: {
                list: [
                  {title: 'Primary', value: 'primary'},
                  {title: 'Secondary', value: 'secondary'},
                  {title: 'Outline', value: 'outline'},
                ],
              },
              initialValue: 'primary',
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'link',
            },
          },
        },
      ],
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
      initialValue: 'left',
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
      subtitle: 'subtitle',
    },
  },
})


