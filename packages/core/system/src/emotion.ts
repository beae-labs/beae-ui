import createCacheImport from "@emotion/cache"
import createEmotionImport from "@emotion/css/create-instance"

export function createCache(...args: Parameters<typeof createCacheImport>) {
  return typeof createCacheImport === "function"
    ? createCacheImport(...args)
    : // @ts-ignore
    createCacheImport.default(...args) // @ts-ignore
    ? createCacheImport.default(...args)
    : // @ts-ignore
      createCacheImport(...args)
}

export function createEmotion(...args: Parameters<typeof createEmotionImport>) {
  return typeof createEmotionImport === "function"
    ? createEmotionImport(...args)
    : // @ts-ignore
    createEmotionImport.default(...args) // @ts-ignore
    ? createEmotionImport.default(...args)
    : // @ts-ignore
      createEmotionImport(...args)
}

export const beaeEmotionCache = createCache({
  key: "beae",
})

export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  cache,
} = createEmotion({
  key: beaeEmotionCache.key,
})
