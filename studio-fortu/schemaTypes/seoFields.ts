import {defineField} from 'sanity'

/** Reusable SEO fields (put them in a field group named `seo`). */
export const seoFields = (opts: {withTitleDescription?: boolean} = {withTitleDescription: true}) => [
  ...(opts.withTitleDescription === false
    ? []
    : [
        defineField({
          name: 'seoTitle',
          title: 'SEO Title',
          type: 'string',
          group: 'seo',
          description:
            'Judul di tab browser dan hasil Google. Maksimal ~60 karakter, sertakan kata kunci utama halaman. Kosongkan untuk memakai judul bawaan.',
          validation: (Rule) =>
            Rule.max(70).warning('Lebih dari ~60 karakter akan terpotong di hasil Google.'),
        }),
        defineField({
          name: 'seoDescription',
          title: 'SEO Description',
          type: 'text',
          group: 'seo',
          rows: 3,
          description:
            'Deskripsi singkat di bawah judul di Google. Sekitar 120-155 karakter, ajak pembaca untuk klik. Hindari kalimat hard-selling.',
          validation: (Rule) =>
            Rule.max(160).warning('Lebih dari ~155 karakter akan terpotong di hasil Google.'),
        }),
      ]),
  defineField({
    name: 'shareImage',
    title: 'Share Image',
    type: 'image',
    group: 'seo',
    options: {hotspot: true},
    description:
      'Gambar preview saat link dibagikan di WhatsApp, LinkedIn, dan media sosial. Ukuran ideal 1200x630 px. Kosongkan untuk memakai gambar bawaan.',
  }),
  defineField({
    name: 'noIndex',
    title: 'Sembunyikan dari Google (noindex)',
    type: 'boolean',
    group: 'seo',
    description:
      'Aktifkan hanya jika halaman ini TIDAK boleh muncul di Google. Halaman ini juga akan dikeluarkan dari sitemap.',
    initialValue: false,
  }),
]
