import {defineField, defineType} from 'sanity'
import {seoFields} from './seoFields'

export default defineType({
  name: 'product',
  title: 'Product Catalog',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'media', title: 'Media'},
    {name: 'pricing', title: 'Pricing'},
    {name: 'specs', title: 'Specifications'},
    {name: 'variants', title: 'Variants'},
    {name: 'inventory', title: 'Inventory'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      group: 'basic',
      description: 'Stock Keeping Unit - unique product identifier',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'basic',
      rows: 4,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'media',
      description: 'Large background image for the product hero section',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Jelaskan apa yang terlihat dan sebut nama produk, bukan sekadar "gambar".',
          validation: (Rule) =>
            Rule.required().warning('Isi alt text: jelaskan apa yang terlihat dan sebut nama produk (bukan sekadar "gambar").'),
        },
      ],
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      group: 'media',
      description: 'Background video for the product hero (overrides image)',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      group: 'media',
      description: 'Main product images (used when no variant is selected)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: (Rule) => Rule.required().warning('Isi alt text: jelaskan apa yang terlihat dan sebut nama produk (bukan sekadar "gambar").'),
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Base Price',
      type: 'number',
      group: 'pricing',
      description: 'Default price (can be overridden by variants)',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      group: 'pricing',
      options: {
        list: [
          {title: 'USD ($)', value: 'USD'},
          {title: 'EUR (€)', value: 'EUR'},
          {title: 'IDR (Rp)', value: 'IDR'},
        ],
      },
      initialValue: 'USD',
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare At Price',
      type: 'number',
      group: 'pricing',
      description: 'Original price if this product is on sale',
    }),
    // SPECIFICATIONS
    defineField({
      name: 'specs',
      title: 'Spesifikasi',
      type: 'array',
      group: 'specs',
      description: 'Product specifications for comparison and detail pages',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Display', value: 'display'},
                  {title: 'Chip/Processor', value: 'chip'},
                  {title: 'Camera', value: 'camera'},
                  {title: 'Battery', value: 'battery'},
                  {title: 'Storage', value: 'storage'},
                  {title: 'Connectivity', value: 'connectivity'},
                  {title: 'WiFi', value: 'wifi'},
                  {title: 'Weight', value: 'weight'},
                  {title: 'Dimensions', value: 'dimensions'},
                  {title: 'Material', value: 'material'},
                  {title: 'Warranty', value: 'warranty'},
                  {title: 'Brightness', value: 'brightness'},
                  {title: 'Operating System', value: 'os'},
                  {title: 'Touchscreen', value: 'touchscreen'},
                  {title: 'Microphone', value: 'microphone'},
                  {title: 'Rotatable', value: 'rotatable'},
                  {title: 'Adjustable', value: 'adjustable'},
                  {title: 'Recording', value: 'recording'},
                  {title: 'Panel Type', value: 'panel'},
                  {title: 'Wheel', value: 'wheel'},
                  {title: 'Audio', value: 'audio'},
                  {title: 'Check', value: 'check'},
                  {title: 'Star', value: 'star'},
                ],
              },
            }),
            defineField({
              name: 'label',
              title: 'Spec Label',
              type: 'string',
              description: 'Main spec text (e.g., "M5 chip", "12MP Camera")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Spec Value',
              type: 'string',
              description: 'Optional value or detail',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
    }),
    // FEATURE SECTIONS
    defineField({
      name: 'features',
      title: 'Feature Sections',
      type: 'array',
      group: 'media',
      description: 'Rich feature sections with images/videos for the product detail page',
      of: [
        {
          type: 'object',
          name: 'featureSection',
          title: 'Feature Section',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow Text',
              type: 'string',
              description: 'Small text above the heading (e.g., "Design.")',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main heading (e.g., "A powerhouse of portability.")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              description: 'Feature description text',
            }),
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Image', value: 'image'},
                  {title: 'Video', value: 'video'},
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            }),
            defineField({
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({parent}) => parent?.mediaType === 'video',
            }),
            defineField({
              name: 'video',
              title: 'Feature Video',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({parent}) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Dark (Black)', value: 'dark'},
                  {title: 'Light (Off-White)', value: 'light'},
                ],
              },
              initialValue: 'dark',
            }),
            defineField({
              name: 'textAlignment',
              title: 'Text Alignment',
              type: 'string',
              options: {
                list: [
                  {title: 'Center', value: 'center'},
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
              },
              initialValue: 'center',
            }),
            defineField({
              name: 'highlights',
              title: 'Highlight Items',
              type: 'array',
              description: 'Icon and text pairs displayed below the description',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Display', value: 'display'},
                          {title: 'Chip/Processor', value: 'chip'},
                          {title: 'Camera', value: 'camera'},
                          {title: 'Battery', value: 'battery'},
                          {title: 'Storage', value: 'storage'},
                          {title: 'Connectivity', value: 'connectivity'},
                          {title: 'WiFi', value: 'wifi'},
                          {title: 'Weight', value: 'weight'},
                          {title: 'Dimensions', value: 'dimensions'},
                          {title: 'Material', value: 'material'},
                          {title: 'Warranty', value: 'warranty'},
                          {title: 'Brightness', value: 'brightness'},
                          {title: 'Operating System', value: 'os'},
                          {title: 'Touchscreen', value: 'touchscreen'},
                          {title: 'Microphone', value: 'microphone'},
                          {title: 'Rotatable', value: 'rotatable'},
                          {title: 'Adjustable', value: 'adjustable'},
                          {title: 'Recording', value: 'recording'},
                          {title: 'Panel Type', value: 'panel'},
                          {title: 'Wheel', value: 'wheel'},
                          {title: 'Audio', value: 'audio'},
                          {title: 'Star', value: 'star'},
                          {title: 'Check', value: 'check'},
                        ],
                      },
                    }),
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      subtitle: 'icon',
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'eyebrow',
              media: 'image',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Untitled Feature',
                subtitle: subtitle || 'Feature Section',
                media,
              }
            },
          },
        },
      ],
    }),
    // VARIANTS
    defineField({
      name: 'hasVariants',
      title: 'Has Variants',
      type: 'boolean',
      group: 'variants',
      description: 'Enable if this product has multiple variants (e.g., colors, sizes)',
      initialValue: false,
    }),
    defineField({
      name: 'variantType',
      title: 'Variant Type',
      type: 'string',
      group: 'variants',
      options: {
        list: [
          {title: 'Color', value: 'color'},
          {title: 'Size', value: 'size'},
          {title: 'Material', value: 'material'},
          {title: 'Style', value: 'style'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      hidden: ({parent}) => !parent?.hasVariants,
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      group: 'variants',
      hidden: ({parent}) => !parent?.hasVariants,
      of: [
        {
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            defineField({
              name: 'name',
              title: 'Variant Name',
              type: 'string',
              description: 'e.g., "Red", "Large", "Cotton"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'Variant SKU',
              type: 'string',
              description: 'Unique SKU for this variant',
            }),
            defineField({
              name: 'colorHex',
              title: 'Color (Hex)',
              type: 'string',
              description: 'Color code for color swatches (e.g., #FF0000)',
              hidden: ({document}) => document?.variantType !== 'color',
            }),
            defineField({
              name: 'image',
              title: 'Variant Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  validation: (Rule) => Rule.required().warning('Isi alt text: jelaskan apa yang terlihat dan sebut nama produk (bukan sekadar "gambar").'),
                },
              ],
            }),
            defineField({
              name: 'images',
              title: 'Additional Variant Images',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alternative Text',
                      validation: (Rule) => Rule.required().warning('Isi alt text: jelaskan apa yang terlihat dan sebut nama produk (bukan sekadar "gambar").'),
                    },
                  ],
                },
              ],
            }),
            defineField({
              name: 'price',
              title: 'Variant Price',
              type: 'number',
              description: 'Leave empty to use base price',
            }),
            defineField({
              name: 'compareAtPrice',
              title: 'Compare At Price',
              type: 'number',
              description: 'Original price if on sale',
            }),
            defineField({
              name: 'inStock',
              title: 'In Stock',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              price: 'price',
              media: 'image',
              inStock: 'inStock',
            },
            prepare({title, price, media, inStock}) {
              return {
                title: title || 'Untitled Variant',
                subtitle: `${price ? `$${price}` : 'Base price'} ${inStock ? '✓' : '✗'}`,
                media,
              }
            },
          },
        },
      ],
    }),
    // INVENTORY & CATEGORIZATION
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Electronics', value: 'electronics'},
          {title: 'Clothing', value: 'clothing'},
          {title: 'Home & Garden', value: 'home-garden'},
          {title: 'Sports', value: 'sports'},
          {title: 'Books', value: 'books'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      group: 'inventory',
      description: 'Overall stock status (overridden by variants if enabled)',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'basic',
      description: 'Display this product in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Draft', value: 'draft'},
          {title: 'Archived', value: 'archived'},
          {title: 'Segera hadir (tampil di menu, tanpa halaman)', value: 'coming_soon'},
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'showInMenu',
      title: 'Tampilkan di menu header',
      type: 'boolean',
      group: 'basic',
      description: 'Produk unggulan yang langsung terlihat di menu atas website.',
      initialValue: false,
    }),
    defineField({
      name: 'menuOrder',
      title: 'Urutan di menu header',
      type: 'number',
      group: 'basic',
      description: 'Angka kecil tampil lebih dulu (1, 2, 3, ...).',
      hidden: ({document}) => !document?.showInMenu,
    }),
    ...seoFields(),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'images.0',
      status: 'status',
      hasVariants: 'hasVariants',
      variantCount: 'variants.length',
    },
    prepare({title, subtitle, media, status, hasVariants, variantCount}) {
      const variantText = hasVariants && variantCount ? ` (${variantCount} variants)` : ''
      return {
        title,
        subtitle: `$${subtitle || '0.00'} - ${status || 'active'}${variantText}`,
        media,
      }
    },
  },
})
