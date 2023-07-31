import {
  beae,
  SystemStyleObject,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"

import { getProgressProps, spin } from "./progress.utils"
import { Shape } from "./shape"
import { Circle } from "./circle"
import { PropType, defineComponent, h } from "vue"

interface CircularProgressOptions {
  /**
   * The size of the circular progress in CSS units
   */
  size?: string | number
  /**
   * Maximum value defining 100% progress made (must be higher than 'min')
   * @default 100
   */
  max?: number
  /**
   * Minimum value defining 'no progress' (must be lower than 'max')
   * @default 0
   */
  min?: number
  /**
   * This defines the stroke width of the svg circle.
   * @default "10px"
   */
  thickness?: string | number
  /**
   * Current progress (must be between min/max)
   */
  value?: number
  /**
   * If `true`, the cap of the progress indicator will be rounded.
   *
   * @default false
   */
  capIsRound?: boolean
  /**
   * The content of the circular progress bar. If passed, the content will be inside and centered in the progress bar.
   */
  trackColor?: string
  /**
   * The color of the progress indicator. Use a color key in the theme object
   */
  color?: string
  /**
   * The desired valueText to use in place of the value
   */
  valueText?: string
  /**
   * A function that returns the desired valueText to use in place of the value
   */
  getValueText?(value: number, percent: number): string
  /**
   * If `true`, the progress will be indeterminate and the `value`
   * prop will be ignored
   *
   * @default false
   */
  isIndeterminate?: boolean
}

export interface CircularProgressProps
  extends Omit<HTMLBeaeProps<"div">, "color">,
    CircularProgressOptions {}

/**
 * CircularProgress is used to indicate the progress of an activity.
 * It is built using `svg` and `circle` components with support for
 * theming and `indeterminate` state
 *
 * @see Docs https://beae-ui.com/circularprogress
 * @todo add theming support for circular progress
 */
export const CircularProgress: ComponentWithProps<
  DeepPartial<CircularProgressProps>
> = defineComponent({
  name: "CircularProgress",
  props: {
    size: {
      type: String as PropType<CircularProgressProps["size"]>,
      default: "48px",
    },
    max: {
      type: Number as PropType<CircularProgressProps["max"]>,
      default: 100,
    },
    min: {
      type: Number as PropType<CircularProgressProps["min"]>,
      default: 0,
    },
    valueText: String as PropType<CircularProgressProps["valueText"]>,
    getValueText: Function as PropType<CircularProgressProps["getValueText"]>,
    value: Number as PropType<CircularProgressProps["value"]>,
    capIsRound: Boolean as PropType<CircularProgressProps["capIsRound"]>,
    thickness: {
      type: String as PropType<CircularProgressProps["thickness"]>,
      default: "10px",
    },
    color: {
      type: String as PropType<CircularProgressProps["color"]>,
      default: "#0078d4",
    },
    trackColor: {
      type: String as PropType<CircularProgressProps["trackColor"]>,
      default: "#edebe9",
    },
    isIndeterminate: Boolean as PropType<
      CircularProgressProps["isIndeterminate"]
    >,
  },
  setup(props, { slots }) {
    const {
      size = "48px",
      max = 100,
      min = 0,
      valueText,
      getValueText,
      value,
      capIsRound,
      thickness = "10px",
      color = "#0078d4",
      trackColor = "#edebe9",
      isIndeterminate,
    } = props

    const progress = getProgressProps({
      min,
      max,
      value,
      valueText,
      getValueText,
      isIndeterminate,
    })

    const determinant = isIndeterminate
      ? undefined
      : (progress.percent ?? 0) * 2.64

    const strokeDasharray =
      determinant == null ? undefined : `${determinant} ${264 - determinant}`

    const indicatorProps = isIndeterminate
      ? {
          css: { animation: `${spin} 1.5s linear infinite` },
        }
      : {
          "stroke-dashoffset": 66,
          "stroke-dasharray": strokeDasharray,
          "transition-property": "stroke-dasharray, stroke",
          "transition-duration": "0.6s",
          "transition-timing-function": "ease",
        }

    const rootStyles: SystemStyleObject = {
      display: "inline-block",
      position: "relative",
      verticalAlign: "middle",
      fontSize: size,
    }

    return () =>
      h(
        "div",
        {
          class: "beae-progress",
          ...progress.bind,
          style: rootStyles,
        },
        [
          h(
            Shape,
            {
              size: size,
              isIndeterminate: isIndeterminate,
            },
            () => [
              h(Circle, {
                stroke: trackColor,
                "stroke-width": thickness,
                class: "beae-progress__track",
              }),
              h(Circle, {
                stroke: color,
                "stroke-width": thickness,
                class: "beae-progress__indicator",
                "stroke-linecap": capIsRound ? "round" : undefined,
                /**
                 * fix issue in Safari where indicator still shows when value is 0
                 * @see Issue https://github.com/beae-ui/beae-ui/issues/3754
                 */
                opacity:
                  progress.value === 0 && !isIndeterminate ? 0 : undefined,
                ...indicatorProps,
              }),
            ],
          ),
          slots.default?.(),
        ],
      )
  },
})
