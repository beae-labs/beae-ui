import { type PropType, defineComponent, h } from "vue"
import { type SelectFieldProps } from "./select.types"
import { beae } from "@beae-ui/system"

export const SelectField = defineComponent({
  name: "SelectField",
  props: {
    placeholder: String as PropType<SelectFieldProps["placeholder"]>,
    isDisabled: Boolean as PropType<SelectFieldProps["isDisabled"]>,
    modelValue: [String, Number] as PropType<string | number>,
  },
  emits: ["update:modelValue"],
  setup(props, { slots, attrs, emit }) {
    function onChange(event: Event) {
      emit("update:modelValue", (event.target as HTMLSelectElement)?.value)
    }

    return () =>
      h(
        beae.select,
        {
          __label: "select",
          disabled: props.isDisabled,
          value: props.modelValue,
          onChange,
          ...attrs,
        },
        () => [
          props.placeholder &&
            h(
              "option",
              {
                value: "",
              },
              props.placeholder,
            ),
          slots.default?.(),
        ],
      )
  },
})
