import {
  defineComponent,
  VueElement,
  toRefs,
  PropType,
  h,
  computed,
  ImgHTMLAttributes,
} from "vue"
import { omit } from "@beae-ui/utils"
import { type HTMLBeaeProps, beae } from "@beae-ui/system"
import { type SystemProps } from "@beae-ui/styled-system"
import { useImage, UseImageProps } from "./use-image"

interface NativeImageOptions {
  /**
   * The native HTML `width` attribute to the passed to the `img`
   */
  htmlWidth?: string | number
  /**
   * The native HTML `height` attribute to the passed to the `img`
   */
  htmlHeight?: string | number
}

const NativeImage = defineComponent({
  name: "NativeImage",
  props: {
    htmlWidth: {
      type: [String, Number] as PropType<NativeImageOptions["htmlWidth"]>,
      default: null,
    },
    htmlHeight: {
      type: [String, Number] as PropType<NativeImageOptions["htmlHeight"]>,
      default: null,
    },
  },
  setup(props, { attrs }) {
    return () => {
      return h(beae.img, {
        width: props.htmlWidth,
        height: props.htmlHeight,
        ...props,
        ...attrs,
      })
    }
  },
})

interface ImageOptions extends NativeImageOptions {
  /**
   * Fallback image `src` to show if image is loading or image fails.
   *
   * Note 🚨: We recommend you use a local image
   */
  fallbackSrc?: string
  /**
   * Fallback element to show if image is loading or image fails.
   * @type VueElement
   */
  fallback?: VueElement
  /**
   * Defines loading strategy
   */
  loading?: "eager" | "lazy"
  /**
   * How the image to fit within its bounds.
   * It maps to css `object-fit` property.
   * @type SystemProps["objectFit"]
   */
  fit?: SystemProps["objectFit"]
  /**
   * How to align the image within its bounds.
   * It maps to css `object-position` property.
   * @type SystemProps["objectPosition"]
   */
  align?: SystemProps["objectPosition"]
  /**
   * If `true`, opt out of the `fallbackSrc` logic and use as `img`
   */
  ignoreFallback?: boolean
  size?: string
}

export interface ImageProps
  extends UseImageProps,
    Omit<HTMLBeaeProps<"img">, keyof UseImageProps>,
    ImageOptions {}

export const Image = defineComponent({
  name: "Image",
  props: {
    src: {
      type: String as PropType<ImageProps["src"]>,
      required: true,
    },
    size: {
      type: String as PropType<ImageProps["size"]>,
      required: false,
    },
    rounded: {
      type: String as PropType<ImageProps["rounded"]>,
      required: false,
    },
    fallback: VueElement as PropType<ImageProps["fallback"]>,
    fallbackSrc: {
      type: String as PropType<ImageProps["fallbackSrc"]>,
      default: null,
    },
    ignoreFallback: Boolean as PropType<ImageProps["ignoreFallback"]>,
    htmlWidth: {
      type: String as PropType<ImageProps["htmlWidth"]>,
      default: null,
    },
    htmlHeight: {
      type: String as PropType<ImageProps["htmlHeight"]>,
      default: null,
    },
    srcSet: {
      type: String as PropType<ImageProps["srcSet"]>,
      default: null,
    },
    align: {
      type: String as PropType<string>,
      default: null,
    },
    loading: {
      type: String as PropType<ImageProps["loading"]>,
      default: null,
    },
    fit: {
      type: String as PropType<string>,
      default: null,
    },
    crossOrigin: {
      type: String as PropType<ImageProps["crossOrigin"]>,
      default: "",
    },
    onError: {
      type: Object as PropType<ImgHTMLAttributes["onError"]>,
      default: () => {},
    },
    onLoad: {
      type: Object as PropType<ImgHTMLAttributes["onLoad"]>,
      default: () => {},
    },
  },
  setup(props, { attrs }) {
    const {
      fallbackSrc,
      fallback,
      src,
      size,
      srcSet,
      align,
      fit,
      loading,
      ignoreFallback,
      crossOrigin,
      rounded,
      ...rest
    } = toRefs(props)

    /**
     * Defer to native `img` tag if `loading` prop is passed
     */

    const shouldIgnore =
      loading.value != null ||
      ignoreFallback.value ||
      (fallbackSrc.value === undefined && fallback.value === undefined) // if the user doesn't provide any kind of fallback we should ignore it
    const { status } = useImage({
      ...props,
      ignoreFallback: shouldIgnore,
    })

    const shared = {
      objectFit: fit.value,
      objectPosition: align.value,
      ...(shouldIgnore ? rest : omit(rest, ["onError", "onLoad"])),
    }
    const BaseStyles = computed(() => ({
      w: props.size,
      h: props.size,
      htmlWidth: shared.htmlWidth.value,
      htmlHeight: shared.htmlHeight.value,
      rounded: rounded.value,
      ObjectFit: fit.value,
      ObjectPosition: align.value,
    }))

    return () => {
      if (status.value !== "loaded") {
        if (fallback.value) return fallback.value
        return h(beae(NativeImage, { label: "image__placeholder" }), {
          src: fallbackSrc.value,
          ...BaseStyles.value,
          ...attrs,
        })
      }

      return h(beae(NativeImage, { label: "image" }), {
        src: src.value,
        srcSet: srcSet.value,
        crossOrigin: crossOrigin.value,
        loading: loading.value,
        ...BaseStyles.value,
        ...attrs,
      })
    }
  },
})
