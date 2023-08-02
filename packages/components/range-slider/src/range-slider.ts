import { createContext, cx } from "@beae-ui/utils"
import {
  beae,
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
import { PropType, defineComponent, computed, h, reactive, watch } from "vue"

interface RangeSliderContext
  extends Omit<UseRangeSliderReturn, "getRootProps"> {
  name?: string | string[]
}

const [RangeSliderProvider, useRangeSliderContext] = createContext<
  ComputedRef<RangeSliderContext>
>({
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
        default: 1,
      },
      max: {
        type: Number as PropType<RangeSliderProps["max"]>,
        default: 100,
      },
      step: Number as PropType<RangeSliderProps["step"]>,
      value: Array as PropType<RangeSliderProps["value"]>,
      defaultValue: Array as PropType<RangeSliderProps["defaultValue"]>,
      orientation: {
        type: String as PropType<RangeSliderProps["orientation"]>,
        default: () => "horizontal",
      },
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
      const sliderProps = computed(() => props)

      const styles = useMultiStyleConfig("Slider", sliderProps)
      const ownProps = reactive(omitThemingProps(sliderProps.value))

      const { direction } = useTheme()
      ownProps.direction = direction

      const { rootRef, getRootProps, ...context } = useRangeSlider(ownProps)
      const ctx = computed(() => {
        return { ...context, name: sliderProps.value.name }
      })

      RangeSliderProvider(ctx)
      RangeSliderStylesProvider(styles)
      return () =>
        h(
          beae.div,
          {
            ref: rootRef,
            class: "beae-slider",
            __css: styles.value.container,
          },
          () => slots.default?.(),
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
    const { getThumbProps, getInputProps, name, state } =
      useRangeSliderContext().value
    const styles = useRangeSliderStyles()
    const thumbProps = computed(() => {
      return {
        ...getThumbProps(props),
        value: state.value.value, // TODO: need optimize
      }
    })
    return () =>
      h(
        beae.div,
        {
          ...thumbProps.value,
          class: cx("beae-slider__thumb", props.class),
          __css: styles.value.thumb,
        },
        () => [
          slots.default?.(),
          name && h(beae.input, { ...getInputProps({ index: props.index }) }),
        ],
      )
  },
})

export interface RangeSliderTrackProps extends HTMLBeaeProps<"div"> {}

export const RangeSliderTrack: ComponentWithProps<
  DeepPartial<RangeSliderTrackProps>
> = defineComponent({
  name: "RangeSliderTrack",
  setup(props, { slots }) {
    const { getTrackProps } = useRangeSliderContext().value
    const trackProps = getTrackProps(props)
    const styles = useRangeSliderStyles()
    return () =>
      h(
        beae.div,
        {
          ...trackProps,
          class: cx("beae-slider__track", props.class),
          __css: styles.value.track,
          "data-testid": "beae-range-slider-track",
        },
        () => slots.default?.(),
      )
  },
})

export interface RangeSliderInnerTrackProps extends HTMLBeaeProps<"div"> {}

// export const RangeSliderFilledTrack: ComponentWithProps<DeepPartial<RangeSliderInnerTrackProps>> = defineComponent({

export const RangeSliderFilledTrack = defineComponent({
  name: "RangeSliderFilledTrack",
  setup(props, { slots }) {
    const { getInnerTrackProps, state } = useRangeSliderContext().value
    const styles = useRangeSliderStyles()
    const trackProps = computed(() => {
      return {
        value: state.value.value, // TODO: need optimize
        ...getInnerTrackProps(props),
      }
    })

    return () =>
      h(
        beae.div,
        {
          ...trackProps.value,
          class: "beae-slider__filled-track",
          __css: styles.value.filledTrack,
        },
        () => slots.default?.(),
      )
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
  setup(props, { slots }) {
    const { getMarkerProps } = useRangeSliderContext().value
    const styles = useRangeSliderStyles()
    const markProps = getMarkerProps(props)
    return () =>
      h(
        beae.div,
        {
          ...markProps,
          class: cx("beae-slider__marker", props.class),
          __css: styles.value.mark,
        },
        () => slots.default?.(),
      )
  },
})
