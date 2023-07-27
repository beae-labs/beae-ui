import {
  computed,
  ComputedRef,
  defineComponent,
  PropType,
  h,
  unref,
  withDirectives,
  watch,
  watchEffect,
} from "vue"
import {
  SlideDirection,
  TransitionVariants,
  slideTransition,
  placementToVariant,
} from "@beae-ui/motion"
import { createContext } from "@beae-ui/utils"
import {
  beae,
  ComponentWithProps,
  HTMLBeaeProps,
  SystemStyleObject,
  useStyles,
  useTheme,
} from "@beae-ui/system"

import { Modal, ModalProps, modalProps, useModalContext } from "./modal"
import { MotionDirective, useMotions } from "@vueuse/motion"
import { useId } from "@beae-ui/composables"

interface DrawerOptions {
  /**
   * The placement of the drawer
   */
  placement?: SlideDirection
  /**
   * If `true` and drawer's placement is `top` or `bottom`,
   * the drawer will occupy the viewport height (100vh)
   */
  isFullHeight?: boolean
}

export interface DrawerProps extends Omit<ModalProps, "scrollBehavior"> {
  /**
   * The placement of the drawer
   */
  placement?: SlideDirection
  /**
   * If `true` and drawer's placement is `top` or `bottom`,
   * the drawer will occupy the viewport height (100vh)
   */
  isFullHeight?: boolean

  modelValue: boolean
}

type DrawerContext = ComputedRef<DrawerOptions>

const [DrawerContextProvider, useDrawerContext] = createContext<DrawerContext>()

export const Drawer: ComponentWithProps<DrawerProps> = defineComponent({
  name: "Drawer",
  props: {
    ...modalProps,
    placement: {
      type: String as PropType<SlideDirection>,
      default: "right",
    },
    isFullHeight: Boolean as PropType<boolean>,
  },
  emits: ["update:modelValue", "close", "escape"],
  setup(props, { slots, attrs, emit }) {
    const isOpen = computed(() => props.modelValue!)

    const handleUpdateModelValue = (val: boolean) => {
      emit("update:modelValue", val)
    }

    const context: DrawerContext = computed(() => ({
      placement: props.placement,
      motionPreset: "scale",
    }))

    const theme = useTheme()
    const drawerStyleConfig = theme.components?.Drawer

    DrawerContextProvider(context)

    return () => {
      const {
        modelValue,
        "onUpdate:modelValue": updateModelValue,
        ...rest
      } = props
      return h(
        Modal,
        {
          ...rest,
          ...attrs,
          modelValue: isOpen.value,
          /* eslint-disable-next-line */
          // @ts-ignore
          "onUpdate:modelValue": handleUpdateModelValue,
          label: "drawer",
          styleConfig: drawerStyleConfig,
        },
        slots,
      )
    }
  },
})

export interface DrawerContentProps extends HTMLBeaeProps<"section"> {}

export const DrawerContent: ComponentWithProps<DrawerContentProps> =
  defineComponent({
    name: "DrawerContent",
    inheritAttrs: false,
    emits: ["click", "mousedown", "keydown"],
    setup(_, { attrs, slots, emit }) {
      const {
        dialogContainerProps: rawDialogContainerProps,
        dialogProps: rawDialogProps,
        modelValue,
        blockScrollOnMount,
      } = unref(useModalContext())
      const transitionId = useId("drawer-transition")

      const containerProps = computed(() =>
        rawDialogContainerProps.value({ emit }),
      )
      const dialogProps = computed(() => rawDialogProps.value({ emit }))
      const { placement } = unref(useDrawerContext())

      // Styles
      const styles = useStyles()
      const dialogContainerStyles = computed<SystemStyleObject>(() => ({
        display: "flex",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        // @ts-ignore
        ...styles.value.dialogContainer,
      }))

      const dialogStyles = computed<SystemStyleObject>(() => ({
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
        outline: 0,
        // @ts-ignore
        ...styles.value.dialog,
      }))

      // Scroll lock
      watchEffect((onInvalidate) => {
        if (!blockScrollOnMount!.value) return
        if (modelValue.value !== true) return

        let overflow = document.documentElement.style.overflow
        let paddingRight = document.documentElement.style.paddingRight

        let scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth

        document.documentElement.style.overflow = "hidden"
        document.documentElement.style.paddingRight = `${scrollbarWidth}px`

        onInvalidate(() => {
          document.documentElement.style.overflow = overflow
          document.documentElement.style.paddingRight = paddingRight
        })
      })

      /** Handles exit transition */
      const leave = (done: VoidFunction) => {
        const motions = useMotions()
        const instance = motions[transitionId.value]
        instance?.leave(() => {
          done()
        })
      }

      watch(modelValue!, (newVal) => {
        if (!newVal) {
          leave(() => null)
        }
      })

      const transitionStyles = computed<object>(() => {
        const transitionStyles = slideTransition({ direction: placement })
        const result = Object.assign(
          { position: "fixed" },
          transitionStyles.position,
        )
        return result
      })

      const transitionVariant = computed(() => placementToVariant(placement!))

      return () => {
        return h(
          beae.div,
          {
            ...containerProps.value,
            __label: "modal__content-container",
            __css: dialogContainerStyles.value,
          },
          () => [
            modelValue!.value &&
              withDirectives(
                h(
                  beae.section,
                  {
                    ...dialogProps.value,
                    style: transitionStyles.value,
                    __css: dialogStyles.value,
                    ...attrs,
                  },
                  slots,
                ),
                [
                  [
                    MotionDirective(
                      TransitionVariants[transitionVariant.value],
                    ),
                    transitionId.value,
                  ],
                ],
              ),
          ],
        )
      }
    },
  })

export {
  ModalBody as DrawerBody,
  ModalCloseButton as DrawerCloseButton,
  ModalFooter as DrawerFooter,
  ModalHeader as DrawerHeader,
  ModalOverlay as DrawerOverlay,
} from "./modal"
