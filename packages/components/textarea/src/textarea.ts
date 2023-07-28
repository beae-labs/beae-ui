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

import { h, defineComponent, PropType } from "vue"
import { FormControlOptions, useFormControl } from "@beae-ui/form-control"
import {
  beae,
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  HTMLBeaeProps,
  useMultiStyleConfig,
} from "@beae-ui/system"
import { omit } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { formControlProps } from "@beae-ui/form-control"
import { filterUndefined } from "@beae-ui/utils"

interface TextareaOptions {
  /**
   * The border color when the textarea is focused. Use color keys in `theme.colors`
   * @example
   * focusBorderColor = "blue.500"
   */
  focusBorderColor?: string
  /**
   * The border color when the textarea is invalid. Use color keys in `theme.colors`
   * @example
   * errorBorderColor = "red.500"
   */
  errorBorderColor?: string
}

type Omitted = "disabled" | "required" | "readOnly"
export interface TextareaProps
  extends Omit<HTMLBeaeProps<"textarea">, Omitted>,
    TextareaOptions,
    FormControlOptions,
    ThemingProps<"Textarea"> {}

export const Textarea = defineComponent({
  name: "Textarea",
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: null,
    },
    rows: {
      type: String as PropType<string>,
      default: null,
    },
    errorBorderColor: String as PropType<TextareaProps["errorBorderColor"]>,
    focusBorderColor: String as PropType<TextareaProps["focusBorderColor"]>,
    ...formControlProps,
    ...vueThemingProps,
  },
  emits: ["update:modelValue", "input", "change"],
  setup(props, { emit, attrs }) {
    const styles = useMultiStyleConfig("Textarea", props)
    const { rows, ...rest } = omitThemingProps(props)

    // @ts-ignore
    const textareaProps = useFormControl(rest)

    const omitted = [
      "h",
      "minH",
      "height",
      "minHeight",
    ] as (keyof SystemStyleObject)[]

    const textareaStyles = rows ? omit(styles.value, omitted) : styles.value

    const handleInput = (e: Event) => {
      emit("update:modelValue", (e?.currentTarget as HTMLInputElement)?.value)
      emit("change", e, (e?.currentTarget as HTMLInputElement)?.value)
    }

    return () => {
      return h(beae.textarea, {
        __css: textareaStyles,
        class: ["beae-textarea"],
        rows,
        ...attrs,
        ...textareaProps.value,
        value: props.modelValue,
        onInput: handleInput,
        __beaeIsRaw: true,
      })
    }
  },
})
