import { defineComponent, h, defineProps } from "vue"
// import {DiamondAlertMinor, CircleAlertMajor} from '@shopify/polaris-icons';

import { Icon } from "../Icon"
import type { Error } from "../../types"
// import { useFeatures } from '@beae-ui/utils';

const styles = {
  InlineError: "inline-error",
  Icon: "inline-error-icon",
}

export interface InlineErrorProps {
  /** Content briefly explaining how to resolve the invalid form field input. */
  message: Error
  /** Unique identifier of the invalid form field that the message describes */
  fieldID: string
}

export const InlineError = defineComponent({
  props: { ...({} as InlineErrorProps) },
  setup(props, { slots }) {
    // const { polarisSummerEditions2023 } = useFeatures();
    const polarisSummerEditions2023 = ""

    if (!props.message) {
      return null
    }

    return () =>
      h(
        "div",
        {
          id: errorTextID(fieldID),
          class: styles.InlineError,
        },
        [
          h(
            "div",
            { class: styles.Icon },
            h("Icon", {
              source: polarisSummerEditions2023
                ? CircleAlertMajor
                : DiamondAlertMinor,
            }),
          ),
          props.message,
        ],
      )
  },
})

export function errorTextID(id: string) {
  return `${id}Error`
}
