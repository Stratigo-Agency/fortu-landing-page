<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  variant?: 'primary' | 'secondary' | 'light' | 'outline' | 'inverted' | 'green'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
  to?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const componentType = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

// Only pass the attributes that apply: an explicit `href: undefined` on a RouterLink
// would override the href it renders itself, leaving links without a real URL.
const linkAttrs = computed(() => {
  if (props.to) return { to: props.to, target: props.target }
  if (props.href) return { href: props.href, target: props.target }
  return { type: props.type }
})

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex cursor-pointer items-center justify-center tracking-wide rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-fortu-dark text-fortu-off-white hover:bg-fortu-off-white hover:text-fortu-dark border-2 border-fortu-dark hover:border-fortu-dark focus:ring-fortu-dark',
    secondary: 'bg-fortu-off-white text-fortu-dark hover:text-fortu-off-white hover:bg-transparent border-2 border-fortu-off-white focus:ring-fortu-medium',
    light: 'bg-fortu-light text-fortu-dark hover:bg-opacity-80 focus:ring-fortu-light',
    outline: 'bg-transparent text-fortu-off-white hover:text-fortu-dark hover:bg-fortu-off-white border-2 border-fortu-off-white focus:ring-fortu-medium',
    inverted: 'bg-fortu-off-white text-fortu-dark hover:bg-fortu-light focus:ring-fortu-light',
    green: 'bg-green-500 text-white hover:bg-green-600 border-2 border-green-500 hover:border-green-600 focus:ring-green-500',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
  ].join(' ')
})
</script>

<template>
  <component
    :is="componentType"
    :class="buttonClasses"
    v-bind="linkAttrs"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

