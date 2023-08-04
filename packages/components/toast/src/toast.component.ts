import { runIfFn } from "@beae-ui/shared-utils"
import { motion, useIsPresent, Variants } from "framer-motion"
import { beae } from "@beae-ui/system"
import type { ToastOptions } from "./toast.types"
import { getToastStyle, useTimeout } from "./toast.utils"
import { ToastProviderProps } from "./toast.provider"
import { computed, defineComponent, h, PropType, ref, watch } from "vue"
const toastMotionVariants: Variants = {
  initial: (props) => {
    const { position } = props

    const dir = ["top", "bottom"].includes(position) ? "y" : "x"

    let factor = ["top-right", "bottom-right"].includes(position) ? 1 : -1
    if (position === "bottom") factor = 1

    return {
      opacity: 0,
      [dir]: factor * 24,
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
}

export interface ToastComponentProps
  extends ToastOptions,
    Pick<ToastProviderProps, "motionVariants" | "toastSpacing"> {}

export const ToastComponent = defineComponent({
  name: "ToastComponent",
  props: {
    id: String as PropType<ToastComponentProps["id"]>,
    message: {} as PropType<ToastComponentProps["message"]>,
    onCloseComplete: Function as PropType<
      ToastComponentProps["onCloseComplete"]
    >,
    onRequestRemove: Function as PropType<
      ToastComponentProps["onRequestRemove"]
    >,
    requestClose: {
      type: Boolean as PropType<ToastComponentProps["requestClose"]>,
      default: false,
    },
    position: {
      type: String as PropType<ToastComponentProps["position"]>,
      default: "bottom",
    },
    duration: {
      type: Number as PropType<ToastComponentProps["duration"]>,
      default: 5000,
    },
    containerStyle: String as PropType<ToastComponentProps["containerStyle"]>,
    motionVariants: {
      type: {} as PropType<ToastComponentProps["motionVariants"]>,
      default: toastMotionVariants,
    },
    toastSpacing: {
      type: String as PropType<ToastComponentProps["toastSpacing"]>,
      default: () => "0.5rem",
    },
  },
  setup(props, {}) {
    const {
      id,
      message,
      onCloseComplete,
      onRequestRemove,
      requestClose,
      position,
      duration,
      containerStyle,
      motionVariants,
      toastSpacing,
    } = props

    console.log(props, "toast")
    const delay = ref(duration)
    const isPresent = useIsPresent()

    watch(isPresent, () => {
      if (!isPresent) {
        onCloseComplete?.()
      }
    })
    watch(duration, () => {
      delay.value = duration
    })

    const onMouseEnter = () => (delay.value = null)
    const onMouseLeave = () => (delay.value = duration)

    const close = () => {
      if (isPresent) onRequestRemove()
    }

    watch(
      [isPresent, requestClose],
      (isPresentValue, requestCloseVAlue) => {
        if (isPresentValue && requestCloseVAlue) {
          onRequestRemove()
        }
      },
      {
        immediate: true,
      },
    )

    useTimeout(close, delay)

    const containerStyles = computed(() => {
      return {
        pointerEvents: "auto",
        maxWidth: 560,
        minWidth: 300,
        margin: toastSpacing,
        ...containerStyle,
      }
    })

    const toastStyle = computed(() => getToastStyle(position))

    return () =>
      h(
        motion.div,
        {
          layout,
          __label: "toast",
          variants: motionVariants,
          initial: "initial",
          animate: "animate",
          exit: "exit",
          onHoverStart: onMouseEnter,
          onHoverEnd: onMouseLeave,
          custom: { position },
          __css: toastStyle.value,
        },
        () =>
          h(
            beae.div,
            {
              role: "status",
              "aria-atomic": "true",
              __label: "toast__inner",
              __css: containerStyles,
            },
            () => runIfFn(message, { id, onClose: close }),
          ),
      )
  },
})
