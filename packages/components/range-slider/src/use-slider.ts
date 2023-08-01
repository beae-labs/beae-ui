import { usePanEvent } from "@beae-ui/composables"
import { useSize } from "../utils"
import type { PropGetter, RequiredPropGetter } from "../types"
import {
  clampValue,
  percentToValue,
  roundValueToStep,
  valueToPercent,
} from "../number-utils"
import { ariaAttr, callAllHandlers, dataAttr } from "@beae-ui/utils"
import { getIsReversed, getStyles } from "./slider-utils"
import { CSSProperties, ComputedRef, computed, reactive, ref, watch } from "vue"

export interface UseSliderProps {
  /**
   * The minimum allowed value of the slider. Cannot be greater than max.
   * @default 0
   */
  min?: number
  /**
   * The maximum allowed value of the slider. Cannot be less than min.
   * @default 100
   */
  max?: number
  /**
   * The step in which increments/decrements have to be made
   * @default 1
   */
  step?: number
  /**
   * The value of the slider in controlled mode
   */
  value?: number
  /**
   * The initial value of the slider in uncontrolled mode
   */
  defaultValue?: number
  /**
   * Orientation of the slider
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"
  /**
   * If `true`, the value will be incremented or decremented in reverse.
   */
  isReversed?: boolean
  /**
   * Function called when the user starts selecting a new value (by dragging or clicking)
   */
  onChangeStart?(value: number): void
  /**
   * Function called when the user is done selecting a new value (by dragging or clicking)
   */
  onChangeEnd?(value: number): void
  /**
   * Function called whenever the slider value changes  (by dragging or clicking)
   */
  onChange?(value: number): void
  /**
   * The base `id` to use for the slider and its components
   */
  id?: string
  /**
   * The name attribute of the hidden `input` field.
   * This is particularly useful in forms
   */
  name?: string
  /**
   * If `true`, the slider will be disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * If `true`, the slider will be in `read-only` state
   * @default false
   */
  isReadOnly?: boolean
  /**
   * Function that returns the `aria-valuetext` for screen readers.
   * It is mostly used to generate a more human-readable
   * representation of the value for assistive technologies
   */
  getAriaValueText?(value: number): string
  /**
   * If `false`, the slider handle will not capture focus when value changes.
   * @default true
   */
  focusThumbOnChange?: boolean
  /**
   * The static string to use used for `aria-valuetext`
   */
  "aria-valuetext"?: string
  /**
   * The static string to use used for `aria-label`
   * if no visible label is used.
   */
  "aria-label"?: string
  /**
   * The static string `aria-labelledby` that points to the
   * ID of the element that serves as label for the slider
   */
  "aria-labelledby"?: string
  /**
   * The writing mode
   * @default "ltr"
   */
  direction?: "ltr" | "rtl"
}

export interface SliderState {
  value: number
  isFocused: boolean
  isDragging: boolean
}

export interface SliderActions {
  stepUp(step?: number): void
  stepDown(step?: number): void
  reset(): void
  stepTo(value: number): void
}

/**
 * React hook that implements an accessible range slider.
 *
 * It is an alternative to `<input type="range" />`, and returns
 * prop getters for the component parts
 *
 * @see Docs     https://beae-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export function useSlider(props: UseSliderProps) {
  const {
    min = 0,
    max = 100,
    onChange,
    value: valueProp,
    defaultValue,
    isReversed: isReversedProp,
    direction = "ltr",
    orientation = "horizontal",
    id: idProp,
    isDisabled,
    isReadOnly,
    onChangeStart: onChangeStartProp,
    onChangeEnd: onChangeEndProp,
    step = 1,
    getAriaValueText: getAriaValueTextProp,
    "aria-valuetext": ariaValueText,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    name,
    focusThumbOnChange = true,
    ...htmlProps
  } = props

  const isReversed = getIsReversed({
    isReversed: isReversedProp,
    direction,
    orientation,
  })

  /**
   * Enable the slider handle controlled and uncontrolled scenarios
   */
  const computedValue = ref(
    valueProp ?? defaultValue ?? getDefaultValue(min, max),
  )

  const isDragging = ref(false)
  const isFocused = ref(false)

  const isInteractive = !(isDisabled || isReadOnly)

  const tenSteps = (max - min) / 10
  const oneStep = step || (max - min) / 100

  /**
   * Constrain the value because it can't be less than min
   * or greater than max
   */
  const value = clampValue(computedValue.value, min, max)
  const reversedValue = max - value + min
  const trackValue = isReversed ? reversedValue : value
  const thumbPercent = valueToPercent(trackValue, min, max)

  const isVertical = orientation === "vertical"

  const stateRef = reactive({
    min,
    max,
    step,
    isDisabled,
    value,
    isInteractive,
    isReversed,
    isVertical,
    eventSource: null as "pointer" | "keyboard" | null,
    focusThumbOnChange,
    orientation,
  })

  /**
   * Let's keep a reference to the slider track and thumb
   */
  const trackRef = ref<HTMLElement>()
  const thumbRef = ref<HTMLElement>()
  const rootRef = ref<HTMLElement>()

  /**
   * Generate unique ids for component parts
   */
  const newId = Math.random().toString(36).substr(2, 9)
  const uuid = idProp ?? newId
  const [thumbId, trackId] = [`slider-thumb-${uuid}`, `slider-track-${uuid}`]

  /**
   * Get relative value of slider from the event by tracking
   * how far you clicked within the track to determine the value
   *
   * @todo - Refactor this later on to use info from pan session
   */

  const getValueFromPointer = (event: any) => {
    if (!trackRef.value) return

    const state = stateRef
    state.eventSource = "pointer"

    const trackRect = trackRef.value.getBoundingClientRect()
    const { clientX, clientY } = event.touches?.[0] ?? event

    const diff = isVertical
      ? trackRect.bottom - clientY
      : clientX - trackRect.left

    const length = isVertical ? trackRect.height : trackRect.width
    let percent = diff / length

    if (isReversed) {
      percent = 1 - percent
    }

    let nextValue = percentToValue(percent, state.min, state.max)

    if (state.step) {
      nextValue = parseFloat(roundValueToStep(nextValue, state.min, state.step))
    }

    nextValue = clampValue(nextValue, state.min, state.max)

    return nextValue
  }

  const constrain = (value: number) => {
    const state = stateRef
    if (!state.isInteractive) return
    value = parseFloat(roundValueToStep(value, state.min, oneStep))
    value = clampValue(value, state.min, state.max)
    computedValue.value = value
    onChange?.(value)
  }

  const actions = computed<SliderActions>(() => ({
    stepUp(step = oneStep) {
      const next = isReversed ? value - step : value + step
      constrain(next)
    },
    stepDown(step = oneStep) {
      const next = isReversed ? value + step : value - step
      constrain(next)
    },
    reset() {
      constrain(defaultValue || 0)
    },
    stepTo(value: number) {
      constrain(value)
    },
  }))

  /**
   * Keyboard interaction to ensure users can operate
   * the slider using only their keyboard.
   */
  const onKeyDown = (event: KeyboardEvent) => {
    const state = stateRef

    const keyMap: Record<string, KeyboardEvent> = {
      ArrowRight: () => actions.stepUp(),
      ArrowUp: () => actions.stepUp(),
      ArrowLeft: () => actions.stepDown(),
      ArrowDown: () => actions.stepDown(),
      PageUp: () => actions.stepUp(tenSteps),
      PageDown: () => actions.stepDown(tenSteps),
      Home: () => constrain(state.min),
      End: () => constrain(state.max),
    }

    const action = keyMap[event.key]

    if (action) {
      event.preventDefault()
      event.stopPropagation()
      action(event)
      state.eventSource = "keyboard"
    }
  }

  /**
   * ARIA (Optional): To define a human-readable representation of the value,
   * we allow users pass aria-valuetext.
   */
  const valueText = getAriaValueTextProp?.(value) ?? ariaValueText

  /**
   * Measure the dimensions of the thumb, so
   * we can center it within the track properly
   */
  const thumbSize = useSize(thumbRef)

  /**
   * Compute styles for all component parts.
   */
  let getThumbStyle: (i: number) => CSSProperties,
    rootStyle: CSSProperties = {},
    trackStyle: CSSProperties = {},
    innerTrackStyle: CSSProperties = {}
  const computedStyle: ComputedRef<{
    trackStyle: CSSProperties
    innerTrackStyle: CSSProperties
    rootStyle: CSSProperties
    getThumbStyle: (i: number) => CSSProperties
  }> = computed(() => {
    const state = stateRef

    const thumbRect = thumbSize ?? { width: 0, height: 0 }
    return getStyles({
      isReversed,
      orientation: state.orientation,
      thumbRects: [thumbRect],
      thumbPercents: [thumbPercent],
    })
  })
  watch(
    computedStyle,
    (val: {
      trackStyle: CSSProperties
      innerTrackStyle: CSSProperties
      rootStyle: CSSProperties
      getThumbStyle: (i: number) => CSSProperties
    }) => {
      getThumbStyle = val.getThumbStyle
      ;(rootStyle = val.rootStyle),
        (trackStyle = val.trackStyle),
        (innerTrackStyle = val.innerTrackStyle)
    },
  )

  const focusThumb = () => {
    const state = stateRef
    if (state.focusThumbOnChange) {
      setTimeout(() => thumbRef.value?.focus())
    }
  }

  watch(value, () => {
    const state = stateRef
    focusThumb()
    if (state.eventSource === "keyboard") {
      onChangeEndProp?.(state.value)
    }
  })

  function setValueFromPointer(event: MouseEvent | TouchEvent | PointerEvent) {
    const nextValue = getValueFromPointer(event)
    if (nextValue != null && nextValue !== stateRef.value) {
      computedValue.value = nextValue
      onChange?.(nextValue)
    }
  }

  usePanEvent(rootRef, {
    onPanSessionStart(event) {
      const state = stateRef
      if (!state.isInteractive) return
      isDragging.value = true
      focusThumb()
      setValueFromPointer(event)
      onChangeStartProp?.(state.value)
    },
    onPanSessionEnd() {
      const state = stateRef
      if (!state.isInteractive) return
      isDragging.value = false
      onChangeEndProp?.(state.value)
    },
    onPan(event) {
      const state = stateRef
      if (!state.isInteractive) return
      setValueFromPointer(event)
    },
  })

  const getRootProps: PropGetter = (props = {}) => {
    return {
      ...props,
      ...htmlProps,
      tabIndex: -1,
      "aria-disabled": ariaAttr(isDisabled),
      "data-focused": dataAttr(isFocused.value),
      style: {
        ...props.style,
        ...rootStyle,
      },
    }
  }

  const getTrackProps: PropGetter = (props = {}) => {
    return {
      ...props,
      id: trackId,
      "data-disabled": dataAttr(isDisabled),
      style: {
        ...props.style,
        ...trackStyle,
      },
    }
  }

  const getInnerTrackProps: PropGetter = (props = {}) => {
    return {
      ...props,
      ref,
      style: {
        ...props.style,
        ...innerTrackStyle,
      },
    }
  }

  const getThumbProps: PropGetter = (props = {}) => {
    return {
      ...props,
      role: "slider",
      tabIndex: isInteractive ? 0 : undefined,
      id: thumbId,
      "data-active": dataAttr(isDragging.value),
      "aria-valuetext": valueText,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": value,
      "aria-orientation": orientation,
      "aria-disabled": ariaAttr(isDisabled),
      "aria-readonly": ariaAttr(isReadOnly),
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabel ? undefined : ariaLabelledBy,
      style: {
        ...props.style,
        ...getThumbStyle(0),
      },
      onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
      onFocus: callAllHandlers(props.onFocus, () => (isFocused.value = true)),
      onBlur: callAllHandlers(props.onBlur, () => (isFocused.value = false)),
    }
  }

  const getMarkerProps: RequiredPropGetter<{ value: number }> = (
    props,
    ref = null,
  ) => {
    const isInRange = !(props.value < min || props.value > max)
    const isHighlighted = value >= props.value
    const markerPercent = valueToPercent(props.value, min, max)

    const markerStyle: React.CSSProperties = {
      position: "absolute",
      pointerEvents: "none",
      ...orient({
        orientation: orientation,
        vertical: {
          bottom: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`,
        },
        horizontal: {
          left: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`,
        },
      }),
    }

    return {
      ...props,
      ref,
      role: "presentation",
      "aria-hidden": true,
      "data-disabled": dataAttr(isDisabled),
      "data-invalid": dataAttr(!isInRange),
      "data-highlighted": dataAttr(isHighlighted),
      style: {
        ...props.style,
        ...markerStyle,
      },
    }
  }

  const getInputProps: PropGetter = computed(() => (props = {}, ref = null) => {
    return {
      ...props,
      ref,
      type: "hidden",
      value,
      name,
    }
  })

  const state: SliderState = {
    value,
    isFocused: isFocused.value,
    isDragging: isDragging.value,
  }

  return {
    state,
    actions,
    getRootProps,
    getTrackProps,
    getInnerTrackProps,
    getThumbProps,
    getMarkerProps,
    getInputProps,
  }
}

export type UseSliderReturn = ReturnType<typeof useSlider>

function orient(options: {
  orientation: UseSliderProps["orientation"]
  vertical: React.CSSProperties
  horizontal: React.CSSProperties
}) {
  const { orientation, vertical, horizontal } = options
  return orientation === "vertical" ? vertical : horizontal
}

/**
 * The browser <input type="range" /> calculates
 * the default value of a slider by using mid-point
 * between the min and the max.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
 */
function getDefaultValue(min: number, max: number) {
  return max < min ? min : min + (max - min) / 2
}
