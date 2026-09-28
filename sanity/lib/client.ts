import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Dimatikan (false) karena kita menggunakan sistem webhook dan tag-based revalidation (ISR)
})
