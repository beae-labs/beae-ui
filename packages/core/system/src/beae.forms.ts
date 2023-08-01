import type { PropType, SetupContext } from "vue"
import type { UnionStringArray } from "@beae-ui/utils"

import { computed } from "vue"

const inputTypes = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const

export type InputTypes = UnionStringArray<typeof inputTypes>

export interface FormElementProps {
  emits: string[]
  props: Record<string, unknown>
  handleValueChange: (
    props: any,
    type?: InputTypes,
  ) => (emit: SetupContext["emit"]) => Record<string, unknown>
}

export const formElements: Record<string, FormElementProps> = {
  input: {
    emits: ["input", "change", "onUpdate:modelValue"],
    props: {
      modelValue: [Boolean, String] as PropType<boolean | string>,
    },
    handleValueChange(props: any, type?: InputTypes) {
      return (emit: SetupContext["emit"]) => {
        return {
          ...(type === "checkbox" && {
            checked: props.modelValue,
            // value: props.modelValue,
          }),
          onChange: (event: Event) => {
            if (type === "checkbox") {
              emit(
                "change",
                !(event?.target as HTMLInputElement).checked,
                event,
              )
              emit(
                "update:modelValue",
                !(event?.target as HTMLInputElement).checked,
                event,
              )
              return
            }
          },
          onInput: (event: any) => {
            emit(
              "input",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
            emit(
              "update:modelValue",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
          },
        }
      }
    },
  },
  textarea: {
    emits: ["input", "change", "onUpdate:modelValue"],
    props: {
      modelValue: [Boolean, String] as PropType<boolean | string>,
    },
    handleValueChange(props: any, type?: InputTypes) {
      return (emit: SetupContext["emit"]) => {
        return {
          onInput: (event: any) => {
            emit(
              "input",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
            emit(
              "update:modelValue",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
          },
        }
      }
    },
  },
  select: {
    emits: ["input", "change", "onUpdate:modelValue"],
    props: {
      modelValue: [Boolean, String] as PropType<boolean | string>,
    },
    handleValueChange(props: any, type?: InputTypes) {
      return (emit: SetupContext["emit"]) => {
        return {
          onChange: (event: any) => {
            emit(
              "input",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
            emit(
              "update:modelValue",
              (event?.currentTarget as HTMLInputElement).value,
              event,
            )
          },
        }
      }
    },
  },
}

export type BeaeFactoryElements = "input" | "select" | "textarea"

export function useFormElement(element: BeaeFactoryElements, props: any) {
  const elProps = computed(() => ({
    checked: props.modelValue,
    value: props.modelValue,
  }))

  return {
    elProps,
  }
}
