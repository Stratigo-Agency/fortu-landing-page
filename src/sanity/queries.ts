import { defineQuery } from 'groq'

// Types
export interface Post {
  _id: string
  title: string
  slug: { current: string } | null
}

export interface CTAButton {
  label: string
  link: string
  variant: 'primary' | 'secondary' | 'outline'
}

export interface Hero {
  _id: string
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: SanityImage
  backgroundVideo?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  backgroundVideoMobile?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  backgroundPoster?: SanityImage
  ctaButtons?: CTAButton[]
  alignment?: 'left' | 'center' | 'right'
  isActive?: boolean
}

export interface CMSDemoProduct {
  _key?: string
  product?: {
    _id: string
    name: string
    images?: Array<{
      asset: {
        _ref: string
        _type: string
        url?: string
      }
      alt?: string
    }>
  }
  customProduct?: {
    name: string
    image: {
      asset: {
        _ref: string
        _type: string
        url?: string
      }
      alt?: string
    }
  }
  position: 'top-left' | 'top-right' | 'bottom-center'
}

export interface CMSDemo {
  _id: string
  badge: string
  flowProducts?: string[]
  heading: {
    line1: string
    line2: string
  }
  description: string
  products: CMSDemoProduct[]
  isActive?: boolean
}

export interface ClientLogo {
  _id: string
  name: string
  logo: SanityImage
  url?: string
  order?: number
  isActive?: boolean
}

export interface UseCaseItem {
  _key?: string
  mediaType: 'image' | 'video'
  image?: SanityImage
  video?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  alt?: string
  caption?: string
  size?: 'short' | 'medium' | 'tall'
}

export interface UseCaseSection {
  _id: string
  heading: string
  description: string
  items: UseCaseItem[]
  isActive?: boolean
}

export interface ProductSlideFeature {
  _key?: string
  text: string
  icon?: string
}

export interface ProductSlide {
  _id: string
  name: string
  tagline: string
  comingSoon?: boolean
  slideImage?: SanityImage
  features?: ProductSlideFeature[]
  product?: {
    _id: string
    name: string
    slug?: { current: string }
  }
  order?: number
  isActive?: boolean
}

export interface ProductSpec {
  _key?: string
  icon?: string
  label: string
  value?: string
}

export interface FeatureHighlight {
  _key?: string
  icon?: string
  text: string
}

export interface ProductFeature {
  _key?: string
  eyebrow?: string
  heading: string
  description?: string
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  backgroundColor?: 'dark' | 'light'
  textAlignment?: 'center' | 'left' | 'right'
  highlights?: FeatureHighlight[]
}

export interface SanityImageHotspot {
  x?: number
  y?: number
  height?: number
  width?: number
}

export interface SanityImageCrop {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export interface SanityImage {
  asset: {
    _ref: string
    _type: string
    url?: string
  }
  alt?: string
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
}

export interface ProductVariant {
  _key: string
  name: string
  sku?: string
  colorHex?: string
  image?: SanityImage
  images?: SanityImage[]
  price?: number
  compareAtPrice?: number
  inStock?: boolean
}

export interface Product {
  _id: string
  name: string
  slug: { current: string }
  sku?: string
  description?: string
  heroImage?: SanityImage
  heroVideo?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  images?: SanityImage[]
  price?: number
  currency?: string
  compareAtPrice?: number
  specs?: ProductSpec[]
  features?: ProductFeature[]
  hasVariants?: boolean
  variantType?: 'color' | 'size' | 'material' | 'style' | 'custom'
  variants?: ProductVariant[]
  category?: string
  inStock?: boolean
  featured?: boolean
  status?: 'active' | 'draft' | 'archived' | 'coming_soon'
  seoTitle?: string
  seoDescription?: string
  shareImage?: SanityImage
  noIndex?: boolean
}

// Queries
export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug
  }
`)

export const HERO_QUERY = defineQuery(/* groq */ `
  *[_type == "hero" && isActive == true] | order(_createdAt desc) [0] {
    _id,
    title,
    subtitle,
    description,
    backgroundImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    backgroundVideo {
      asset-> {
        _id,
        url
      }
    },
    backgroundVideoMobile {
      asset-> {
        _id,
        url
      }
    },
    backgroundPoster {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    ctaButtons[] {
      label,
      link,
      variant
    },
    alignment,
    isActive
  }
`)

export const CMS_DEMO_QUERY = defineQuery(/* groq */ `
  *[_type == "cmsDemo" && isActive == true] | order(_createdAt desc) [0] {
    _id,
    badge,
    heading {
      line1,
      line2
    },
    description,
    flowProducts,
    products[] {
      _key,
      position,
      product-> {
        _id,
        name,
        images[] {
          asset-> {
            _id,
            url
          },
          alt
        }
      },
      customProduct {
        name,
        image {
          asset-> {
            _id,
            url
          },
          alt
        }
      }
    },
    isActive
  }
`)

export const CLIENT_LOGOS_QUERY = defineQuery(/* groq */ `
  *[_type == "clientLogo" && isActive == true] | order(order asc) {
    _id,
    name,
    logo {
      asset {
        _ref,
        _type
      },
      hotspot,
      crop,
      alt
    },
    url,
    order,
    isActive
  }
`)

export const USE_CASE_SECTION_QUERY = defineQuery(/* groq */ `
  *[_type == "useCaseSection" && isActive == true] | order(_createdAt desc) [0] {
    _id,
    heading,
    description,
    items[] {
      _key,
      mediaType,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      video {
        asset-> {
          _id,
          url
        }
      },
      alt,
      caption,
      size
    },
    isActive
  }
`)

export const PRODUCT_SLIDES_QUERY = defineQuery(/* groq */ `
  *[_type == "productSlide" && isActive == true] | order(order asc) {
    _id,
    name,
    tagline,
    comingSoon,
    slideImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    features[] {
      _key,
      text,
      icon
    },
    product-> {
      _id,
      name,
      slug
    },
    order,
    isActive
  }
`)

// Products query for catalog (essential fields only)
export const PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && status == "active"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    images[] {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    price,
    currency,
    compareAtPrice,
    hasVariants,
    variantType,
    variants[] {
      _key,
      name,
      colorHex,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      price,
      compareAtPrice,
      inStock
    },
    inStock,
    featured
  }
`)

// Site Settings
export interface SocialMedia {
  twitter?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  youtube?: string
  tiktok?: string
}

export interface SiteSettings {
  _id: string
  companyName: string
  tagline?: string
  logo?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  socialMedia?: SocialMedia
  offices?: Office[]
  contactSalesUrl?: string
  contactPartnershipUrl?: string
}

export interface OfficeHours {
  days?: string[]
  opens?: string
  closes?: string
}

export interface Office {
  _key?: string
  city: string
  name?: string
  address?: string
  phone?: string
  /** 'whatsapp' = a WhatsApp-registered number, 'phone' (default) = a regular call. Not guessable from the number. */
  phoneType?: 'whatsapp' | 'phone'
  mapsUrl?: string
  mapsEmbed?: string
  latitude?: number
  longitude?: number
  openingHours?: OfficeHours[]
}

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    _id,
    companyName,
    tagline,
    logo {
      asset-> {
        _id,
        url
      }
    },
    address,
    phone,
    email,
    whatsapp,
    contactSalesUrl,
    contactPartnershipUrl,
    offices[] {
      _key,
      city,
      name,
      address,
      phone,
      phoneType,
      mapsUrl,
      mapsEmbed,
      latitude,
      longitude,
      openingHours[] { days, opens, closes }
    },
    socialMedia {
      twitter,
      instagram,
      linkedin,
      facebook,
      youtube,
      tiktok
    }
  }
`)

// FAQ
export interface FAQItem {
  _key?: string
  question: string
  answer: string
}

export interface FAQ {
  _id: string
  heading: string
  subheading?: string
  items: FAQItem[]
  order?: number
  isActive?: boolean
}

export const FAQ_QUERY = defineQuery(/* groq */ `
  *[_type == "faq" && isActive == true] | order(order asc) [0] {
    _id,
    heading,
    subheading,
    items[] {
      _key,
      question,
      answer
    },
    order,
    isActive
  }
`)

// Page Hero
export interface PageHero {
  _id: string
  pageName: 'products' | 'about' | 'contact' | 'services' | 'privacy' | 'blog' | 'case-studies'
  title: string
  subtitle?: string
  backgroundImage?: SanityImage
  backgroundVideo?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
  overlayOpacity?: number
  alignment?: 'left' | 'center' | 'right'
  isActive?: boolean
}

export const PAGE_HERO_QUERY = defineQuery(/* groq */ `
  *[_type == "pageHero" && pageName == $pageName && isActive == true][0] {
    _id,
    pageName,
    title,
    subtitle,
    backgroundImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    backgroundVideo {
      asset-> {
        _id,
        url
      }
    },
    overlayOpacity,
    alignment,
    isActive
  }
`)

// Product Compare - specs now come from product
export interface ProductCompareItem {
  _key?: string
  product: Product  // Full product with specs
  ctaLabel?: string
  compareImage?: SanityImage
}

export interface ProductCompare {
  _id: string
  heading?: string
  subheading?: string
  products: ProductCompareItem[]
  backgroundColor?: 'dark' | 'light'
  isActive?: boolean
}

export const PRODUCT_COMPARE_QUERY = defineQuery(/* groq */ `
  *[_type == "productCompare" && isActive == true][0] {
    _id,
    heading,
    subheading,
    products[] {
      _key,
      product-> {
        _id,
        name,
        slug,
        status,
        description,
        images[] {
          asset-> {
            _id,
            url
          },
          alt
        },
        price,
        currency,
        compareAtPrice,
        specs[] {
          _key,
          icon,
          label,
          value
        }
      },
      ctaLabel,
      compareImage {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop
      }
    },
    backgroundColor,
    isActive
  }
`)

// Single Product by Slug
export const PRODUCT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && slug.current == $slug && status == "active"][0] {
    _id,
    name,
    slug,
    seoTitle,
    seoDescription,
    shareImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop
    },
    noIndex,
    sku,
    description,
    heroImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    heroVideo {
      asset-> {
        _id,
        url
      }
    },
    images[] {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    price,
    currency,
    compareAtPrice,
    specs[] {
      _key,
      icon,
      label,
      value
    },
    features[] {
      _key,
      eyebrow,
      heading,
      description,
      mediaType,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      video {
        asset-> {
          _id,
          url
        }
      },
      backgroundColor,
      textAlignment,
      highlights[] {
        _key,
        icon,
        text
      }
    },
    hasVariants,
    variantType,
    variants[] {
      _key,
      name,
      sku,
      colorHex,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      images[] {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      price,
      compareAtPrice,
      inStock
    },
    category,
    inStock,
    featured
  }
`)

// Services
export interface ServiceItem {
  _key?: string
  title: string
  description: string
  icon?: string
  illustration?: string
  backgroundImage?: SanityImage
  darkOverlay?: boolean
}

export interface ServiceSection {
  _id: string
  heading: string
  subheading?: string
  services: ServiceItem[]
  order?: number
  isActive?: boolean
}

export const SERVICE_SECTION_QUERY = defineQuery(/* groq */ `
  *[_type == "service" && isActive == true] | order(order asc) [0] {
    _id,
    heading,
    subheading,
    services[] {
      _key,
      title,
      description,
      icon,
      illustration,
      backgroundImage {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop
      },
      darkOverlay
    },
    order,
    isActive
  }
`)

// About Page
export interface AboutPage {
  _id: string
  description: string
  vision: {
    title?: string
    heading: string
    description: string
  }
  mission: {
    title?: string
    heading: string
    description: string
  }
  isActive?: boolean
}

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "aboutPage" && isActive == true][0] {
    _id,
    description,
    vision {
      title,
      heading,
      description
    },
    mission {
      title,
      heading,
      description
    },
    isActive
  }
`)

// Blog
export interface BlogPostListItem {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  author?: string
  publishedAt: string
  category?: string
  tags?: string[]
  coverImage?: SanityImage
  featured?: boolean
  isMediaCoverage?: boolean
  sourceName?: string
  sourcePublishedAt?: string
}

export interface PortableTextSpan {
  _key: string
  _type: 'span'
  text: string
  marks?: string[]
}

export interface PortableTextMarkDef {
  _key: string
  _type: string
  href?: string
  blank?: boolean
}

export interface PortableTextBlock {
  _key: string
  _type: 'block'
  style?: string
  listItem?: string
  level?: number
  children: PortableTextSpan[]
  markDefs?: PortableTextMarkDef[]
}

export interface PortableTextImage {
  _key: string
  _type: 'image'
  asset: {
    _ref: string
    _type: string
    url?: string
  }
  alt?: string
  caption?: string
}

export type PortableTextContent = PortableTextBlock | PortableTextImage

export interface BlogPost extends BlogPostListItem {
  body: PortableTextContent[]
  seoTitle?: string
  seoDescription?: string
  shareImage?: SanityImage
  noIndex?: boolean
  updatedAt?: string
  sourceUrl?: string
  sourceAuthor?: string
}

export const BLOG_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && isActive == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    author,
    publishedAt,
    category,
    tags,
    coverImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    isMediaCoverage,
    sourceName,
    sourcePublishedAt,
    featured
  }
`)

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    slug,
    excerpt,
    author,
    publishedAt,
    category,
    tags,
    coverImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    isMediaCoverage,
    sourceName,
    sourcePublishedAt,
    sourceUrl,
    sourceAuthor,
    featured,
    body[] {
      ...,
      _type == "image" => {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      }
    },
    seoTitle,
    seoDescription,
    shareImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop
    },
    noIndex,
    "updatedAt": _updatedAt
  }
`)

export const RELATED_BLOG_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && isActive == true && _id != $currentId] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    author,
    publishedAt,
    category,
    isMediaCoverage,
    sourceName,
    sourcePublishedAt,
    coverImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    }
  }
`)

// Per-page SEO overrides (document type "pageSeo", one per page key)
export interface PageSeo {
  page: string
  seoTitle?: string
  seoDescription?: string
  shareImage?: SanityImage
  noIndex?: boolean
}

export const PAGE_SEO_QUERY = defineQuery(/* groq */ `
  *[_type == "pageSeo" && page == $page][0] {
    page,
    seoTitle,
    seoDescription,
    shareImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop
    },
    noIndex
  }
`)

// Header menu: featured products, shown directly in the navigation
export interface NavProduct {
  _id: string
  name: string
  slug: string
  status?: string
  menuOrder?: number
}

export const NAV_PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && showInMenu == true && status in ["active", "coming_soon"]] | order(menuOrder asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    status,
    menuOrder
  }
`)

// About page: installation process showcase
export interface InstallStep {
  _key: string
  title: string
  caption?: string
  image: SanityImage & { alt?: string }
}

export interface InstallShowcase {
  eyebrow?: string
  heading: string
  description?: string
  steps?: InstallStep[]
  demoVideo?: {
    title?: string
    caption?: string
    videoUrl?: string
    poster?: SanityImage & { alt?: string }
  }
}

export const INSTALL_SHOWCASE_QUERY = defineQuery(/* groq */ `
  *[_type == "installShowcase" && isActive != false][0] {
    eyebrow,
    heading,
    description,
    steps[] {
      _key,
      title,
      caption,
      image {
        asset-> { _id, url },
        hotspot,
        crop,
        alt
      }
    },
    demoVideo {
      title,
      caption,
      "videoUrl": video.asset->url,
      poster {
        asset-> { _id, url },
        hotspot,
        crop,
        alt
      }
    }
  }
`)

// Portfolio: client case studies
export interface CaseStudyListItem {
  _id: string
  clientName: string
  slug: { current: string }
  status: 'published' | 'coming_soon'
  logoKey?: string
  industry?: string
  projectType?: string
  location?: string
  productsUsed?: string[]
  summary?: string
  coverImage?: SanityImage & { alt?: string }
}

export interface CaseStudy extends CaseStudyListItem {
  challenge?: string
  solution?: string
  result?: string
  gallery?: Array<SanityImage & { alt?: string; caption?: string; _key?: string }>
  seoTitle?: string
  seoDescription?: string
  shareImage?: SanityImage
  noIndex?: boolean
  updatedAt?: string
}

export const CASE_STUDIES_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current)] | order(select(status == "published" => 0, 1) asc, order asc, clientName asc) {
    _id,
    clientName,
    slug,
    status,
    logoKey,
    industry,
    projectType,
    location,
    productsUsed,
    summary,
    coverImage {
      asset-> { _id, url },
      hotspot,
      crop,
      alt
    }
  }
`)

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && slug.current == $slug && status == "published"][0] {
    _id,
    clientName,
    slug,
    status,
    logoKey,
    industry,
    projectType,
    location,
    productsUsed,
    summary,
    challenge,
    solution,
    result,
    coverImage {
      asset-> { _id, url },
      hotspot,
      crop,
      alt
    },
    gallery[] {
      _key,
      asset-> { _id, url },
      hotspot,
      crop,
      alt,
      caption
    },
    seoTitle,
    seoDescription,
    shareImage {
      asset-> { _id, url },
      hotspot,
      crop
    },
    noIndex,
    "updatedAt": _updatedAt
  }
`)
