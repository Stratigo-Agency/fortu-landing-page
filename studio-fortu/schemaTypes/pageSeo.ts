import {defineField, defineType} from 'sanity'
import {seoFields} from './seoFields'

export const PAGE_OPTIONS = [
  {title: 'Beranda', value: 'home'},
  {title: 'Produk (daftar)', value: 'products'},
  {title: 'Tentang', value: 'about'},
  {title: 'Kontak', value: 'contact'},
  {title: 'Blog (daftar)', value: 'blog'},
  {title: 'Studi kasus (daftar)', value: 'case-studies'},
  {title: 'Privacy', value: 'privacy'},
]

export default defineType({
  name: 'pageSeo',
  title: 'SEO: Halaman',
  type: 'document',
  groups: [{name: 'seo', title: 'SEO', default: true}],
  fields: [
    defineField({
      name: 'page',
      title: 'Halaman',
      type: 'string',
      group: 'seo',
      options: {list: PAGE_OPTIONS, layout: 'dropdown'},
      description: 'Satu dokumen per halaman. Produk dan artikel mengisi SEO langsung di dokumennya.',
      validation: (Rule) => Rule.required(),
    }),
    ...seoFields(),
  ],
  preview: {
    select: {page: 'page', title: 'seoTitle', noIndex: 'noIndex'},
    prepare({page, title, noIndex}) {
      const label = PAGE_OPTIONS.find((p) => p.value === page)?.title || page || 'Halaman'
      return {title: label, subtitle: noIndex ? 'noindex' : title || '(judul bawaan)'}
    },
  },
})
