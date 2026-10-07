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
  slideImage: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
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
  status?: 'active' | 'draft' | 'archived'
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
    slideImage {
      asset-> {
        _id,
        url
      }
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
  pageName: 'products' | 'about' | 'contact' | 'services' | 'privacy' | 'blog'
  title: string
  subtitle?: string
  backgroundImage?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
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
      }
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
  compareImage?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
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
        }
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
  backgroundImage?: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
  }
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
      backgroundImage {
        asset-> {
          _id,
          url
        }
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
  updatedAt?: string
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
