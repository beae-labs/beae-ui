import {
  // Interpolation,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
  createStylesContext,
} from "@beae-ui/system"
import {
  getProgressProps,
  GetProgressPropsOptions,
  progress,
  stripe,
} from "./progress.utils"
import { PropType, defineComponent, h } from "vue"

const [ProgressStyles, useProgressStyles] =
  createStylesContext("ProgressStyles")

export { useProgressStyles }

export interface ProgressFilledTrackProps
  extends HTMLBeaeProps<"div">,
    GetProgressPropsOptions {}

/**
 * ProgressFilledTrack (Linear)
 *
 * The progress component that visually indicates the current level of the progress bar.
 * It applies `background-color` and changes its width.
 *
 * @see Docs https://beae-ui.com/progress
 */
const ProgressFilledTrack: ComponentWithProps<
  DeepPartial<ProgressFilledTrackProps>
> = defineComponent({
  props: {
    min: Number as PropType<ProgressFilledTrackProps["min"]>,
    max: Number as PropType<ProgressFilledTrackProps["max"]>,
    value: Number as PropType<ProgressFilledTrackProps["value"]>,
    isIndeterminate: Boolean as PropType<
      ProgressFilledTrackProps["isIndeterminate"]
    >,
    role: String as PropType<ProgressFilledTrackProps["role"]>,
    "aria-label": String,
    "aria-labelledby": String,
    "aria-valuetext": String,
    title: String,
    borderRadius: String as PropType<ProgressProps["borderRadius"]>,
    css: {} as PropType<SystemStyleObject>,
  },
  setup(props, { attrs, slots }) {
    const { min, max, value, isIndeterminate, role } = props
    const progress = getProgressProps({
      value,
      min: min ?? 0,
      max: max ?? 100,
      isIndeterminate,
      role,
    })

    const styles = useProgressStyles()
    const trackStyles = {
      height: "100%",
      ...styles.value.filledTrack,
    }

    return () =>
      h("div", {
        style: {
          width: `${progress.percent}%`,
          ...trackStyles,
        },
        ...progress.bind,
        ...attrs,
      })
  },
})

export interface ProgressTrackProps extends HTMLBeaeProps<"div"> {}

interface ProgressOptions {
  /**
   * The `value` of the progress indicator.
   * If `undefined` the progress bar will be in `indeterminate` state
   */
  value?: number
  /**
   * The minimum value of the progress
   * @default 0
   */
  min?: number
  /**
   * The maximum value of the progress
   * @default 100
   */
  max?: number
  /**
   * If `true`, the progress bar will show stripe
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
   * If `true`, the progress will be indeterminate and the `value`
   * prop will be ignored
   *
   * @default false
   */
  isIndeterminate?: boolean
}

export interface ProgressProps
  extends ProgressOptions,
    ThemingProps<"Progress">,
    HTMLBeaeProps<"div"> {}

/**
 * Progress (Linear)
 *
 * Progress is used to display the progress status for a task that takes a long
 * time or consists of several steps.
 *
 * It includes accessible attributes to help assistive technologies understand
 * and speak the progress values.
 *
 * @see Docs https://beae-ui.com/progress
 */
export const Progress: ComponentWithProps<DeepPartial<ProgressProps>> =
  defineComponent({
    name: "Progress",
    props: {
      value: Number as PropType<ProgressProps["value"]>,
      min: {
        type: Number as PropType<ProgressProps["min"]>,
        default: 0,
      },
      max: {
        type: Number as PropType<ProgressProps["max"]>,
        default: 0,
      },
      hasStripe: Boolean as PropType<ProgressProps["hasStripe"]>,
      isAnimated: Boolean as PropType<ProgressProps["isAnimated"]>,
      borderRadius: String as PropType<ProgressProps["borderRadius"]>,
      isIndeterminate: Boolean as PropType<ProgressProps["isIndeterminate"]>,
      "aria-label": String,
      "aria-labelledby": String,
      "aria-valuetext": String,
      title: String,
      role: String,
    },
    setup(props, { slots }) {
      const {
        value,
        min = 0,
        max = 100,
        hasStripe,
        isAnimated,
        borderRadius: propBorderRadius,
        isIndeterminate,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText,
        title,
        role,
      } = props

      const styles = useMultiStyleConfig("Progress", props)

      const borderRadius =
        propBorderRadius ??
        (styles.value?.track?.borderRadius as string | number | undefined)

      const stripeAnimation = { animation: `${stripe} 1s linear infinite` }

      /**
       * We should not use stripe if it is `indeterminate`
       */
      const shouldAddStripe = !isIndeterminate && hasStripe

      const shouldAnimateStripe = shouldAddStripe && isAnimated

      /**
       * Generate styles for stripe and stripe animation
       */
      // TODO: @ToanTran a import thêm cái này vào nhé
      // const css: Interpolation<any> = {
      const css = {
        ...(shouldAnimateStripe && stripeAnimation),
        ...(isIndeterminate && {
          position: "absolute",
          willChange: "left",
          minWidth: "50%",
          animation: `${progress} 1s ease infinite normal none running`,
        }),
      }

      const trackStyles: SystemStyleObject = {
        overflow: "hidden",
        position: "relative",
        ...styles.value.track, // TODO: update config theme cho em phát nhé
      }

      ProgressStyles(styles)

      return () =>
        h(
          "div",
          {
            borderRadius: borderRadius,
            style: trackStyles,
          },
          [
            h(ProgressFilledTrack, {
              // TODO: check hộ em phát a nhé
              "aria-label": ariaLabel,
              "aria-labelledby": ariaLabelledBy,
              "aria-valuetext": ariaValueText,
              min: min,
              max: max,
              value: value,
              isIndeterminate: isIndeterminate,
              css: css,
              borderRadius: borderRadius,
              title: title,
              role: role,
            }),
            slots.default?.(),
          ],
        )
    },
  })
