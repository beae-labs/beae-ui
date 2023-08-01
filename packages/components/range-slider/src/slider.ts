import { createContext, cx } from "@beae-ui/utils"
import {
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  useTheme,
} from "@beae-ui/system"
import { useSlider, UseSliderProps, UseSliderReturn } from "./use-slider"
import { PropType, defineComponent, h } from "vue"

interface SliderContext
  extends Omit<UseSliderReturn, "getInputProps" | "getRootProps"> {}

const [SliderProvider, useSliderContext] = createContext<SliderContext>({
  name: "SliderContext",
  hookName: "useSliderContext",
  providerName: "<Slider />",
})

const [SliderStylesProvider, useSliderStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `SliderStylesContext`,
  hookName: `useSliderStyles`,
  providerName: "<Slider />",
})

export { useSliderStyles }
export { SliderProvider, useSliderContext }

export interface SliderProps
  extends UseSliderProps,
    ThemingProps<"Slider">,
    Omit<HTMLBeaeProps<"div">, keyof UseSliderProps> {}

/**
 * The Slider is used to allow users to make selections from a range of values.
 * It provides context and functionality for all slider components
 *
 * @see Docs     https://beae-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export const Slider: ComponentWithProps<DeepPartial<SliderProps>> =
  defineComponent({
    name: "Slider",
    props: {
      min: {
        type: Number as PropType<SliderProps["min"]>,
        default: 100,
      },
      max: {
        type: Number as PropType<SliderProps["max"]>,
        default: 1,
      },
      step: Number as PropType<SliderProps["step"]>,
      value: Number as PropType<SliderProps["value"]>,
      defaultValue: Number as PropType<SliderProps["defaultValue"]>,
      orientation: String as PropType<SliderProps["orientation"]>,
      isReversed: Boolean as PropType<SliderProps["isReversed"]>,
      onChangeStart: Function as PropType<SliderProps["onChangeStart"]>,
      onChangeEnd: Function as PropType<SliderProps["onChangeEnd"]>,
      onChange: Function as PropType<SliderProps["onChange"]>,
      id: String as PropType<SliderProps["id"]>,
      name: String as PropType<SliderProps["name"]>,
      isDisabled: Boolean as PropType<SliderProps["isDisabled"]>,
      isReadOnly: Boolean as PropType<SliderProps["isReadOnly"]>,
      getAriaValueText: Function as PropType<SliderProps["getAriaValueText"]>,
      focusThumbOnChange: Boolean as PropType<
        SliderProps["focusThumbOnChange"]
      >,
      "aria-valuetext": String as PropType<SliderProps["aria-valuetext"]>,
      "aria-label": String as PropType<SliderProps["aria-label"]>,
      "aria-labelledby": String as PropType<SliderProps["aria-labelledby"]>,
      direction: String as PropType<SliderProps["direction"]>,
    },
    setup(props, { slots }) {
      const sliderProps: SliderProps = {
        ...props,
        orientation: props?.orientation ?? "horizontal",
      }

      const styles = useMultiStyleConfig("Slider", sliderProps)
      const ownProps = omitThemingProps(sliderProps)

      const { direction } = useTheme()
      ownProps.direction = direction

      const { getInputProps, getRootProps, ...context } = useSlider(ownProps)

      const rootProps = getRootProps()
      const inputProps = getInputProps({})
      SliderProvider(context)
      SliderStylesProvider(styles)
      return h(
        "div",
        {
          ...rootProps,
          class: cx("beae-slider", sliderProps.class),
          style: styles.container,
        },
        [slots.default?.(), h("input", { ...inputProps })],
      )
    },
  })

export interface SliderThumbProps extends HTMLBeaeProps<"div"> {}

/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
export const SliderThumb: ComponentWithProps<DeepPartial<SliderThumbProps>> =
  defineComponent({
    name: "SliderThumb",
    setup(props, {}) {
      const { getThumbProps } = useSliderContext()
      const styles = useSliderStyles()
      const thumbProps = getThumbProps(props)

      return h("div", {
        ...thumbProps,
        class: cx("beae-slider__thumb", props.class),
        style: styles.thumb,
      })
    },
  })

export interface SliderTrackProps extends HTMLBeaeProps<"div"> {}

export const SliderTrack: ComponentWithProps<DeepPartial<SliderTrackProps>> =
  defineComponent({
    name: "SliderTrack",
    setup(props, {}) {
      const { getTrackProps } = useSliderContext()
      const styles = useSliderStyles()
      const trackProps = getTrackProps(props)

      return h("div", {
        ...trackProps,
        class: cx("beae-slider__track", props.class),
        style: styles.track,
      })
    },
  })

export interface SliderInnerTrackProps extends HTMLBeaeProps<"div"> {}

export const SliderFilledTrack: ComponentWithProps<
  DeepPartial<SliderInnerTrackProps>
> = defineComponent({
  name: "SliderFilledTrack",
  setup(props, ref) {
    const { getInnerTrackProps } = useSliderContext()
    const styles = useSliderStyles()
    const trackProps = getInnerTrackProps(props, ref)

    return h("div", {
      ...trackProps,
      class: cx("beae-slider__filled-track", props.class),
      style: styles.filledTrack,
    })
  },
})

export interface SliderMarkProps extends HTMLBeaeProps<"div"> {
  value: number
}

/**
 * SliderMark is used to provide names for specific Slider
 * values by defining labels or markers along the track.
 *
 * @see Docs https://beae-ui.com/slider
 */
export const SliderMark: ComponentWithProps<DeepPartial<SliderMarkProps>> =
  defineComponent({
    name: "SliderMark",
    props: {
      value: Number as PropType<SliderMarkProps["value"]>,
    },
    setup(props, {}) {
      const { getMarkerProps } = useSliderContext()
      const styles = useSliderStyles()
      const markProps = getMarkerProps(props)
      return h("div", {
        ...markProps,
        class: cx("beae-slider__marker", props.class),
        style: styles.mark,
      })
    },
  })
