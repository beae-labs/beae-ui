import { defineComponent, PropType, computed, h, toRefs } from "vue"

import {
  beae,
  HTMLBeaeProps,
  ComponentWithProps,
  SystemStyleObject,
  useMultiStyleConfig,
  DeepPartial,
} from "@beae-ui/system"
import { getValidChildren } from "@beae-ui/utils"
import {
  getLoadingProps,
  GetLoadingPropsOptions,
  loading,
  stripe,
} from "./loading.utils"

export interface LoadingFilledTrackProps
  extends HTMLBeaeProps<"div">,
    GetLoadingPropsOptions {
  color?: string
}

/**
 * LoadingFilledTrack (Linear)
 *
 * The loading component that visually indicates the current level of the loading bar.
 * It applies `background-color` and changes its width.
 *
 */
const LoadingFilledTrack: ComponentWithProps<LoadingFilledTrackProps> =
  defineComponent({
    name: "LoadingFilledTrack",
    props: {
      value: Number as PropType<LoadingFilledTrackProps["value"]>,
      min: {
        type: Number as PropType<LoadingFilledTrackProps["min"]>,
        default: 0,
      },
      max: {
        type: Number as PropType<LoadingFilledTrackProps["max"]>,
        default: 100,
      },
      valueText: String as PropType<LoadingFilledTrackProps["valueText"]>,
      isIndeterminate: Boolean as PropType<
        LoadingFilledTrackProps["isIndeterminate"]
      >,
      role: String as PropType<LoadingFilledTrackProps["role"]>,
      color: String as PropType<LoadingFilledTrackProps["color"]>,
      css: Object as PropType<DeepPartial<SystemStyleObject>>,
    },
    setup(props, { slots, attrs }) {
      const { value, min, max, isIndeterminate, role, color, css } =
        toRefs(props)
      const styles = useMultiStyleConfig("Progress", props)
      const loadingComputed = computed(() =>
        getLoadingProps({
          value: value.value,
          min: min.value,
          max: max.value,
          isIndeterminate: isIndeterminate.value,
          role: role.value,
        }),
      )
      const trackStyle = computed<SystemStyleObject>(() => ({
        height: "100%",
        backgroundColor: color.value,
        ...styles.value.filledTrack,
        ...css.value,
      }))
      return () =>
        h(
          beae.div,
          {
            __label: "loading__filled-track",
            ...attrs,
            style: {
              width: `${loadingComputed.value.percent}%`,
            },
            ...loadingComputed.value.bind,
            __css: trackStyle.value,
          },
          () => getValidChildren(slots),
        )
    },
  })

export interface LoadingTrackProps extends HTMLBeaeProps<"div"> {}

interface LoadingOptions {
  /**
   * The `value` of the loading indicator.
   * If `undefined` the loading bar will be in `indeterminate` state
   */
  value?: number
  /**
   * The minimum value of the loading
   * @default 0
   */
  min?: number
  /**
   * The maximum value of the loading
   * @default 100
   */
  max?: number
  /**
   * If `true`, the loading bar will show stripe
   *
   * @default false
   */
  hasStripe?: boolean
  /**
   * If `true`, and hasStripe is `true`, the stripes will be animated
   *
   * @default false
   */
  isAnimated?: boolean
  /**
   * If `true`, the loading will be indeterminate and the `value`
   * prop will be ignored
   *
   * @default false
   */
  isIndeterminate?: boolean

  /**
   * The color scheme of the loading
   * @default blue
   */
  colorScheme?: string

  /**
   * The title of the loading
   */
  title?: string

  /**
   * The role of the loading
   *
   * @default progressbar
   */
  role?: string

  /**
   * The size of the loading
   * @default md
   * */
  size?: string
}

export interface LoadingProps extends LoadingOptions, HTMLBeaeProps<"div"> {}

// /**
//  * Loading (Linear)
//  *
//  * Loading is used to display the loading status for a task that takes a long
//  * time or consists of several steps.
//  *
//  * It includes accessible attributes to help assistive technologies understand
//  * and speak the loading values.
//  *
//  */
const Loading: ComponentWithProps<DeepPartial<LoadingProps>> = defineComponent({
  name: `Loading`,
  props: {
    value: Number as PropType<LoadingProps["value"]>,
    min: Number as PropType<LoadingProps["min"]>,
    max: Number as PropType<LoadingProps["max"]>,
    hasStripe: Boolean as PropType<LoadingProps["hasStripe"]>,
    isAnimated: Boolean as PropType<LoadingProps["isAnimated"]>,
    isIndeterminate: {
      type: Boolean as PropType<LoadingProps["isIndeterminate"]>,
      default: false,
    },
    colorScheme: {
      type: String as PropType<LoadingProps["colorScheme"]>,
      default: "blue",
    },
    title: String as PropType<LoadingProps["title"]>,
    role: String as PropType<LoadingProps["role"]>,
    size: String as PropType<LoadingProps["size"]>,
    height: String as PropType<LoadingProps["height"]>,
  },
  setup(props, { slots }) {
    const {
      value,
      min,
      max,
      hasStripe,
      isAnimated,
      isIndeterminate,
      title,
      role,
      colorScheme,
      size,
      height,
    } = toRefs(props)
    const styles = useMultiStyleConfig(
      "Progress",
      computed(() => ({
        size: size.value,
        colorScheme: colorScheme.value,
      })),
    )
    console.log(styles.value)
    const trackStyle = computed<SystemStyleObject>(() => ({
      overflow: "hidden",
      position: "relative",
      ...styles.value.track,
      ...(height.value && { height: height.value }),
    }))
    console.log(trackStyle.value)
    const css = computed<SystemStyleObject>(() => {
      const shouldAddStripe = !isIndeterminate.value && hasStripe.value

      const shouldAnimateStripe = shouldAddStripe && isAnimated.value

      const stripeAnimation = { animation: `${stripe} 1s linear infinite` }
      return {
        ...(shouldAnimateStripe && stripeAnimation),
        ...(isIndeterminate.value && {
          position: "absolute",
          willChange: "left",
          minWidth: "50%",
          animation: `${loading} 1s ease infinite normal none running`,
        }),
      }
    })

    return () => {
      return h(
        beae.div,
        {
          __css: trackStyle.value,
        },
        h(
          LoadingFilledTrack,
          {
            min: min.value,
            max: max.value,
            value: value.value,
            isIndeterminate: isIndeterminate.value,
            title: title.value,
            role: role.value,
            css: css.value,
            bgColor: colorScheme.value,
          },
          () => getValidChildren(slots),
        ),
      )
    }
  },
})

export default Loading
