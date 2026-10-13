<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount, useId } from 'vue'

/**
 * Fortu's own dropdown (replaces the browser's native <select>, whose list cannot be styled).
 * Button + listbox with full keyboard support: Enter/Space/Arrows open it, Arrows/Home/End move,
 * Enter/Space pick, Escape/Tab close. Rows are 52px tall so they are easy to hit on a phone.
 */
export interface SelectOption {
  value: number | string
  label: string
  hint?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: number | string
    options: SelectOption[]
    label: string
    /** Background the dropdown sits on: 'dark' = light-on-dark control, 'light' = dark-on-white */
    tone?: 'dark' | 'light'
  }>(),
  { tone: 'dark' },
)
const emit = defineEmits<{ 'update:modelValue': [value: number | string] }>()

const id = useId()
const root = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)
const active = ref(0)

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue))
const selected = computed(() => props.options[selectedIndex.value])

const enabled = (i: number) => !!props.options[i] && !props.options[i].disabled
const step = (from: number, dir: 1 | -1) => {
  for (let i = from + dir; i >= 0 && i < props.options.length; i += dir) if (enabled(i)) return i
  return from
}
const edge = (dir: 1 | -1) => step(dir === 1 ? -1 : props.options.length, dir)

const scrollActive = () =>
  nextTick(() => (list.value?.children[active.value] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' }))

const onOutside = (e: Event) => {
  if (!root.value?.contains(e.target as Node)) close()
}
const openList = () => {
  if (open.value) return
  open.value = true
  active.value = enabled(selectedIndex.value) ? selectedIndex.value : edge(1)
  document.addEventListener('pointerdown', onOutside)
  scrollActive()
}
function close() {
  open.value = false
  document.removeEventListener('pointerdown', onOutside)
}
const choose = (i: number) => {
  if (!enabled(i)) return
  emit('update:modelValue', props.options[i].value)
  close()
  root.value?.querySelector('button')?.focus()
}

const onKey = (e: KeyboardEvent) => {
  const k = e.key
  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) {
      e.preventDefault()
      openList()
    }
    return
  }
  if (k === 'ArrowDown') active.value = step(active.value, 1)
  else if (k === 'ArrowUp') active.value = step(active.value, -1)
  else if (k === 'Home') active.value = edge(1)
  else if (k === 'End') active.value = edge(-1)
  else if (k === 'Enter' || k === ' ') choose(active.value)
  else if (k === 'Escape') close()
  else if (k === 'Tab') return close()
  else return
  e.preventDefault()
  scrollActive()
}

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="fortu-select" :class="`is-${tone}`">
    <button
      type="button"
      class="fs-trigger"
      :class="{ 'is-open': open }"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="`${id}-list`"
      :aria-label="label"
      :aria-activedescendant="open ? `${id}-opt-${active}` : undefined"
      @click="open ? close() : openList()"
      @keydown="onKey"
    >
      <span class="truncate">{{ selected?.label }}<small v-if="selected?.hint" class="fs-hint">{{ selected.hint }}</small></span>
      <svg class="fs-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </button>

    <Transition name="fs-pop">
      <ul v-if="open" :id="`${id}-list`" ref="list" role="listbox" :aria-label="label" class="fs-list">
        <li
          v-for="(o, i) in options"
          :id="`${id}-opt-${i}`"
          :key="o.value"
          role="option"
          :aria-selected="o.value === modelValue"
          :aria-disabled="o.disabled || undefined"
          class="fs-option"
          :class="{ 'is-active': i === active, 'is-selected': o.value === modelValue, 'is-disabled': o.disabled }"
          @pointerenter="enabled(i) && (active = i)"
          @click="choose(i)"
        >
          <span class="truncate">{{ o.label }}<small v-if="o.hint" class="fs-hint">{{ o.hint }}</small></span>
          <svg v-if="o.value === modelValue" class="fs-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.fortu-select {
  position: relative;
  --fs-bg: rgb(var(--fortu-off-white) / 0.07);
  --fs-border: rgb(var(--fortu-light) / 0.3);
  --fs-text: rgb(var(--fortu-off-white));
  --fs-muted: rgb(var(--fortu-light));
  --fs-panel: rgb(var(--fortu-dark-raised));
  --fs-hover: rgb(var(--fortu-off-white) / 0.1);
  --fs-ring: rgb(var(--fortu-off-white));
}
.fortu-select.is-light {
  --fs-bg: #fff;
  --fs-border: rgb(var(--fortu-dark) / 0.18);
  --fs-text: rgb(var(--fortu-dark));
  --fs-muted: rgb(var(--fortu-medium));
  --fs-panel: #fff;
  --fs-hover: rgb(var(--fortu-dark) / 0.06);
  --fs-ring: rgb(var(--fortu-dark));
}

.fs-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 9999px;
  border: 1px solid var(--fs-border);
  background: var(--fs-bg);
  color: var(--fs-text);
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}
.fs-trigger:hover,
.fs-trigger.is-open {
  border-color: var(--fs-ring);
}
.fs-trigger:focus-visible {
  outline: 2px solid var(--fs-ring);
  outline-offset: 2px;
}
.fs-chevron {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: none;
  stroke: var(--fs-muted);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
}
.is-open .fs-chevron {
  transform: rotate(180deg);
}

.fs-list {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 24px;
  border: 1px solid var(--fs-border);
  background: var(--fs-panel);
  box-shadow: 0 18px 40px -12px rgb(0 0 0 / 0.45);
}
.fs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 9999px;
  color: var(--fs-text);
  font-size: 1rem;
  cursor: pointer;
}
.fs-option.is-active {
  background: var(--fs-hover);
}
.fs-option.is-selected {
  font-weight: 600;
}
.fs-option.is-disabled {
  color: var(--fs-muted);
  opacity: 0.45;
  cursor: not-allowed;
}
.fs-hint {
  margin-left: 8px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fs-muted);
}
.fs-check {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fs-pop-enter-active,
.fs-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fs-pop-enter-from,
.fs-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .fs-pop-enter-active,
  .fs-pop-leave-active,
  .fs-chevron {
    transition: none;
  }
}
</style>
