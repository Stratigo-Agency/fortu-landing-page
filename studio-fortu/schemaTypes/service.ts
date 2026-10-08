import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Homepage: Pelayanan Lengkap',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading for the services section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Optional subheading or description',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Service Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name for the service',
              options: {
                list: [
                  {title: 'Tools / Installation', value: 'tools'},
                  {title: 'Shield / Warranty', value: 'shield'},
                  {title: 'Truck / Delivery', value: 'truck'},
                  {title: 'Headset / Support', value: 'headset'},
                  {title: 'Wrench / Maintenance', value: 'wrench'},
                  {title: 'Clock / Fast Service', value: 'clock'},
                  {title: 'Star / Premium', value: 'star'},
                  {title: 'Check / Quality', value: 'check'},
                  {title: 'Refresh / Exchange', value: 'refresh'},
                  {title: 'Map / Location', value: 'map'},
                  {title: 'Phone / Contact', value: 'phone'},
                  {title: 'Gift / Bonus', value: 'gift'},
                ],
              },
            }),
            defineField({
              name: 'illustration',
              title: 'Ilustrasi',
              type: 'string',
              description:
                'Ilustrasi garis bawaan Fortu untuk kartu ini. Jika dipilih, dipakai menggantikan foto latar. Tanpa ilustrasi dan tanpa foto, kartu tampil polos.',
              options: {
                list: [
                  {title: 'Konsultasi', value: 'konsultasi'},
                  {title: 'Delivery', value: 'delivery'},
                  {title: 'Instalasi', value: 'instalasi'},
                  {title: 'Maintenance', value: 'maintenance'},
                  {title: 'After Sales Service', value: 'aftersales'},
                ],
              },
            }),
            defineField({
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional background image for the card. If not set, uses default off-white background.',
            }),
            defineField({
              name: 'darkOverlay',
              title: 'Dark Overlay',
              type: 'boolean',
              description: 'Add dark overlay for better text readability on images',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'backgroundImage',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Untitled Service',
                subtitle: subtitle ? subtitle.substring(0, 50) + '...' : '',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this section appears',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      services: 'services',
      active: 'isActive',
    },
    prepare({title, services, active}) {
      const count = services?.length || 0
      return {
        title: title || 'Services Section',
        subtitle: `${active ? '✓' : '✗'} ${count} service${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

