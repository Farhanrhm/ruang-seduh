import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Produk Toko',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Produk',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Harga (IDR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Biji Kopi', value: 'BIJI KOPI'},
          {title: 'Alat Seduh', value: 'ALAT SEDUH'},
          {title: 'Aksesoris', value: 'AKSESORIS'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Gambar Produk',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
    }),
    // Field Tambahan untuk Detail Kopi
    defineField({
      name: 'origin',
      title: 'Asal (Khusus Kopi)',
      type: 'string',
    }),
    defineField({
      name: 'process',
      title: 'Proses (Khusus Kopi)',
      type: 'string',
    }),
    defineField({
      name: 'roast',
      title: 'Roast Level (Khusus Kopi)',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Tasting Notes (Khusus Kopi)',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
