import { createContext, cx } from "@beae-ui/utils"
import {
  beae,
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
import { PropType, defineComponent, h, computed, watch } from "vue"

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
        default: 1,
      },
      max: {
        type: Number as PropType<SliderProps["max"]>,
        default: 100,
      },
      step: Number as PropType<SliderProps["step"]>,
      value: Number as PropType<SliderProps["value"]>,
      defaultValue: Number as PropType<SliderProps["defaultValue"]>,
      orientation: {
        type: String as PropType<SliderProps["orientation"]>,
        default: () => "horizontal",
      },
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
    emits: ["update:value"],
    setup(props, { slots, emit }) {
      const sliderProps: SliderProps = computed(() => props)
      const styles = useMultiStyleConfig("Slider", sliderProps)
      const ownProps = omitThemingProps(sliderProps.value)

      const { direction } = useTheme()
      ownProps.direction = direction

      const { state, getInputProps, getRootProps, ...context } =
        useSlider(ownProps)
      const value = computed(() => state.value.value)

      watch(value, (val) => {
        emit("update:value", val)
      })

      const rootProps = getRootProps()
      const inputProps = getInputProps.value({})
      SliderProvider({ ...context, state })
      SliderStylesProvider(styles)
      return () =>
        h(
          beae.div,
          {
            ...rootProps,
            __label: cx("slider", sliderProps.value.class),
            __css: styles.value.container,
          },
          () => [slots.default?.(), h(beae.input, { ...inputProps })],
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
    setup(props, { slots }) {
      const { getThumbProps, state } = useSliderContext()
      const styles = useSliderStyles()
      const thumbProps = computed(() => {
        return {
          reactive: state.value.value, // TODO: need optimize
          ...getThumbProps(props),
        }
      })

      return () =>
        h(
          beae.div,
          {
            ...thumbProps.value,
            __label: cx("slider__thumb", props.class),
            __css: styles.value.thumb,
          },
          () => slots.default?.(),
        )
    },
  })

export interface SliderTrackProps extends HTMLBeaeProps<"div"> {}

export const SliderTrack: ComponentWithProps<DeepPartial<SliderTrackProps>> =
  defineComponent({
    name: "SliderTrack",
    setup(props, { slots }) {
      const { getTrackProps, state } = useSliderContext()
      const styles = useSliderStyles()
      const trackProps = computed(() => {
        return {
          ...getTrackProps(props),
          reactive: state.value.value, // TODO: need to optimize
        }
      })

      return () =>
        h(
          beae.div,
          {
            ...trackProps.value,
            __label: cx("slider__track", props.class),
            __css: styles.value.track,
          },
          () => slots.default?.(),
        )
    },
  })

export interface SliderInnerTrackProps extends HTMLBeaeProps<"div"> {}

export const SliderFilledTrack: ComponentWithProps<
  DeepPartial<SliderInnerTrackProps>
> = defineComponent({
  name: "SliderFilledTrack",
  setup(props, { slots }) {
    const { getInnerTrackProps, state } = useSliderContext()
    const styles = useSliderStyles()
    const trackProps = computed(() => {
      return {
        ...getInnerTrackProps(props),
        reactive: state.value.value, // TODO: need to optimze
      }
    })

    return () =>
      h(
        beae.div,
        {
          ...trackProps.value,
          __label: cx("slider__filled-track", props.class),
          __css: styles.value.filledTrack,
        },
        () => slots.default?.(),
      )
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
    setup(props, { slots }) {
      const { getMarkerProps, state } = useSliderContext()
      const styles = useSliderStyles()
      const markProps = computed(() => {
        return {
          ...getMarkerProps(props),
          reactive: state.value.value, // TODO: need optimize
        }
      })
      return () =>
        h(
          beae.div,
          {
            ...markProps.value,
            __label: cx("slider__marker", props.class),
            __css: styles.value.mark,
          },
          () => slots.default?.(),
        )
    },
  })
