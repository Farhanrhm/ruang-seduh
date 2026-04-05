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
      options: { source: 'name', maxLength: 96 },
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
    // 👇 Field Baru: Jenis Asal Kopi 👇
    defineField({
      name: 'originCategory',
      title: 'Jenis Asal (Khusus Biji Kopi)',
      type: 'string',
      options: {
        list: [
          {title: 'Lokal (Indonesia)', value: 'LOKAL'},
          {title: 'Impor (Luar Negeri)', value: 'IMPOR'},
        ],
      },
      description: 'Pilih apakah ini biji kopi Nusantara atau Internasional',
    }),
    defineField({
      name: 'imageUrl',
      title: 'URL Gambar (Dari Internet)',
      type: 'url',
      description: 'Tempel link gambar dari internet di sini agar lebih cepat',
    }),
    defineField({
      name: 'image',
      title: 'Gambar Produk (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi (Khusus Alat/Aksesoris)',
      type: 'text',
    }),
    defineField({
      name: 'origin',
      title: 'Daerah Asal Spesifik (Khusus Kopi)',
      type: 'string',
      description: 'Contoh: Aceh Gayo, Ethiopia Yirgacheffe',
    }),
    defineField({
      name: 'process',
      title: 'Proses (Khusus Kopi)',
      type: 'string',
      description: 'Contoh: Wet Hulled, Natural, Washed',
    }),
    defineField({
      name: 'roast',
      title: 'Roast Level (Khusus Kopi)',
      type: 'string',
      description: 'Contoh: Dark Roast, Medium Roast',
    }),
    defineField({
      name: 'notes',
      title: 'Tasting Notes (Khusus Kopi)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tekan Enter setiap selesai menulis 1 note (Contoh: Dark Chocolate)',
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