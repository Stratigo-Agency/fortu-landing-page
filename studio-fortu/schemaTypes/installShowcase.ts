import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'installShowcase',
  title: 'Tentang: Showcase Proses Instalasi',
  type: 'document',
  fields: [
    defineField({name: 'isActive', title: 'Tampilkan', type: 'boolean', initialValue: true}),
    defineField({
      name: 'eyebrow',
      title: 'Label kecil',
      type: 'string',
      description: 'Contoh: Proses kerja',
    }),
    defineField({
      name: 'heading',
      title: 'Judul',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', title: 'Deskripsi', type: 'text', rows: 3}),
    defineField({
      name: 'steps',
      title: 'Tahap proses (foto)',
      type: 'array',
      description:
        'Urutkan sesuai alur: survei, persiapan, perakitan, pemasangan, hasil akhir. Foto dipangkas otomatis 4:5, jadi pilih foto yang subjeknya di tengah.',
      validation: (Rule) => Rule.max(6),
      of: [
        defineField({
          name: 'step',
          title: 'Tahap',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Nama tahap', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'caption', title: 'Keterangan singkat', type: 'text', rows: 2}),
            defineField({
              name: 'image',
              title: 'Foto',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                  description: 'Jelaskan apa yang terlihat (siapa melakukan apa, di mana).',
                  validation: (Rule) => Rule.required().warning('Isi alt text agar foto dikenali Google.'),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'caption', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'demoVideo',
      title: 'Video demo (opsional)',
      type: 'object',
      description: 'Klip singkat tanpa suara (maksimal sekitar 30 detik, di bawah 5 MB).',
      fields: [
        defineField({name: 'title', title: 'Judul', type: 'string'}),
        defineField({name: 'caption', title: 'Keterangan', type: 'text', rows: 2}),
        defineField({name: 'video', title: 'File video (mp4)', type: 'file', options: {accept: 'video/mp4'}}),
        defineField({
          name: 'poster',
          title: 'Gambar sampul (poster)',
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.required().warning('Isi alt text agar video dikenali Google.'),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {select: {title: 'heading', subtitle: 'eyebrow'}},
})
