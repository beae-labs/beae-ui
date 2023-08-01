import { createContext, cx } from "@beae-ui/utils"
import {
  HTMLBeaeProps,
  omitThemingProps,
  ThemingProps,
  useMultiStyleConfig,
  useTheme,
  SystemStyleObject,
  DeepPartial,
  ComponentWithProps,
} from "@beae-ui/system"
import {
  useRangeSlider,
  UseRangeSliderProps,
  UseRangeSliderReturn,
} from "./use-range-slider"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { PropType, defineComponent, h, reactive } from "vue"

interface RangeSliderContext
  extends Omit<UseRangeSliderReturn, "getRootProps"> {
  name?: string | string[]
}

const [RangeSliderProvider, useRangeSliderContext] =
  createContext<RangeSliderContext>({
    name: "SliderContext",
    errorMessage:
      "useSliderContext: `context` is undefined. Seems you forgot to wrap all slider components within <RangeSlider />",
  })

const [RangeSliderStylesProvider, useRangeSliderStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `RangeSliderStylesContext`,
  errorMessage: `useRangeSliderStyles returned is 'undefined'. Seems you forgot to wrap the components in "<RangeSlider />" `,
})

export { useRangeSliderStyles }

export { RangeSliderProvider, useRangeSliderContext }

export interface RangeSliderProps
  extends UseRangeSliderProps,
    ThemingProps<"Slider">,
    Omit<HTMLBeaeProps<"div">, keyof UseRangeSliderProps> {}

/**
 * The Slider is used to allow users to make selections from a range of values.
 * It provides context and functionality for all slider components
 *
 * @see Docs     https://beae-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb/
 */
export const RangeSlider: ComponentWithProps<DeepPartial<RangeSliderProps>> =
  defineComponent({
    props: {
      min: {
        type: Number as PropType<RangeSliderProps["min"]>,
        default: 100,
      },
      max: {
        type: Number as PropType<RangeSliderProps["max"]>,
        default: 1,
      },
      step: Number as PropType<RangeSliderProps["step"]>,
      value: Array as PropType<RangeSliderProps["value"]>,
      defaultValue: Array as PropType<RangeSliderProps["defaultValue"]>,
      orientation: String as PropType<RangeSliderProps["orientation"]>,
      isReversed: Boolean as PropType<RangeSliderProps["isReversed"]>,
      onChangeStart: Function as PropType<RangeSliderProps["onChangeStart"]>,
      onChangeEnd: Function as PropType<RangeSliderProps["onChangeEnd"]>,
      onChange: Function as PropType<RangeSliderProps["onChange"]>,
      id: String as PropType<RangeSliderProps["id"]>,
      name: String as PropType<RangeSliderProps["name"]>,
      isDisabled: Boolean as PropType<RangeSliderProps["isDisabled"]>,
      isReadOnly: Boolean as PropType<RangeSliderProps["isReadOnly"]>,
      getAriaValueText: Function as PropType<
        RangeSliderProps["getAriaValueText"]
      >,
      focusThumbOnChange: Boolean as PropType<
        RangeSliderProps["focusThumbOnChange"]
      >,
      "aria-valuetext": Array as PropType<RangeSliderProps["aria-valuetext"]>,
      "aria-label": Array as PropType<RangeSliderProps["aria-label"]>,
      "aria-labelledby": Array as PropType<RangeSliderProps["aria-labelledby"]>,
      direction: String as PropType<RangeSliderProps["direction"]>,
      minStepsBetweenThumbs: Number as PropType<
        RangeSliderProps["minStepsBetweenThumbs"]
      >,
      ...vueThemingProps,
    },
    setup(props, { slots }) {
      const sliderProps = {
        ...props,
        orientation: "horizontal",
      }

      const styles = useMultiStyleConfig("Slider", sliderProps)
      const ownProps = omitThemingProps(sliderProps)

      const { direction } = useTheme()
      ownProps.direction = direction

      const { getRootProps, ...context } = useRangeSlider(ownProps)
      const ctx = reactive({ ...context, name: sliderProps.name })
      RangeSliderProvider(ctx)
      RangeSliderStylesProvider(styles)
      return h(
        "div",
        {
          class: "beae-slider",
          style: styles.container,
        },
        slots.default?.(),
      )
    },
  })

export interface RangeSliderThumbProps extends HTMLBeaeProps<"div"> {
  index: number
}

/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
export const RangeSliderThumb: ComponentWithProps<
  DeepPartial<RangeSliderThumbProps>
> = defineComponent({
  name: "RangeSliderThumb",
  props: {
    index: Number as PropType<RangeSliderThumbProps["index"]>,
    ...vueThemingProps,
  },
  setup(props, { slots }) {
    const { getThumbProps, getInputProps, name } = useRangeSliderContext()
    const styles = useRangeSliderStyles()
    const thumbProps = getThumbProps(props)
    return h(
      "div",
      {
        ...thumbProps,
        class: cx("beae-slider__thumb", props.class),
        style: styles.thumb,
      },
      [
        slots.default?.(),
        name && h("input", { ...getInputProps({ index: props.index }) }),
      ],
    )
  },
})

export interface RangeSliderTrackProps extends HTMLBeaeProps<"div"> {}

export const RangeSliderTrack: ComponentWithProps<
  DeepPartial<RangeSliderTrackProps>
> = defineComponent({
  name: "RangeSliderTrack",
  setup(props, {}) {
    const { getTrackProps } = useRangeSliderContext()
    const trackProps = getTrackProps(props)
    const styles = useRangeSliderStyles()

    return h("div", {
      ...trackProps,
      class: cx("beae-slider__track", props.class),
      style: styles.track,
      "data-testid": "beae-range-slider-track",
    })
  },
})

export interface RangeSliderInnerTrackProps extends HTMLBeaeProps<"div"> {}

export const RangeSliderFilledTrack: ComponentWithProps<
  DeepPartial<RangeSliderInnerTrackProps>
> = defineComponent({
  name: "RangeSliderFilledTrack",
  setup(props, {}) {
    const { getInnerTrackProps } = useRangeSliderContext()
    const styles = useRangeSliderStyles()
    const trackProps = getInnerTrackProps(props)

    return h("div", {
      ...trackProps,
      class: "beae-slider__filled-track",
      style: styles.filledTrack,
    })
  },
})

export interface RangeSliderMarkProps extends HTMLBeaeProps<"div"> {
  value: number
}

/**
 * SliderMark is used to provide names for specific Slider
 * values by defining labels or markers along the track.
 *
 * @see Docs https://beae-ui.com/slider
 */
export const RangeSliderMark: ComponentWithProps<
  DeepPartial<RangeSliderMarkProps>
> = defineComponent({
  name: "RangeSliderMark",
  props: {
    value: Number as PropType<RangeSliderMarkProps["value"]>,
  },
  setup(props, {}) {
    const { getMarkerProps } = useRangeSliderContext()
    const styles = useRangeSliderStyles()
    const markProps = getMarkerProps(props)
    return h("div", {
      ...markProps,
      class: cx("beae-slider__marker", props.class),
      style: styles.mark,
    })
  },
})
