/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme-able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

/**
 * Hey! Welcome to @beae-ui/vue-next Input
 *
 * Input component is a component that is used to get user input in a text field
 *
 * @see Docs     https://next.vue.beae-ui.com/input
 * @see Source   https://github.com/beae-ui/beae-ui-vue-next/blob/master/packages/input/src/input/input.ts
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2
 */

import {
  h,
  defineComponent,
  PropType,
  toRefs,
  ToRefs,
  computed,
  reactive,
} from "vue"
import {
  beae,
  HTMLBeaeProps,
  ThemingProps,
  useMultiStyleConfig,
  omitThemingProps,
} from "@beae-ui/system"
import {
  FormControlOptions,
  formControlProps,
  useFormControl,
} from "../../form-control"
import { SAO, vueThemingProps } from "@beae-ui/prop-utils"

interface InputOptions {
  /**
   * The border color when the input is focused. Use color keys in `theme.colors`
   * @example
   * focusBorderColor = "blue.500"
   */
  focusBorderColor?: string
  /**
   * The border color when the input is invalid. Use color keys in `theme.colors`
   * @example
   * errorBorderColor = "red.500"
   */
  errorBorderColor?: string
  /**
   * If `true`, the input element will span the full width of its parent
   *
   * @deprecated
   * This component defaults to 100% width,
   *  please use the props `maxWidth` or `width` to configure
   */
  isFullWidth?: boolean
}

type Omitted = "disabled" | "required" | "readOnly" | "size"

interface InputNativeProps extends InputOptions, FormControlOptions {}

export interface InputProps
  extends Omit<HTMLBeaeProps<"span">, Omitted>,
    InputNativeProps,
    ThemingProps<"Input"> {
  modelValue: string
}

export const Input = defineComponent({
  name: "Input",
  props: {
    modelValue: String as PropType<string>,
    ...formControlProps,
    focusBorderColor: SAO as PropType<InputProps["focusBorderColor"]>,
    isFullWidth: [Boolean, Array] as PropType<InputProps["isFullWidth"]>,
    errorBorderColor: SAO as PropType<InputProps["errorBorderColor"]>,
    ...vueThemingProps,
  },
  emits: ["update:modelValue", "input", "change"],
  setup(props, { emit, attrs }) {
    const styles = useMultiStyleConfig("Input", props)
    const ownProps = computed(() =>
      toRefs(reactive(omitThemingProps(props as ThemingProps<"Input">))),
    )
    const input = useFormControl(ownProps.value as ToRefs<InputNativeProps>)

    const handleInput = (e: Event) => {
      emit("update:modelValue", (e?.currentTarget as HTMLInputElement)?.value)
      emit("input", e, (e?.currentTarget as HTMLInputElement)?.value)
      emit("change", e, (e?.currentTarget as HTMLInputElement)?.value)
    }

    return () =>
      h(beae.input, {
        __beaeIsRaw: true,
        ...input.value,
        value: props.modelValue,
        onInput: handleInput,
        __css: styles.value.field,
        __label: "input",
        ...attrs,
      })
  },
})

Input.id = "Input"
