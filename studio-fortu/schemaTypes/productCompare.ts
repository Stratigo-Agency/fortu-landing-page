import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productCompare',
  title: 'Product Comparison',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Optional heading above the comparison',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Optional description text',
    }),
    defineField({
      name: 'products',
      title: 'Products to Compare',
      type: 'array',
      description:
        'Pilih produk yang dibandingkan (maksimal 4). Spesifikasi diambil dari tiap produk: spesifikasi yang dimiliki minimal dua produk menjadi baris sejajar, sisanya masuk baris "Fitur lain". Di desktop semua produk tampil sejajar; di HP pengunjung membandingkan 2 produk lewat dropdown. Produk berstatus "Segera hadir" tampil tanpa tombol.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Button Label',
              type: 'string',
              description: 'Button text (e.g., "Pelajari Lebih Lanjut", "Lihat Produk")',
              initialValue: 'Pelajari Lebih Lanjut',
            }),
            defineField({
              name: 'compareImage',
              title: 'Compare Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional custom image to display in comparison. If not provided, the first product image will be used as fallback.',
            }),
          ],
          preview: {
            select: {
              title: 'product.name',
              media: 'compareImage',
              productMedia: 'product.images.0',
            },
            prepare({title, media, productMedia}) {
              return {
                title: title || 'Select a product',
                subtitle: '',
                media: media || productMedia,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4).error('Pilih 1 sampai 4 produk'),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Dark', value: 'dark'},
          {title: 'Light', value: 'light'},
        ],
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this comparison section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      products: 'products',
      active: 'isActive',
    },
    prepare({heading, products, active}) {
      const count = products?.length || 0
      return {
        title: heading || 'Product Comparison',
        subtitle: `${active ? '✓' : '✗'} ${count} product${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
