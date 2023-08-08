// import { ComponentWithProps, DeepPartial } from "@beae-ui/system"
import { type PropType, defineComponent, h, computed } from "vue"
import {
  Modal,
  ModalContent,
  ModalProps,
  modalProps,
  // ModalContentProps,
} from "./modal"

export interface LAlertDialogProps
  extends Omit<ModalProps, "initialFocusRef" | "closeModal" | "handleEscape"> {
  leastDestructiveRef: ModalProps["initialFocusRef"]
}

/**
 * LAlertDialog
 * Data wrapper for the alert dialog component
 */

export const LAlertDialog = defineComponent({
  name: "LAlertDialog",
  props: {
    ...modalProps,
    leastDestructiveRef: [Function, String] as PropType<
      ModalProps["initialFocusRef"]
    >,
  },
  emits: ["update:modelValue", "close", "escape"],
  setup(props, { attrs, slots, emit }) {
    const isOpen = computed(() => props.modelValue!)

    const handleUpdateModelValue = (val: boolean) => {
      emit("update:modelValue", val)
    }

    return () => {
      const {
        modelValue,
        "onUpdate:modelValue": updateModelValue,
        ...rest
      } = props
      return h(
        // @ts-ignore
        Modal,
        {
          ...rest,
          ...attrs,
          modelValue: isOpen.value,
          /* eslint-disable-next-line */
          // @ts-ignore
          "onUpdate:modelValue": handleUpdateModelValue,
          label: "alertdialog",
          initialFocusRef: props.leastDestructiveRef,
        },
        slots,
      )
    }
  },
})

/**
 * LAlertDialogContent
 * Wrapper for the alert dialog content
 */

export const LAlertDialogContent = defineComponent({
  name: "LAlertDialogContent",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    // @ts-ignore
    return () => h(ModalContent, { ...attrs, role: "alertdialog" }, slots)
  },
})

export {
  ModalBody as LAlertDialogBody,
  ModalCloseButton as LAlertDialogCloseButton,
  ModalFooter as LAlertDialogFooter,
  ModalHeader as LAlertDialogHeader,
  ModalOverlay as LAlertDialogOverlay,
} from "./modal"
