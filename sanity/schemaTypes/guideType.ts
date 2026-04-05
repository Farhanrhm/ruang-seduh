import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const guideType = defineType({
  name: 'guide',
  title: 'Panduan Seduh',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Panduan',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Gambar Utama / Cover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
      description: 'Muncul di halaman daftar panduan',
    }),
    defineField({
      name: 'difficulty',
      title: 'Tingkat Kesulitan',
      type: 'string',
      options: { list: ['Mudah', 'Menengah', 'Sulit'] },
    }),
    defineField({
      name: 'time',
      title: 'Waktu Persiapan (Contoh: 5 Menit)',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Langkah-langkah Seduh',
      type: 'blockContent',
    }),
  ],
})