export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-01'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder_project_id'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
