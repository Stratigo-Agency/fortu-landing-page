import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productSlide',
  title: 'Homepage: Product Banner Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'Name displayed in the tab selector (e.g., "Cruiser", "Cruiser ST")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Main heading displayed on the slide (e.g., "The easy-rider")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'comingSoon',
      title: 'Segera hadir',
      type: 'boolean',
      description:
        'Aktifkan jika foto produk belum ada. Tab tampil dengan label "Segera" dan tombol "Segera hadir" (tanpa link). Matikan setelah foto dan halaman produk siap.',
      initialValue: false,
    }),
    defineField({
      name: 'slideImage',
      title: 'Slide Image',
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
      description:
        'Foto produk yang menonjolkan produknya (boleh ada manusia kecil sebagai konteks). Wajib kecuali "Segera hadir".',
      validation: (Rule) =>
        Rule.custom((value, ctx) =>
          !value && !(ctx.document as {comingSoon?: boolean})?.comingSoon ? 'Foto wajib diisi' : true,
        ),
    }),
    defineField({
      name: 'features',
      title: 'Feature Tags',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featureTag',
          fields: [
            defineField({
              name: 'text',
              title: 'Feature Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional icon name for digital signage features',
              options: {
                list: [
                  {title: 'None', value: ''},
                  // Media & Display
                  {title: 'Camera', value: 'camera'},
                  {title: 'Video', value: 'video'},
                  {title: 'Display/Screen', value: 'display'},
                  {title: 'Touch', value: 'touch'},
                  {title: 'Resolution', value: 'resolution'},
                  {title: 'Brightness', value: 'brightness'},
                  {title: 'LED', value: 'led'},
                  // Connectivity
                  {title: 'WiFi', value: 'wifi'},
                  {title: 'Bluetooth', value: 'bluetooth'},
                  {title: 'NFC', value: 'nfc'},
                  {title: 'USB', value: 'usb'},
                  {title: 'HDMI', value: 'hdmi'},
                  {title: 'Network', value: 'network'},
                  {title: 'Cloud', value: 'cloud'},
                  // Audio & Sensors
                  {title: 'Audio/Speaker', value: 'audio'},
                  {title: 'Microphone', value: 'microphone'},
                  {title: 'Sensor', value: 'sensor'},
                  {title: 'QR Code', value: 'qrcode'},
                  // Power & Energy
                  {title: 'Battery', value: 'battery'},
                  {title: 'Power', value: 'power'},
                  {title: 'Energy', value: 'energy'},
                  // Features & Controls
                  {title: 'Remote', value: 'remote'},
                  {title: 'Schedule', value: 'schedule'},
                  {title: 'Timer', value: 'timer'},
                  {title: 'App', value: 'app'},
                  {title: 'Content', value: 'content'},
                  {title: 'Analytics', value: 'analytics'},
                  {title: 'Mount/Wall', value: 'mount'},
                  // Security & Safety
                  {title: 'Lock', value: 'lock'},
                  {title: 'Security', value: 'security'},
                  // General
                  {title: 'GPS', value: 'gps'},
                  {title: 'Frame', value: 'frame'},
                  {title: 'Range', value: 'range'},
                  {title: 'Speed', value: 'speed'},
                  {title: 'Check', value: 'check'},
                  {title: 'Pen', value: 'pen'},
                  {title: 'Temperature', value: 'temperature'},
                  {title: 'Weather', value: 'weather'},
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'text',
              icon: 'icon',
            },
            prepare({title, icon}) {
              return {
                title: title || 'Untitled Feature',
                subtitle: icon ? `Icon: ${icon}` : 'No icon',
              }
            },
          },
        },
      ],
      description: 'Short feature highlights with optional icons',
    }),
    defineField({
      name: 'product',
      title: 'Linked Product',
      type: 'reference',
      to: [{type: 'product'}],
      description: 'Optional: Link to a product for more details',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which the slide appears (lower numbers appear first)',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this slide',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'slideImage',
      active: 'isActive',
    },
    prepare({title, subtitle, media, active}) {
      return {
        title: title || 'Untitled Slide',
        subtitle: `${active ? '✓' : '✗'} ${subtitle || ''}`,
        media,
      }
    },
  },
})

