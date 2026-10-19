import { reactive, readonly } from 'vue'

interface ChooserState {
  open: boolean
  /** where the button lives (floating_button, cta_section, footer, ...) */
  source: string
  /** product slug when opened from a product page; goes into utm_campaign */
  campaign?: string
  productName?: string
}

const state = reactive<ChooserState>({ open: false, source: 'unknown' })

/** Opens the "Hubungi Sales / Partnership & Kolaborasi" dialog from any button. */
export function useContactChooser() {
  const openChooser = (source: string, opts: { campaign?: string; productName?: string } = {}) => {
    state.source = source
    state.campaign = opts.campaign
    state.productName = opts.productName
    state.open = true
  }
  const closeChooser = () => {
    state.open = false
  }
  return { state: readonly(state), openChooser, closeChooser }
}
