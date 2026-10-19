import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cmsDemo',
  title: 'Homepage: CMS Visualization',
  type: 'document',
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      description: 'Small badge text displayed above the heading (e.g., "Seamless Integration")',
      initialValue: 'Seamless Integration',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'object',
      fields: [
        {
          name: 'line1',
          title: 'First Line',
          type: 'string',
          description: 'First part of the heading (e.g., "All your products,")',
          initialValue: 'All your products,',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'line2',
          title: 'Second Line',
          type: 'string',
          description: 'Second part of the heading (e.g., "one powerful dashboard")',
          initialValue: 'one powerful dashboard',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Subheading text below the main heading',
      initialValue: 'Manage your entire catalog effortlessly. Our CMS brings all your products together in one intuitive interface.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flowProducts',
      title: 'Jenis produk di diagram alur',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Jenis produk Fortu yang tampil di tiap gedung pada diagram "Pengguna > Marien > Gedung > Produk". Contoh: Digital Signage, Wallmount Display, Videotron, Layar Lift. Minimal 3; kosongkan untuk memakai daftar bawaan.',
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'products',
      title: 'Demo Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product Reference',
              type: 'reference',
              to: [{type: 'product'}],
              description: 'Reference to an existing product document',
            },
            {
              name: 'customProduct',
              title: 'Or Use Custom Product Data',
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Product Name',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'image',
                  title: 'Product Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alternative Text',
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
            {
              name: 'position',
              title: 'Position',
              type: 'string',
              description: 'Where this product appears in the visualization',
              options: {
                list: [
                  {title: 'Top Left', value: 'top-left'},
                  {title: 'Top Right', value: 'top-right'},
                  {title: 'Bottom Center', value: 'bottom-center'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              productName: 'product.name',
              customName: 'customProduct.name',
              position: 'position',
              productImage: 'product.images.0',
              customImage: 'customProduct.image',
            },
            prepare({productName, customName, position, productImage, customImage}) {
              return {
                title: productName || customName || 'Unnamed Product',
                subtitle: `Position: ${position || 'not set'}`,
                media: productImage || customImage,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(3).error('You must have between 1 and 3 products'),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this CMS Demo section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      badge: 'badge',
      heading: 'heading.line1',
      active: 'isActive',
    },
    prepare({badge, heading, active}) {
      return {
        title: heading || 'CMS Demo Section',
        subtitle: `${badge || 'No badge'} - ${active ? 'Active' : 'Inactive'}`,
      }
    },
  },
})

