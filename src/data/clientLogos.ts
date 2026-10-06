/**
 * Client logos shown in the hero marquee (ClientCarousel.vue).
 * Source: client logo sheet from the CTO (6 Oct 2026). Files live in public/clients.
 * `tone` is the background of the logo tile: 'dark' tiles hold white/gold logos.
 */
export interface ClientLogoItem {
  name: string
  file: string
  tone: 'light' | 'dark'
}

const light = (name: string, file: string): ClientLogoItem => ({ name, file, tone: 'light' })
const dark = (name: string, file: string): ClientLogoItem => ({ name, file, tone: 'dark' })

const items: ClientLogoItem[] = [
  light('Otoritas Jasa Keuangan', 'ojk'),
  light('Direktorat Jenderal Pajak', 'djp'),
  light('PLN', 'pln'),
  light('Perhutani', 'perhutani'),
  light('Mabes TNI AL', 'mabes-tni-al'),
  light('CIMB Niaga', 'cimb-niaga'),
  light('Tirta Musi', 'tirta-musi'),
  light('Bank TKI (BPR Tata Karya Indonesia)', 'bank-tki'),
  light('AQUA', 'aqua'),
  light('DENSO', 'denso'),
  light('Honda', 'honda'),
  light('Indomobil', 'indomobil'),
  light('Dunex Logistics Solution', 'dunex'),
  light('Trip Tour', 'trip-tour'),
  light('Goldenbird', 'goldenbird'),
  light('UP PKJ TIM', 'up-pkj-tim'),
  light('Rumah Sehat untuk Jakarta RSUD Tugu Koja', 'rumah-sehat-jakarta'),
  light('Mitra Keluarga', 'mitra-keluarga'),
  light('San Medical Center', 'san-medical-center'),
  light('Brawijaya Hospital Saharjo', 'brawijaya-hospital'),
  light('Pro Mitra Analitika', 'pro-mitra-analitika'),
  light('UNTAR', 'untar'),
  light('SMK Angkasa', 'smk-angkasa'),
  light('Mallesso', 'mallesso'),
  light('Swiss-Belhotel Danum Palangka Raya', 'swiss-belhotel-danum'),
  light('WHSmith', 'whsmith'),
  light('Grand Mercure', 'grand-mercure'),
  light('Gamma Scientific', 'gamma-scientific'),
  dark('The Westin Jakarta', 'the-westin-jakarta'),
  dark('Trinland', 'trinland'),
  dark("Hariom's", 'hariom-s'),
  dark('7.AM | 7.PM', '7am-7pm'),
  dark('Sumak', 'sumak'),
]

export const clientLogos = items.map((item) => ({
  ...item,
  src: `/clients/${item.file}.webp`,
}))
