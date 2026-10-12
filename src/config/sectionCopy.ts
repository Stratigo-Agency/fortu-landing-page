/**
 * Section headings and small labels that editors can change in Sanity ("Teks Judul Section").
 * Keys match the field names in `studio-fortu/schemaTypes/sectionCopy.ts`; the values here are the
 * defaults used whenever a field is empty (or Sanity has not answered yet), so the site never shows a blank heading.
 */
export const SECTION_COPY_DEFAULTS = {
  clientsEyebrow: 'Klien kami',
  clientsHeading: 'Dipercaya oleh institusi dan perusahaan di Indonesia',
  portfolioEyebrow: 'Portofolio',
  portfolioHeading: 'Kreativitas tanpa Batas',
  portfolioDescription: 'Sebagian klien dan proyek Fortu Digital. Pilih klien untuk membaca studi kasusnya.',
  portfolioAllLink: 'Lihat semua studi kasus',
  articlesEyebrow: 'Blog',
  articlesHeading: 'Artikel & Berita',
  articlesAllLink: 'Lihat semua artikel',
  blogFilterAll: 'Semua',
  blogFilterOwn: 'Artikel Fortu',
  blogFilterMedia: 'Liputan Media',
  caseStudyMoreHeading: 'Jelajahi studi kasus lainnya',
  connectedDevicesLabel: 'Perangkat Terhubung',
} as const

export type SectionCopyKey = keyof typeof SECTION_COPY_DEFAULTS
export type SectionCopy = Record<SectionCopyKey, string>
