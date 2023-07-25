import { inject } from "vue"

export function useFeatures() {
  const features = inject("feature-context")

  if (!features) {
    throw new Error("No Features were provided.")
  }

  return features
}
