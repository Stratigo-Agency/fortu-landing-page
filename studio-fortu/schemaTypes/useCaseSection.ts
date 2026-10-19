import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'useCaseSection',
  title: 'Homepage: Past Clients Picture Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading for the section (e.g., "You\'ll never ride alone")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Subheading text below the main heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Gallery Items',
      type: 'array',
      of: [
        defineField({
          name: 'useCaseItem',
          title: 'Use Case Item',
          type: 'object',
          fields: [
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Image', value: 'image'},
                  {title: 'Video', value: 'video'},
                ],
                layout: 'radio',
              },
              initialValue: 'image',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({parent}) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({parent}) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Wajib: jelaskan apa yang terlihat (bukan sekadar "gambar"). Dipakai Google dan pembaca layar.',
              validation: (Rule) => Rule.required().warning('Isi alt text agar gambar dikenali Google.'),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption shown on hover',
            }),
            defineField({
              name: 'size',
              title: 'Card Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Short', value: 'short'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Tall', value: 'tall'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
              description: 'Controls the height of the card in the masonry grid',
            }),
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              caption: 'caption',
              alt: 'alt',
              media: 'image',
            },
            prepare({mediaType, caption, alt, media}) {
              return {
                title: caption || alt || 'Untitled Item',
                subtitle: `${mediaType === 'video' ? '🎬 Video' : '🖼️ Image'}`,
                media: media,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).error('Please add at least one gallery item.'),
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
      subtitle: 'description',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled Use Case Section',
        subtitle: subtitle,
      }
    },
  },
})


