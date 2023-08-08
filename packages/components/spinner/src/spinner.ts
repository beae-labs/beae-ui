import { type PropType, defineComponent, computed, h } from "vue"
import { SNAO, vueThemingProps } from "@beae-ui/prop-utils"
import {
  type DOMElements,
  type ThemingProps,
  type SystemStyleObject,
  type HTMLBeaeProps,
  keyframes,
  useStyleConfig,
  beae,
} from "@beae-ui/system"

import { VisuallyHidden } from "@beae-ui/visually-hidden"
import { mergeWith } from "@beae-ui/utils"

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
})

interface SpinnerOptions {
  /**
   * The color of the empty area in the spinner
   */
  emptyColor?: string
  /**
   * The color of the spinner
   */
  color?: string
  /**
   * The thickness of the spinner
   * @example
   * ```html
   * <Spinner thickness="4px"/>
   * ```
   */
  thickness?: string
  /**
   * The speed of the spinner.
   * @example
   * ```html
   * <Spinner speed="0.2s"/>
   * ```
   */
  speed?: string
  /**
   * For accessibility, it is important to add a fallback loading text.
   * This text will be visible to screen readers.
   */
  label?: string
}

export interface SpinnerProps
  extends SpinnerOptions,
    ThemingProps,
    HTMLBeaeProps<"div"> {
  color?: string
  as?: DOMElements
}

const defaultSpinnerProps = {
  as: "div",
  emptyColor: "transparent",
  thickness: "2px",
  speed: "0.45s",
}

const Spinner = defineComponent({
  props: {
    as: SNAO as PropType<SpinnerProps["as"]>,
    /**
     * The color of the empty area in the spinner
     */
    emptyColor: SNAO as PropType<SpinnerProps["emptyColor"]>,
    /**
     * The color of the spinner
     */
    color: SNAO as PropType<SpinnerProps["color"]>,
    /**
     * The thickness of the spinner
     * @example
     * ```html
     * <Spinner thickness="4px"/>
     * ```
     */
    thickness: SNAO as PropType<SpinnerProps["thickness"]>,
    /**
     * The speed of the spinner.
     * @example
     * ```html
     * <Spinner speed="0.2s"/>
     * ```
     */
    speed: SNAO as PropType<SpinnerProps["speed"]>,
    /**
     * For accessibility, it is important to add a fallback loading text.
     * This text will be visible to screen readers.
     */
    label: SNAO as PropType<SpinnerProps["label"]>,
    ...vueThemingProps,
  },
  setup(_props, { slots, attrs }) {
    const props = computed(() => mergeWith({}, defaultSpinnerProps, _props))
    const themingProps = computed<ThemingProps>(() => ({
      colorScheme: props.value.colorScheme,
      variant: props.value.variant,
      size: props.value.size,
      styleConfig: props.value.styleConfig,
    }))
    const styles = useStyleConfig("Spinner", themingProps)
    const spinnerStyles = computed<SystemStyleObject>(() => ({
      display: "inline-block",
      borderColor: "currentColor",
      borderStyle: "solid",
      borderRadius: "99999px",
      borderWidth: props.value.thickness,
      borderBottomColor: props.value.emptyColor,
      borderLeftColor: props.value.emptyColor,
      color: props.value.color,
      animation: `${spin} ${props.value.speed} linear infinite`,
      ...styles.value,
    }))

    return () =>
      h(
        beae.div,
        {
          as: props.value.as,
          __label: "spinner",
          __css: spinnerStyles.value,
          ...attrs,
        },
        props.value.label &&
          (() => [h(VisuallyHidden), () => props.value.label]),
      )
  },
})

export default Spinner
