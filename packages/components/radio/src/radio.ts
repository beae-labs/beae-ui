/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import {
  InputHTMLAttributes,
  PropType,
  defineComponent,
  h,
  reactive,
  ref,
  toRefs,
} from "vue"
import {
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
  ThemingProps,
  SystemProps,
  useMultiStyleConfig,
  omitThemingProps,
  SystemStyleObject,
  beae,
  layoutPropNames,
} from "@beae-ui/system"
import { UseRadioProps, useRadio } from "./use-radio"
import { vueThemingProps } from "../../../utilities/prop-utils/src"
import { useRadioGroupContext } from "./radio-group"
import { getValidChildren, split } from "@beae-ui/utils"

type RadioControlProps = Omit<HTMLBeaeProps<"div">, keyof UseRadioProps>

export interface RadioProps
  extends HTMLBeaeProps<"input">,
    ThemingProps<"Radio">,
    UseRadioProps,
    RadioControlProps {
  /**
   * The spacing between the checkbox and its label text
   * @default 0.5rem
   * @type SystemProps["marginLeft"]
   */
  spacing?: SystemProps["marginLeft"]
  /**
   * Additional props to be forwarded to the `input` element
   */
  inputProps?: InputHTMLAttributes
}

/**
 * Radio component is used in forms when a user needs to select a single value from
 * several options.
 *
 * @see Docs https://ui.beae.com/radio
 */
// @ts-ignore TODO: fix Radio Type DeepPartial cannot read
export const Radio: ComponentWithProps<DeepPartial<RadioProps>> =
  defineComponent({
    name: "Radio",
    props: {
      id: String as PropType<RadioProps["id"]>,
      name: String as PropType<RadioProps["name"]>,
      spacing: [String, Number] as PropType<RadioProps["spacing"]>,
      inputProps: Object as PropType<RadioProps["inputProps"]>,
      value: String as PropType<RadioProps["value"]>,
      defaultChecked: Boolean as PropType<RadioProps["defaultChecked"]>,
      isChecked: Boolean as PropType<RadioProps["isChecked"]>,
      isDisabled: Boolean as PropType<RadioProps["isDisabled"]>,
      isFocusable: Boolean as PropType<RadioProps["isFocusable"]>,
      isReadOnly: Boolean as PropType<RadioProps["isReadOnly"]>,
      isInvalid: Boolean as PropType<RadioProps["isInvalid"]>,
      isRequired: Boolean as PropType<RadioProps["isRequired"]>,
      dataRadiogroup: [String, Number, Object, Function] as PropType<
        RadioProps["data-radiogroup"]
      >,
      ariaDescribedby: String as PropType<RadioProps["aria-describedby"]>,
      modelValue: String as PropType<string>,
      ...vueThemingProps,
    },
    emits: ["change", "update:modelValue"],
    setup(props, { slots }) {
      const group = useRadioGroupContext()
      const ownProps = omitThemingProps(props)

      const {
        spacing = "0.5rem",
        isDisabled = group?.value.isDisabled,
        isFocusable = group?.value.isFocusable,
        inputProps: htmlInputProps,
        ...rest
      } = ownProps

      const isChecked = ref<boolean | undefined>(props.isChecked)
      if (group?.value?.value != null && props.value != null) {
        isChecked.value = group?.value.value === props.value
      }

      const name = props?.name ?? group?.value?.name

      ///
      // Interact use-radio hooks
      ///
      const {
        getLabelProps,
        getInputProps,
        getRadioProps,
        getRootProps,
        htmlProps,
      } = useRadio(
        toRefs(
          reactive({
            ...rest,
            isChecked: isChecked.value,
            isFocusable,
            isDisabled,
            name,
          }),
        ),
      )

      ///
      // Handle styles
      ///
      const styles = useMultiStyleConfig("Radio", { ...group, ...props })
      const rootStyles: SystemStyleObject = {
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "top",
        cursor: "pointer",
        position: "relative",
        ...styles.value?.container,
      }
      const checkboxStyles: SystemStyleObject = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...styles.value?.control,
      }
      const labelStyles: SystemStyleObject = {
        userSelect: "none",
        marginStart: spacing,
        ...styles.value?.label,
      }

      const [layoutProps, otherProps] = split(htmlProps, layoutPropNames as any)

      return () => {
        const children = getValidChildren(slots)
        const hasChildren = children.length

        const labelProps = getLabelProps()
        const inputProps = getInputProps(htmlInputProps)
        const radioProps = getRadioProps(otherProps)

        return h(
          beae.label,
          {
            __label: "radio",
            __css: rootStyles,
            ...Object.assign({}, layoutProps, getRootProps()),
          },
          () => [
            h(beae.input, {
              __label: "radio__input",
              ...inputProps,
            }),
            h(beae.span, {
              __label: "radio__control",
              __css: checkboxStyles,
              ...radioProps.value,
            }),
            hasChildren &&
              h(
                beae.span,
                {
                  __label: "radio__label",
                  __css: labelStyles,
                  ...labelProps,
                },
                slots,
              ),
          ],
        )
      }
    },
  })
