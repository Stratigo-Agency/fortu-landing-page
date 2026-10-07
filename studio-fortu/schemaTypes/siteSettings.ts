import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Social Media & Company Information',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Contact Information', default: true},
    {name: 'social', title: 'Social Media'},
    {name: 'branding', title: 'Branding'},
  ],
  fields: [
    // CONTACT INFORMATION
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      group: 'branding',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'branding',
      description: 'Short company description for footer',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'branding',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'address',
      title: 'Address (legacy - use Offices)',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
    defineField({
      name: 'offices',
      title: 'Offices',
      type: 'array',
      group: 'contact',
      description:
        'Daftar kantor (Jakarta, Medan, Bali). Footer, halaman Kontak, dan data untuk Google membaca dari sini. Kantor tanpa link Google Maps tidak menampilkan link.',
      of: [
        defineField({
          name: 'office',
          title: 'Office',
          type: 'object',
          fields: [
            defineField({name: 'city', title: 'City', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'name', title: 'Office / Building Name', type: 'string', description: 'Contoh: Fortu Digital Teknologi, Menara Electric'}),
            defineField({name: 'address', title: 'Full Address', type: 'text', rows: 3}),
            defineField({name: 'phone', title: 'Phone (optional)', type: 'string'}),
            defineField({name: 'mapsUrl', title: 'Google Maps Link', type: 'url', description: 'Link "Bagikan" dari Google Maps (maps.app.goo.gl/...).'}),
            defineField({
              name: 'mapsEmbed',
              title: 'Google Maps Embed URL',
              type: 'url',
              description: 'Dari Google Maps > Bagikan > Sematkan peta: salin isi src="..." dari iframe. Link pendek maps.app.goo.gl tidak bisa dipakai di sini.',
            }),
            defineField({name: 'latitude', title: 'Latitude', type: 'number'}),
            defineField({name: 'longitude', title: 'Longitude', type: 'number'}),
            defineField({
              name: 'openingHours',
              title: 'Opening Hours',
              type: 'array',
              description: 'Satu baris per rentang jam. Hari yang tidak dicantumkan dianggap tutup.',
              of: [
                defineField({
                  name: 'hours',
                  title: 'Hours',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'days',
                      title: 'Days',
                      type: 'array',
                      of: [{type: 'string'}],
                      options: {
                        list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                      },
                    }),
                    defineField({name: 'opens', title: 'Opens (HH:mm)', type: 'string', initialValue: '08:00'}),
                    defineField({name: 'closes', title: 'Closes (HH:mm)', type: 'string', initialValue: '17:00'}),
                  ],
                  preview: {
                    select: {days: 'days', opens: 'opens', closes: 'closes'},
                    prepare: ({days, opens, closes}) => ({title: `${(days || []).join(', ')}`, subtitle: `${opens} - ${closes}`}),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'city', subtitle: 'name'},
          },
        }),
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
      description: 'WhatsApp number with country code (e.g., +6289684073110)',
    }),
    defineField({
      name: 'contactSalesUrl',
      title: 'Tujuan "Hubungi Sales"',
      type: 'url',
      group: 'contact',
      description:
        'Tujuan pilihan "Hubungi Sales" di semua tombol Hubungi Kami. Kosongkan untuk memakai Linktree Fortu. Contoh: link WhatsApp sales. Kode pelacak asal website (utm) ditambahkan otomatis.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'contactPartnershipUrl',
      title: 'Tujuan "Partnership & Kolaborasi"',
      type: 'url',
      group: 'contact',
      description:
        'Tujuan pilihan "Partnership & Kolaborasi". Kosongkan untuk memakai Linktree Fortu. Contoh: mailto:partnership@fortu.co.id tidak didukung, gunakan alamat https.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    // SOCIAL MEDIA
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter / X',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      media: 'logo',
    },
    prepare({title, media}) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Global site configuration',
        media,
      }
    },
  },
})


