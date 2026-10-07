<script setup lang="ts">
import { computed } from 'vue'
import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import type {
  PortableTextContent,
  PortableTextBlock,
  PortableTextImage,
  PortableTextSpan,
} from '@/sanity/queries'

const props = defineProps<{
  blocks: PortableTextContent[]
}>()

const isBlock = (item: PortableTextContent): item is PortableTextBlock =>
  item._type === 'block'

const isImage = (item: PortableTextContent): item is PortableTextImage =>
  item._type === 'image'

interface ListGroup {
  kind: 'list'
  listItem: string
  items: PortableTextBlock[]
}

interface NodeGroup {
  kind: 'node'
  node: PortableTextContent
}

type Group = ListGroup | NodeGroup

const groups = computed<Group[]>(() => {
  const result: Group[] = []
  for (const item of props.blocks) {
    if (isBlock(item) && item.listItem) {
      const last = result[result.length - 1]
      if (last && last.kind === 'list' && last.listItem === item.listItem) {
        last.items.push(item)
        continue
      }
      result.push({ kind: 'list', listItem: item.listItem, items: [item] })
    } else {
      result.push({ kind: 'node', node: item })
    }
  }
  return result
})

/** Natural size parsed from the Sanity asset id, so the browser can reserve space (no layout shift). */
const imageSize = (image: PortableTextImage): [number, number] | undefined => {
  const id = (image as { asset?: { _id?: string; _ref?: string } }).asset
  const m = (id?._id || id?._ref || '').match(/-(\d+)x(\d+)-[a-z]+$/i)
  return m ? [Number(m[1]), Number(m[2])] : undefined
}

const imageUrl = (image: PortableTextImage) => {
  if (!image.asset) return ''
  try {
    const builder = urlFor(image).width(1200).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return image.asset.url || ''
  }
}

const renderSpan = (block: PortableTextBlock, span: PortableTextSpan) => {
  const marks = span.marks || []
  let openTags = ''
  let closeTags = ''
  const linkMark = marks.find((m) =>
    block.markDefs?.some((def) => def._key === m && def._type === 'link'),
  )
  for (const mark of marks) {
    if (mark === 'strong') {
      openTags += '<strong>'
      closeTags = '</strong>' + closeTags
    } else if (mark === 'em') {
      openTags += '<em>'
      closeTags = '</em>' + closeTags
    } else if (mark === 'underline') {
      openTags += '<u>'
      closeTags = '</u>' + closeTags
    }
  }
  const escaped = escapeHtml(span.text)
  let inner = openTags + escaped + closeTags
  if (linkMark) {
    const def = block.markDefs?.find((d) => d._key === linkMark)
    if (def?.href) {
      const target = def.blank ? ' target="_blank" rel="noopener noreferrer"' : ''
      inner = `<a href="${escapeAttr(def.href)}"${target} class="text-fortu-dark underline underline-offset-4 hover:text-fortu-medium transition-colors">${inner}</a>`
    }
  }
  return inner
}

const renderBlockChildren = (block: PortableTextBlock) =>
  (block.children || []).map((span) => renderSpan(block, span)).join('')

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const escapeAttr = (str: string) => escapeHtml(str).replace(/"/g, '&quot;')
</script>

<template>
  <div class="portable-text">
    <template v-for="(group, gIdx) in groups" :key="gIdx">
      <!-- Bullet / Number Lists -->
      <ul
        v-if="group.kind === 'list' && group.listItem === 'bullet'"
        class="list-disc pl-6 my-6 space-y-2 text-fortu-dark text-base md:text-lg leading-relaxed"
      >
        <li v-for="(item, iIdx) in group.items" :key="item._key || iIdx" v-html="renderBlockChildren(item)"></li>
      </ul>
      <ol
        v-else-if="group.kind === 'list' && group.listItem === 'number'"
        class="list-decimal pl-6 my-6 space-y-2 text-fortu-dark text-base md:text-lg leading-relaxed"
      >
        <li v-for="(item, iIdx) in group.items" :key="item._key || iIdx" v-html="renderBlockChildren(item)"></li>
      </ol>

      <!-- Image blocks -->
      <figure
        v-else-if="group.kind === 'node' && isImage(group.node)"
        class="my-10"
      >
        <img
          :src="imageUrl(group.node)"
          :alt="group.node.alt || ''"
          :width="imageSize(group.node)?.[0]"
          :height="imageSize(group.node)?.[1]"
          loading="lazy"
          decoding="async"
          class="w-full h-auto rounded-lg"
        />
        <figcaption
          v-if="group.node.caption"
          class="mt-3 text-sm text-fortu-medium text-center"
        >
          {{ group.node.caption }}
        </figcaption>
      </figure>

      <!-- Heading / blockquote / normal blocks -->
      <template v-else-if="group.kind === 'node' && isBlock(group.node)">
        <h2
          v-if="group.node.style === 'h2'"
          class="text-3xl md:text-4xl font-medium text-fortu-dark mt-12 mb-5 tracking-tight"
          v-html="renderBlockChildren(group.node)"
        ></h2>
        <h3
          v-else-if="group.node.style === 'h3'"
          class="text-2xl md:text-3xl font-medium text-fortu-dark mt-10 mb-4 tracking-tight"
          v-html="renderBlockChildren(group.node)"
        ></h3>
        <h4
          v-else-if="group.node.style === 'h4'"
          class="text-xl md:text-2xl font-medium text-fortu-dark mt-8 mb-3 tracking-tight"
          v-html="renderBlockChildren(group.node)"
        ></h4>
        <blockquote
          v-else-if="group.node.style === 'blockquote'"
          class="my-8 border-l-4 border-fortu-dark pl-6 italic text-fortu-medium text-lg md:text-xl leading-relaxed"
          v-html="renderBlockChildren(group.node)"
        ></blockquote>
        <p
          v-else
          class="text-fortu-dark text-base md:text-lg leading-relaxed my-5"
          v-html="renderBlockChildren(group.node)"
        ></p>
      </template>
    </template>
  </div>
</template>
