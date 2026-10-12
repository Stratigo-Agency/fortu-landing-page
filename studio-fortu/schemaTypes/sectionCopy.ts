import {defineField, defineType} from 'sanity'

const text = (name: string, title: string, description: string, rows?: number) =>
  defineField({
    name,
    title,
    type: rows ? 'text' : 'string',
    rows,
    description: `${description} Kosongkan untuk memakai teks bawaan.`,
  })

export default defineType({
  name: 'sectionCopy',
  title: 'Teks Judul Section',
  type: 'document',
  groups: [
    {name: 'home', title: 'Beranda', default: true},
    {name: 'blog', title: 'Blog'},
    {name: 'other', title: 'Lainnya'},
  ],
  fields: [
    // Beranda: logo klien
    {...text('clientsEyebrow', 'Logo klien: label kecil', 'Teks kecil di atas judul. Bawaan: "Klien kami".'), group: 'home'},
    {...text('clientsHeading', 'Logo klien: judul', 'Bawaan: "Dipercaya oleh institusi dan perusahaan di Indonesia".'), group: 'home'},
    // Beranda: portofolio / studi kasus
    {...text('portfolioEyebrow', 'Portofolio: label kecil', 'Bawaan: "Portofolio".'), group: 'home'},
    {...text('portfolioHeading', 'Portofolio: judul', 'Bawaan: "Kreativitas tanpa Batas".'), group: 'home'},
    {...text('portfolioDescription', 'Portofolio: kalimat pengantar', 'Bawaan: "Sebagian klien dan proyek Fortu Digital. Pilih klien untuk membaca studi kasusnya."', 2), group: 'home'},
    {...text('portfolioAllLink', 'Portofolio: teks tautan semua studi kasus', 'Bawaan: "Lihat semua studi kasus".'), group: 'home'},
    // Beranda: artikel
    {...text('articlesEyebrow', 'Artikel: label kecil', 'Bawaan: "Blog".'), group: 'home'},
    {...text('articlesHeading', 'Artikel: judul', 'Bawaan: "Artikel & Berita".'), group: 'home'},
    {...text('articlesAllLink', 'Artikel: teks tautan semua artikel', 'Bawaan: "Lihat semua artikel".'), group: 'home'},
    // Blog
    {...text('blogFilterAll', 'Blog: tombol filter semua', 'Bawaan: "Semua".'), group: 'blog'},
    {...text('blogFilterOwn', 'Blog: tombol filter artikel Fortu', 'Bawaan: "Artikel Fortu".'), group: 'blog'},
    {...text('blogFilterMedia', 'Blog: tombol filter liputan media', 'Bawaan: "Liputan Media".'), group: 'blog'},
    // Lainnya
    {...text('caseStudyMoreHeading', 'Studi kasus: judul daftar studi kasus lain', 'Bawaan: "Jelajahi studi kasus lainnya".'), group: 'other'},
    {...text('connectedDevicesLabel', 'Alur Marien: label "Perangkat Terhubung"', 'Bawaan: "Perangkat Terhubung".'), group: 'other'},
  ],
  preview: {prepare: () => ({title: 'Teks Judul Section'})},
})
