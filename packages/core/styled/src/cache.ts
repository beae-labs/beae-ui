import createCache from "@emotion/cache"
import { EmotionCache } from "@emotion/utils"
import { createContext, canUseDOM } from "@beae-ui/utils"

import { DefineComponent, Component, VNode, SetupContext } from "vue"

const [EmotionCacheProvider, useEmotionCache, EmotionCacheInjectionSymbol] =
  createContext<EmotionCache>({
    strict: false,
    name: "EmotionCacheContext",
  })

export const defaultCache = createCache({
  key: "beae",
})

export let __unusafe_useEmotionCache = useEmotionCache

let withEmotionCache = function withEmotionCache(
  fn: (
    cache: EmotionCache,
  ) =>
    | DefineComponent
    | Component
    | ((props?: unknown, ctx?: SetupContext) => VNode),
) {
  return (p: unknown) => {
    const cache = useEmotionCache(defaultCache)
    return fn(cache)
  }
}

if (canUseDOM()) {
  withEmotionCache = function withEmotionCache(
    fn: (
      cache: EmotionCache,
    ) =>
      | DefineComponent
      | Component
      | ((props?: unknown, ctx?: SetupContext) => VNode),
  ) {
    return () => {
      const cache = useEmotionCache(defaultCache)
      if (!cache) {
        const cache = createCache({
          key: "beae",
        })
        EmotionCacheProvider(cache)
        return fn(cache)
      } else {
        return fn(cache)
      }
    }
  }
}

export { withEmotionCache, EmotionCacheProvider, EmotionCacheInjectionSymbol }
