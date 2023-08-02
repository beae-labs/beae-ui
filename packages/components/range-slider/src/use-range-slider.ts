import { ariaAttr, callAllHandlers, dataAttr } from "@beae-ui/utils"
import {
  percentToValue,
  roundValueToStep,
  valueToPercent,
  clampValue,
} from "../number-utils" // TODO: need to add to the package
import { useSizes } from "../utils" // TODO: need to add to the package
import { getIds, getIsReversed, getStyles, orient } from "./slider-utils"
import {
  CSSProperties,
  ComputedRef,
  Ref,
  ToRef,
  computed,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue"
import type { RequiredPropGetter, PropGetter } from "../types" // TODO: need to add to the package
import { usePanEvent } from "@beae-ui/composables"

export interface UseRangeSliderProps {
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
  value?: number[]
  /**
   * The initial value of the slider in uncontrolled mode
   */
  defaultValue?: number[]
  /**
   * Orientation of the slider
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"
  /**
   * If `true`, the value will be incremented or decremented in reverse.
   * @default false
   */
  isReversed?: boolean

  /**
   * Function called when the user starts selecting a new value (by dragging or clicking)
   */
  // TODO: need convert to all event vue => @onChangeStart
  onChangeStart?(value: number[]): void

  /**
   * Function called when the user is done selecting a new value (by dragging or clicking)
   */
  onChangeEnd?(value: number[]): void

  /**
   * Function called whenever the slider value changes  (by dragging or clicking)
   */
  onChange?(value: number[]): void

  /**
   * The base `id` to use for the slider and its components
   */
  id?: string
  /**
   * The name attribute of the hidden `input` field.
   * This is particularly useful in forms
   */
  name?: string | string[]
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
  "aria-valuetext"?: string[]
  /**
   * The static string to use used for `aria-label`
   * if no visible label is used.
   */
  "aria-label"?: string[]
  /**
   * The static string `aria-labelledby` that points to the
   * ID of the element that serves as label for the slider
   */
  "aria-labelledby"?: string[]
  /**
   * The writing mode
   * @default "ltr"
   */
  direction?: "ltr" | "rtl"
  /**
   * The minimum distance between slider thumbs. Useful for preventing
   * the thumbs from being too close together.
   * @default 0
   */
  minStepsBetweenThumbs?: number
}

export interface RangeSliderState {
  value: number[]
  isFocused: boolean
  isDragging: boolean
  getThumbPercent: (index: number) => number
  getThumbMinValue: (index: number) => number
  getThumbMaxValue: (index: number) => number
}

export interface RangeSliderActions {
  setValueAtIndex(index: number, val: number): void
  setActiveIndex(value: number): void
  stepUp(index: number, step?: number): void
  stepDown(index: number, step?: number): void
  reset(): void
}

/**
 * React hook that implements an accessible range slider.
 *
 * It is an alternative to `<input type="range" />`, and returns
 * prop getters for the component parts
 *
 * @see Docs     https://beae-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb/
 */
export function useRangeSlider(props: UseRangeSliderProps) {
  const {
    min = 0,
    max = 100,
    onChange,
    value: valueProp,
    defaultValue,
    isReversed: isReversedProp,
    direction = "ltr",
    orientation,
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
    minStepsBetweenThumbs = 0,
    ...htmlProps
  } = props
  const isReversed = getIsReversed({
    isReversed: isReversedProp,
    direction,
    orientation,
  })
  const valueState = ref(valueProp ?? defaultValue ?? [25, 75])

  if (!Array.isArray(valueState.value)) {
    throw new TypeError(
      `[range-slider] You passed an invalid value for \`value\` or \`defaultValue\`, expected \`Array\` but got \`${typeof valueState}\``,
    )
  }

  const isDragging = ref(false)
  const isFocused = ref(false)
  const activeIndex = ref(-1)

  const isInteractive = !(isDisabled || isReadOnly)

  const initialValue = valueState.value
  const valueComputed = computed<number[]>(() => valueState.value)

  const spacing = minStepsBetweenThumbs * step
  const valueBounds = computed(() =>
    getValueBounds(valueComputed.value, min, max, spacing),
  )
  const eventSource = ref<"pointer" | "keyboard" | null>(null)

  const stateRef = computed<{
    eventSource: "pointer" | "keyboard" | null
    value: number[]
    valueBounds: Array<{ min: number; max: number }>
  }>(() => {
    return {
      eventSource: eventSource.value,
      value: valueState.value,
      valueBounds: getValueBounds(valueComputed.value, min, max, spacing),
    }
  })

  const thumbPercents = computed(() => {
    const reversedValue = valueComputed.value.map((val) => max - val + min)
    const thumbValues = isReversed ? reversedValue : valueComputed.value
    return thumbValues.map((val) => valueToPercent(val, min, max))
  })

  const isVertical = computed(() => orientation === "vertical")

  const trackRef = ref<HTMLElement>()
  const rootRef = ref<HTMLElement>()

  const thumbRects = useSizes({
    getNodes() {
      const rootNode = rootRef.value as HTMLElement
      const thumbNodes =
        rootNode !== undefined
          ? rootNode?.querySelectorAll<HTMLElement>("[role=slider]")
          : []
      return thumbNodes ? Array.from(thumbNodes) : []
    },
  })

  const newId = Math.random().toString(36).substr(2, 9)
  const uuid = idProp ?? newId
  const ids = getIds(uuid)

  const getValueFromPointer = (event: any) => {
    if (!trackRef.value) return
    eventSource.value = "pointer"
    const rect = trackRef.value.$el.getBoundingClientRect()
    const { clientX, clientY } = event.touches?.[0] ?? event

    const diff = isVertical.value ? rect.bottom - clientY : clientX - rect.left
    const length = isVertical.value ? rect.height : rect.width

    let percent = diff / length
    if (isReversed) percent = 1 - percent

    return percentToValue(percent, min, max)
  }

  const tenSteps = (max - min) / 10
  const oneStep = step || (max - min) / 100
  const actions: RangeSliderActions = reactive({
    setValueAtIndex(index: number, val: number) {
      if (!isInteractive) return
      const bounds = valueBounds.value[index]
      val = parseFloat(roundValueToStep(val, bounds.min, oneStep))
      val = clampValue(val, bounds.min, bounds.max)
      const next = [...stateRef.value.value]
      next[index] = val
      valueState.value = next
      onChange?.(next)
    },
    setActiveIndex: (val: number) => (activeIndex.value = val),
    stepUp(index: number, step = oneStep) {
      const valueAtIndex = stateRef.value.value[index]
      const next = isReversed ? valueAtIndex - step : valueAtIndex + step
      actions.setValueAtIndex(index, next)
    },
    stepDown(index: number, step = oneStep) {
      const valueAtIndex = stateRef.value.value[index]
      const next = isReversed ? valueAtIndex + step : valueAtIndex - step
      actions.setValueAtIndex(index, next)
    },
    reset() {
      valueState.value = initialValue.value
      onChange?.(initialValue.value)
    },
  })

  /**
   * Keyboard interaction to ensure users can operate
   * the slider using only their keyboard.
   */
  const onKeyDown = (event) => {
    const eventKey = event.key
    const keyMap: Record<string, any> = {
      ArrowRight: () => actions.stepUp(activeIndex.value),
      ArrowUp: () => actions.stepUp(activeIndex.value),
      ArrowLeft: () => actions.stepDown(activeIndex.value),
      ArrowDown: () => actions.stepDown(activeIndex.value),
      PageUp: () => actions.stepUp(activeIndex.value, tenSteps),
      PageDown: () => actions.stepDown(activeIndex.value, tenSteps),
      Home: () => {
        const { min: value } = valueBounds.value[activeIndex.value]
        actions.setValueAtIndex(activeIndex.value, value)
      },
      End: () => {
        const { max: value } = valueBounds.value[activeIndex.value]
        actions.setValueAtIndex(activeIndex.value, value)
      },
    }

    const action = keyMap[eventKey]

    if (action) {
      event.preventDefault()
      event.stopPropagation()
      action(event)
      eventSource.value = "keyboard"
    }
  }

  /**
   * Compute styles for all component parts.
   */
  const computedStyle: ComputedRef<{
    trackStyle: CSSProperties
    innerTrackStyle: CSSProperties
    rootStyle: CSSProperties
    getThumbStyle: (i: number) => CSSProperties
  }> = computed(
    () =>
      getStyles({
        isReversed,
        orientation,
        thumbRects,
        thumbPercents: thumbPercents.value,
      }) ?? {},
  )

  const focusThumb = (index?: number) => {
    const idx: number = index ?? activeIndex.value
    if (idx !== -1 && focusThumbOnChange) {
      const id = ids.getThumb(idx)
      const thumb = rootRef.value?.ownerDocument.getElementById(id)
      if (thumb) {
        setTimeout(() => thumb.focus())
      }
    }
  }

  watch(valueComputed, () => {
    if (stateRef.value.eventSource === "keyboard") {
      onChangeEndProp?.(stateRef.value.value)
    }
  })

  const onPanSessionStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const pointValue = getValueFromPointer(event) || 0
    const distances = valueState.value.map((val) => Math.abs(val - pointValue))

    const closest = Math.min(...distances)
    let index = distances.indexOf(closest)

    // check if the clicked thumb is stacked by checking if there are multiple
    // thumbs at the same distance
    const thumbsAtPosition = distances.filter(
      (distance) => distance === closest,
    )
    const isThumbStacked = thumbsAtPosition.length > 1

    // when two thumbs are stacked and the user clicks at a point larger than
    // their values, pick the last thumb with the greatest index
    if (isThumbStacked && pointValue > valueState.value[index]) {
      index = index + thumbsAtPosition.length - 1
    }

    activeIndex.value = index
    actions.setValueAtIndex(index, pointValue)
    focusThumb(index)
  }

  const onPan = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (activeIndex.value == -1) return
    const pointValue = getValueFromPointer(event) || 0
    // activeIndex.value = activeIndex.value
    actions.setValueAtIndex(activeIndex.value, pointValue)
    focusThumb(activeIndex.value)
  }
  onMounted(() => {
    if (rootRef.value) {
      usePanEvent(rootRef, {
        onPanSessionStart(event) {
          if (!isInteractive) return
          isDragging.value = true
          onPanSessionStart(event)
          onChangeStartProp?.(stateRef.value.value)
        },
        onPanSessionEnd() {
          if (!isInteractive) return
          isDragging.value = false
          onChangeEndProp?.(stateRef.value.value)
        },
        onPan(event) {
          if (!isInteractive) return
          onPan(event)
        },
      })
    }
  })

  const getRootProps: PropGetter = (props = {}) => {
    return {
      ...props,
      ...htmlProps,
      id: ids.root,
      tabIndex: -1,
      "aria-disabled": ariaAttr(isDisabled),
      "data-focused": dataAttr(isFocused.value),
      style: { ...props.style, ...computedStyle.value.rootStyle },
    }
  }

  const getTrackProps: PropGetter = (props = {}) => {
    return {
      ...props,
      id: ids.track,
      ref: trackRef,
      "data-disabled": dataAttr(isDisabled),
      style: { ...props.style, ...computedStyle.value.trackStyle },
    }
  }

  const getInnerTrackProps: PropGetter = (props = {}) => {
    return {
      ...props,
      id: ids.innerTrack,
      style: {
        ...props.style,
        ...computedStyle.value.innerTrackStyle,
      },
    }
  }

  const getThumbProps: RequiredPropGetter<{ index: number }> = (props) => {
    const { index, ...rest } = props

    const valueAtIndex = valueComputed.value[index]
    if (valueAtIndex == null) {
      throw new TypeError(
        `[range-slider > thumb] Cannot find value at index \`${index}\`. The \`value\` or \`defaultValue\` length is : ${valueComputed.value.length}`,
      )
    }

    const bounds = valueBounds.value[index]

    return {
      ...rest,
      role: "slider",
      tabIndex: isInteractive ? 0 : undefined,
      id: ids.getThumb(index),
      "data-active": dataAttr(isDragging && activeIndex.value === index),
      "aria-valuetext":
        getAriaValueTextProp?.(valueAtIndex) ?? ariaValueText?.[index],
      "aria-valuemin": bounds.min,
      "aria-valuemax": bounds.max,
      "aria-valuenow": valueAtIndex,
      "aria-orientation": orientation,
      "aria-disabled": ariaAttr(isDisabled),
      "aria-readonly": ariaAttr(isReadOnly),
      "aria-label": ariaLabel?.[index],
      "aria-labelledby": ariaLabel?.[index]
        ? undefined
        : ariaLabelledBy?.[index],
      style: { ...props.style, ...computedStyle.value.getThumbStyle(index) },
      onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
      onFocus: callAllHandlers(props.onFocus, () => {
        isFocused.value = true
        activeIndex.value = index
      }),
      onBlur: callAllHandlers(props.onBlur, () => {
        isFocused.value = false
        activeIndex.value = -1
      }),
    }
  }

  const getOutputProps: PropGetter = (props = {}) => {
    return {
      ...props,
      id: ids.output,
      htmlFor: valueComputed.value.map((v, i) => ids.getThumb(i)).join(" "),
      "aria-live": "off",
    }
  }

  const getMarkerProps: RequiredPropGetter<{ value: number }> = (props) => {
    const { value: v, ...rest } = props

    const isInRange = !(v < min || v > max)
    const isHighlighted =
      v >= valueComputed.value[0] &&
      v <= valueComputed.value[valueComputed.value.length - 1]

    let percent = valueToPercent(v, min, max)
    percent = isReversed ? 100 - percent : percent

    const markerStyle: CSSProperties = {
      position: "absolute",
      pointerEvents: "none",
      ...orient({
        orientation: orientation ?? "horizontal",
        vertical: { bottom: `${percent}%` },
        horizontal: { left: `${percent}%` },
      }),
    }

    return {
      ...rest,
      id: ids.getMarker(props.value),
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

  const getInputProps: RequiredPropGetter<{ index: number }> = (props) => {
    const { index, ...rest } = props
    return {
      ...rest,
      id: ids.getInput(index),
      type: "hidden",
      value: valueComputed.value[index],
      name: Array.isArray(name) ? name[index] : `${name}-${index}`,
    }
  }

  const state = computed<ComputedRef<RangeSliderState>>(() => {
    return {
      value: valueComputed.value,
      isFocused: isFocused.value,
      isDragging: isFocused.value,
      getThumbPercent: (index: number) => thumbPercents.value[index],
      getThumbMinValue: (index: number) => valueBounds.value[index].min,
      getThumbMaxValue: (index: number) => valueBounds.value[index].max,
    }
  })

  return {
    state,
    actions,
    getRootProps,
    getTrackProps,
    getInnerTrackProps,
    getThumbProps,
    getMarkerProps,
    getInputProps,
    getOutputProps,
    rootRef,
  }
}

export type UseRangeSliderReturn = ReturnType<typeof useRangeSlider>

function getValueBounds(
  arr: number[],
  min: number,
  max: number,
  spacing: number,
) {
  return arr.map((v, i) => {
    const _min = i === 0 ? min : arr[i - 1] + spacing
    const _max = i === arr.length - 1 ? max : arr[i + 1] - spacing
    return { min: _min, max: _max }
  })
}
