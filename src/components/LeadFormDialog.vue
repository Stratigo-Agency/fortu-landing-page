<template>
  <Teleport to="body">
    <Transition name="leadform">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[1110] flex items-end sm:items-center justify-center p-4 sm:p-6"
        @keydown.esc.prevent="close"
        @keydown.tab="trapFocus"
      >
        <div class="absolute inset-0 bg-fortu-dark/70" @click="close"></div>

        <div
          ref="dialogEl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-form-title"
          aria-describedby="lead-form-desc"
          class="leadform-panel relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-fortu-off-white p-6 sm:p-8"
        >
          <button
            type="button"
            class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-fortu-medium hover:text-fortu-dark transition-colors"
            aria-label="Tutup"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div v-if="chatUrl" data-testid="lead-chat-step">
            <h2 id="lead-form-title" class="text-2xl sm:text-3xl font-medium tracking-tight text-fortu-dark pr-10">
              Satu langkah lagi
            </h2>
            <p id="lead-form-desc" class="mt-2 text-fortu-medium">
              Data Anda sudah kami terima, tetapi <span class="text-fortu-dark font-medium">pesan Anda belum terkirim</span>.
              Buka WhatsApp, lalu tekan tombol kirim. Sales kami baru bisa membalas setelah itu.
            </p>
            <a
              ref="chatLinkEl"
              :href="chatUrl"
              :target="coarsePointer ? undefined : '_blank'"
              rel="noopener"
              class="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-fortu-dark text-fortu-off-white h-12 font-medium hover:opacity-90 transition-opacity"
            >
              Buka WhatsApp
            </a>
            <p v-if="inApp" class="mt-4 text-sm text-fortu-dark leading-relaxed">
              Anda membuka halaman ini dari aplikasi lain. Jika WhatsApp tidak terbuka, buka halaman ini di Chrome atau
              Safari (menu titik tiga, lalu Buka di browser), atau salin pesan di bawah dan kirim sendiri.
            </p>
            <div class="mt-4 rounded-xl border border-fortu-light/90 bg-white p-4 text-sm">
              <p v-if="number" class="text-fortu-medium">Nomor sales: <span class="text-fortu-dark font-medium">{{ number }}</span></p>
              <p v-if="message" class="mt-2 text-fortu-dark">{{ message }}</p>
              <button v-if="message" type="button" class="mt-3 underline underline-offset-2 text-fortu-dark" @click="copyMessage">
                {{ copied ? 'Pesan tersalin' : 'Salin pesan' }}
              </button>
            </div>
            <button type="button" class="mt-4 text-sm underline underline-offset-2 text-fortu-medium" @click="closeLeadForm">Tutup</button>
          </div>

          <template v-else>
          <h2 id="lead-form-title" class="text-2xl sm:text-3xl font-medium tracking-tight text-fortu-dark pr-10">
            Chat dengan sales Fortu
          </h2>
          <p id="lead-form-desc" class="mt-2 text-fortu-medium">
            <template v-if="state.productName">Soal <span class="text-fortu-dark font-medium">{{ state.productName }}</span>. </template>
            Isi sebentar, lalu kirim pesan di WhatsApp. Sales kami baru bisa membalas setelah pesan Anda terkirim.
          </p>

          <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
            <div>
              <label for="lead-name" class="block text-sm font-medium text-fortu-dark">Nama</label>
              <input
                id="lead-name"
                ref="nameEl"
                v-model="values.name"
                type="text"
                autocomplete="name"
                maxlength="120"
                placeholder="Nama lengkap"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'lead-name-error' : undefined"
                class="lead-input"
                :class="{ 'lead-input-error': errors.name }"
              />
              <p v-if="errors.name" id="lead-name-error" class="mt-1 text-sm text-red-700">{{ errors.name }}</p>
            </div>

            <div>
              <label for="lead-phone" class="block text-sm font-medium text-fortu-dark">Nomor WhatsApp</label>
              <input
                id="lead-phone"
                ref="phoneEl"
                v-model="values.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                maxlength="40"
                placeholder="0812-3456-7890"
                :aria-invalid="!!errors.phone"
                :aria-describedby="errors.phone ? 'lead-phone-error' : undefined"
                class="lead-input"
                :class="{ 'lead-input-error': errors.phone }"
              />
              <p v-if="errors.phone" id="lead-phone-error" class="mt-1 text-sm text-red-700">{{ errors.phone }}</p>
            </div>

            <div>
              <label for="lead-company" class="block text-sm font-medium text-fortu-dark">
                Instansi / perusahaan <span class="font-normal text-fortu-medium">(opsional)</span>
              </label>
              <input
                id="lead-company"
                v-model="values.company"
                type="text"
                autocomplete="organization"
                maxlength="200"
                placeholder="Contoh: SMA Negeri 1 Jakarta"
                class="lead-input"
              />
            </div>

            <fieldset>
              <legend class="block text-sm font-medium text-fortu-dark">
                Kebutuhan <span class="font-normal text-fortu-medium">(opsional)</span>
              </legend>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="opt in INTERESTS" :key="opt.value" class="lead-chip" :class="{ 'lead-chip-on': values.interest === opt.value }">
                  <input v-model="values.interest" type="radio" name="lead-interest" :value="opt.value" class="sr-only" />
                  {{ opt.label }}
                </label>
              </div>
            </fieldset>

            <!-- honeypot: people never see or reach this field -->
            <div class="lead-hp" aria-hidden="true">
              <label for="lead-website">Website</label>
              <input id="lead-website" v-model="values.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full flex items-center justify-center gap-2 rounded-full bg-fortu-dark text-fortu-off-white h-12 font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
              </svg>
              {{ submitting ? 'Menyimpan…' : 'Lanjut' }}
            </button>

            <p class="text-xs text-fortu-medium leading-relaxed">
              Data ini hanya dipakai tim Fortu untuk membalas Anda dan disimpan di perangkat ini agar tidak perlu diisi
              ulang.
              <RouterLink to="/privacy" class="underline underline-offset-2 text-fortu-dark" @click="close">Kebijakan privasi</RouterLink>
              <template v-if="hadSaved">
                ·
                <button type="button" class="underline underline-offset-2 text-fortu-dark" @click="clearSaved">Hapus data tersimpan</button>
              </template>
            </p>
          </form>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLeadForm } from '@/composables/useLeadForm'
import { useAnalytics } from '@/composables/useAnalytics'
import {
  INTERESTS,
  chatMessage,
  chatNumber,
  isInAppBrowser,
  type LeadFormErrors,
  type LeadFormValues,
  forgetContact,
  leadRequest,
  newSubmissionId,
  rememberContact,
  savedContact,
  submitLead,
  validateLeadForm,
} from '@/utils/leadForm'

const route = useRoute()
const { state, closeLeadForm } = useLeadForm()
const { trackEvent, trackPixel } = useAnalytics()

const dialogEl = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLInputElement | null>(null)
const phoneEl = ref<HTMLInputElement | null>(null)
const values = reactive<LeadFormValues>({ name: '', phone: '', company: '', interest: '', website: '' })
const errors = ref<LeadFormErrors>({})
const submitting = ref(false)
const hadSaved = ref(false)
const chatUrl = ref('')
const chatLinkEl = ref<HTMLAnchorElement | null>(null)
const copied = ref(false)
const message = ref('')
const number = ref('')
const inApp = typeof navigator !== 'undefined' && isInAppBrowser(navigator.userAgent)
const coarsePointer = typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches
let submissionId = ''
let previouslyFocused: HTMLElement | null = null

const close = () => {
  if (!submitting.value) closeLeadForm()
}

const clearSaved = () => {
  forgetContact()
  Object.assign(values, { name: '', phone: '', company: '', interest: '' })
  hadSaved.value = false
  nameEl.value?.focus()
}

async function submit() {
  if (submitting.value) return
  errors.value = validateLeadForm(values)
  if (errors.value.name) return nameEl.value?.focus()
  if (errors.value.phone) return phoneEl.value?.focus()

  submitting.value = true
  const body = leadRequest(state.href, values, submissionId, window.location.href)
  const result = await submitLead(state.href, body)

  if (!result.ok && result.phoneRejected) {
    submitting.value = false
    errors.value = { phone: 'Nomor ini tidak bisa dipakai. Pakai nomor HP Indonesia, contoh 0812-3456-7890.' }
    await nextTick()
    phoneEl.value?.focus()
    return
  }

  rememberContact(values)
  const line = body.line || 'unknown'
  const common = {
    button_location: state.source,
    page_path: route.path,
    whatsapp_line: line,
    ...(state.productName ? { product_name: state.productName } : {}),
  }
  trackEvent('go_to_whatsapp', { ...common, whatsapp_number: `team:${line}`, link_type: 'crm_lead_form' })
  // GA4 recommended lead event (Key event): now one per filled form, with whether the CRM saved it
  trackEvent('generate_lead', {
    method: 'whatsapp',
    lead_source: state.source,
    page_path: route.path,
    whatsapp_line: line,
    lead_recorded: result.ok ? 'yes' : 'no',
    ...(values.interest ? { product_interest: values.interest } : {}),
    ...(state.productName ? { product_name: state.productName } : {}),
  })
  trackPixel('Lead', { content_name: state.productName || state.source })
  trackPixel('Contact', { content_name: state.productName || state.source })

  const url = result.ok ? result.url : result.fallbackUrl
  // The chat is not opened for them: a redirect that fails (Instagram's browser, a blocked tab) would leave a lead in
  // the CRM with no message. They tap the button, which always counts as their own action.
  chatUrl.value = url
  message.value = chatMessage(url)
  number.value = chatNumber(url)
  submitting.value = false
  await nextTick()
  chatLinkEl.value?.focus()
}

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
  } catch {
    // clipboard blocked: the text stays on screen to select by hand
  }
}

const trapFocus = (e: KeyboardEvent) => {
  const items = Array.from(
    dialogEl.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"])') || [],
  ).filter((el) => !el.closest('.lead-hp'))
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => state.open,
  async (open) => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) {
      previouslyFocused?.focus?.()
      return
    }
    previouslyFocused = document.activeElement as HTMLElement | null
    submissionId = newSubmissionId() // one per opening: a double submit is one lead in the CRM
    errors.value = {}
    chatUrl.value = ''
    copied.value = false
    const saved = savedContact()
    hadSaved.value = !!(saved.name || saved.phone)
    Object.assign(values, { name: '', phone: '', company: '', interest: '', website: '' }, saved)
    await nextTick()
    ;(values.name && values.phone ? dialogEl.value?.querySelector<HTMLElement>('button[type="submit"]') : nameEl.value)?.focus()
  },
)

// a fixed field loses its red message as soon as it is changed
watch(() => values.name, () => delete errors.value.name)
watch(() => values.phone, () => delete errors.value.phone)

watch(() => route.fullPath, () => closeLeadForm())

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.lead-input {
  margin-top: 0.375rem;
  width: 100%;
  height: 3rem;
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--fortu-light) / 0.9);
  background: #fff;
  padding: 0 1rem;
  font-size: 1rem;
  color: rgb(var(--fortu-dark));
  transition: border-color 0.15s ease;
}
.lead-input::placeholder {
  color: rgb(var(--fortu-medium) / 0.7);
}
.lead-input:focus {
  outline: none;
  border-color: rgb(var(--fortu-dark));
  box-shadow: 0 0 0 3px rgb(var(--fortu-dark) / 0.12);
}
.lead-input-error {
  border-color: #b91c1c;
}
.lead-chip {
  cursor: pointer;
  border-radius: 9999px;
  border: 1px solid rgb(var(--fortu-light) / 0.9);
  background: #fff;
  padding: 0.5rem 0.9rem;
  font-size: 0.875rem;
  color: rgb(var(--fortu-dark));
  transition: all 0.15s ease;
}
.lead-chip:hover {
  border-color: rgb(var(--fortu-dark));
}
.lead-chip:focus-within {
  outline: 2px solid rgb(var(--fortu-dark));
  outline-offset: 2px;
}
.lead-chip-on {
  background: rgb(var(--fortu-dark));
  border-color: rgb(var(--fortu-dark));
  color: rgb(var(--fortu-off-white));
}
.lead-hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.leadform-enter-active,
.leadform-leave-active {
  transition: opacity 0.2s ease;
}
.leadform-enter-active .leadform-panel,
.leadform-leave-active .leadform-panel {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.leadform-enter-from,
.leadform-leave-to {
  opacity: 0;
}
.leadform-enter-from .leadform-panel,
.leadform-leave-to .leadform-panel {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .leadform-enter-active,
  .leadform-leave-active,
  .leadform-enter-active .leadform-panel,
  .leadform-leave-active .leadform-panel {
    transition: none;
  }
}
</style>
