import { computed, onMounted, ref } from 'vue'
import { fetchSanity } from '@/sanity/fetch'
import { SECTION_COPY_QUERY } from '@/sanity/queries'
import { SECTION_COPY_DEFAULTS, type SectionCopy, type SectionCopyKey } from '@/config/sectionCopy'

/** Section headings from Sanity, with the defaults filling any empty field. The request is shared by every section. */
export function useSectionCopy() {
  const raw = ref<Partial<Record<SectionCopyKey, string | null>> | null>(null)

  onMounted(async () => {
    try {
      raw.value = await fetchSanity(SECTION_COPY_QUERY)
    } catch {
      /* defaults stay */
    }
  })

  const copy = computed<SectionCopy>(() => {
    const out = { ...SECTION_COPY_DEFAULTS } as SectionCopy
    for (const key of Object.keys(SECTION_COPY_DEFAULTS) as SectionCopyKey[]) {
      const v = raw.value?.[key]
      if (typeof v === 'string' && v.trim()) out[key] = v.trim()
    }
    return out
  })

  return copy
}
