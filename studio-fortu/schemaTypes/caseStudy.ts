import {defineField, defineType} from 'sanity'
import {seoFields} from './seoFields'

export default defineType({
  name: 'caseStudy',
  title: 'Portofolio: Studi Kasus Klien',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Klien', default: true},
    {name: 'story', title: 'Cerita proyek'},
    {name: 'media', title: 'Foto'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Tayang (halaman studi kasus aktif)', value: 'published'},
          {title: 'Segera hadir (hanya kartu logo)', value: 'coming_soon'},
        ],
      },
      initialValue: 'coming_soon',
      description: 'Tayang hanya setelah isi studi kasus lengkap dan klien memberi izin memakai nama dan fotonya.',
    }),
    defineField({name: 'clientName', title: 'Nama klien', type: 'string', group: 'basic', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (alamat halaman)',
      type: 'slug',
      group: 'basic',
      options: {source: 'clientName', maxLength: 80},
      description: 'Alamat: /studi-kasus/<slug>',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoKey',
      title: 'Kode logo',
      type: 'string',
      group: 'basic',
      description: 'Nama berkas logo klien di website, mis. san-medical-center, honda, the-westin-jakarta. Jika kosong, kartu menampilkan nama klien.',
    }),
    defineField({name: 'industry', title: 'Industri', type: 'string', group: 'basic', description: 'Mis. Rumah sakit, Otomotif, Perhotelan'}),
    defineField({name: 'projectType', title: 'Jenis proyek', type: 'string', group: 'basic', description: 'Mis. Digital signage di lobi'}),
    defineField({name: 'location', title: 'Lokasi (kota)', type: 'string', group: 'basic'}),
    defineField({
      name: 'productsUsed',
      title: 'Produk Fortu yang dipakai',
      type: 'array',
      group: 'basic',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'order',
      title: 'Urutan di beranda',
      type: 'number',
      group: 'basic',
      description: 'Angka kecil tampil lebih dulu. Studi kasus yang tayang selalu tampil sebelum yang "segera hadir".',
    }),
    defineField({name: 'summary', title: 'Ringkasan (1-2 kalimat)', type: 'text', rows: 3, group: 'story', validation: (Rule) => Rule.max(280)}),
    defineField({name: 'challenge', title: 'Tantangan', type: 'text', rows: 4, group: 'story', description: 'Latar belakang dan kebutuhan klien.'}),
    defineField({name: 'solution', title: 'Solusi Fortu', type: 'text', rows: 4, group: 'story'}),
    defineField({name: 'result', title: 'Hasil', type: 'text', rows: 4, group: 'story', description: 'Tulis hanya hasil yang benar dan boleh dipublikasikan.'}),
    defineField({
      name: 'coverImage',
      title: 'Foto utama',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Muncul saat kartu di-hover dan di bagian atas halaman studi kasus.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required().warning('Isi alt text: jelaskan apa yang terlihat di foto.'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri foto proyek',
      type: 'array',
      group: 'media',
      of: [
        defineField({
          name: 'photo',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required().warning('Isi alt text.')}),
            defineField({name: 'caption', type: 'string', title: 'Keterangan'}),
          ],
        }),
      ],
    }),
    ...seoFields(),
  ],
  orderings: [{title: 'Urutan', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'clientName', status: 'status', media: 'coverImage', industry: 'industry'},
    prepare: ({title, status, media, industry}) => ({
      title,
      subtitle: `${status === 'published' ? 'Tayang' : 'Segera hadir'}${industry ? ' · ' + industry : ''}`,
      media,
    }),
  },
})
