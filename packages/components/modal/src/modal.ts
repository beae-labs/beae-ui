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

import {
  h,
  defineComponent,
  PropType,
  reactive,
  ComputedRef,
  toRefs,
  computed,
  ToRefs,
  mergeProps,
  UnwrapRef,
  watch,
  unref,
  withDirectives,
  watchEffect,
  onErrorCaptured,
  Ref,
} from "vue"
import {
  beae,
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  StylesProvider,
  SystemStyleObject,
  useMultiStyleConfig,
  useStyles,
} from "@beae-ui/system"
import { createContext, TemplateRef, useRef } from "@beae-ui/utils"
import { Portal, PortalProps } from "@beae-ui/portal"
import { FocusLockProps } from "@beae-ui/focus-lock"
import { LAnimatePresence, Motion } from "@beae-ui/motion"
import { CloseButton } from "@beae-ui/close-button"
import { MotionDirective, useMotions } from "@vueuse/motion"
import { useModal, UseModalOptions, UseModalReturn } from "./use-modal"
import { DialogMotionPreset, dialogMotionPresets } from "./modal-transitions"
import { Dict } from "@beae-ui/utils"
import { useId } from "@beae-ui/composables"

type ScrollBehavior = "inside" | "outside"

export interface ModalOptions
  extends Omit<
    FocusLockProps,
    "enabled" | "closeModal" | "isActive" | "handleEscape"
  > {
  /**
   *  If `true`, the modal will be centered on screen.
   * @default false
   */
  isCentered?: boolean
  /**
   * Where scroll behavior should originate.
   * - If set to `inside`, scroll only occurs within the `ModalBody`.
   * - If set to `outside`, the entire `ModalContent` will scroll within the viewport.
   *
   * @default "outside"
   */
  scrollBehavior?: ScrollBehavior
}

export interface ModalProps
  extends Omit<
      UnwrapRef<UseModalOptions>,
      "closeModal" | "handleEscape" | "modelValue"
    >,
    Pick<PortalProps, "label">,
    ModalOptions {
  /**
   * If `true`, the modal will display
   *
   * @default true
   */
  modelValue: boolean
  /**
   * If `false`, focus lock will be disabled completely.
   *
   * This is useful in situations where you still need to interact with
   * other surrounding elements.
   *
   * 🚨Warning: We don't recommend doing this because it hurts the
   * accessibility of the modal, based on WAI-ARIA specifications.
   *
   * @default true
   */
  trapFocus?: boolean
  /**
   * If `true`, the modal will autofocus the first enabled and interactive
   * element within the `ModalContent`
   *
   * @default true
   */
  autoFocus?: boolean
  /**
   * If `true`, the modal will return focus to the element that triggered it when it closes.
   * @default true
   */
  returnFocusOnClose?: boolean
  /**
   * If `true`, scrolling will be disabled on the `body` when the modal opens.
   *  @default true
   */
  blockScrollOnMount?: boolean
  /**
   * Handle zoom/pinch gestures on iOS devices when scroll locking is enabled.
   * Defaults to `false`.
   */
  allowPinchZoom?: boolean
  /**
   * If `true`, a `padding-right` will be applied to the body element
   * that's equal to the width of the scrollbar.
   *
   * This can help prevent some unpleasant flickering effect
   * and content adjustment when the modal opens
   */
  preserveScrollBarGap?: boolean
  /**
   * The transition that should be used for the modal
   */
  motionPreset?: DialogMotionPreset
  /**
   * Modal style config
   */
  styleConfig?: Dict

  /**
   * Typescript helper for parent components
   */
  "onUpdate:modelValue"?: any
  onClose?: any
}

type IUseModalOptions = ToRefs<
  Omit<
    ModalProps,
    | "closeModal"
    | "handleEscape"
    | "preserveScrollBarGap"
    | "allowPinchZoom"
    | "trapFocus"
    | "autoFocus"
    | "modelValue"
  >
>

interface ModalContext extends IUseModalOptions, UseModalReturn {
  dialogRef: (el: TemplateRef) => void
  overlayRef: (el: TemplateRef) => void
  closeModal: () => void
  modelValue: Ref<boolean>
}

type CModalReactiveContext = ComputedRef<ModalContext>

const [ModalContextProvider, useModalContext] =
  createContext<CModalReactiveContext>({
    strict: true,
    name: "ModalContext",
    errorMessage:
      "useModalContext: `context` is undefined. Seems you forgot to wrap modal components in `<Modal />`",
  })

export { ModalContextProvider, useModalContext }

export const modalProps = {
  modelValue: {
    type: Boolean as PropType<ModalProps["modelValue"]>,
    default: false,
  },
  id: String as PropType<ModalProps["id"]>,
  closeOnOverlayClick: {
    type: Boolean as PropType<ModalProps["closeOnOverlayClick"]>,
    default: true,
  },
  closeOnEsc: {
    type: Boolean as PropType<ModalProps["closeOnEsc"]>,
    default: true,
  },
  useInert: {
    type: Boolean as PropType<ModalProps["useInert"]>,
    default: true,
  },
  autoFocus: {
    type: Boolean as PropType<ModalProps["autoFocus"]>,
    default: true,
  },
  trapFocus: {
    type: Boolean as PropType<ModalProps["trapFocus"]>,
    default: true,
  },
  initialFocusRef: [String, Object, Function] as PropType<
    ModalProps["initialFocusRef"]
  >,
  finalFocusRef: [String, Object, Function] as PropType<
    ModalProps["finalFocusRef"]
  >,
  returnFocusOnClose: {
    type: Boolean as PropType<ModalProps["returnFocusOnClose"]>,
    default: true,
  },
  blockScrollOnMount: {
    type: Boolean as PropType<ModalProps["blockScrollOnMount"]>,
    default: true,
  },
  allowPinchZoom: Boolean as PropType<ModalProps["allowPinchZoom"]>,
  preserveScrollBarGap: Boolean as PropType<ModalProps["preserveScrollBarGap"]>,
  scrollBehavior: {
    type: String as PropType<ModalProps["scrollBehavior"]>,
    default: "outside",
  },
  motionPreset: {
    type: String as PropType<ModalProps["motionPreset"]>,
    default: "scale",
  },
  "onUpdate:modelValue": {
    type: Function as PropType<(arg: any) => any>,
  },
  label: {
    type: String as PropType<ModalProps["label"]>,
    default: "modal",
  },
}

export const Modal: ComponentWithProps<ModalProps> = defineComponent({
  name: "Modal",
  props: modalProps,
  emits: ["update:modelValue", "escape", "closeModal"],
  setup(props, { slots, attrs, emit }) {
    const closeModal = () => {
      emit("closeModal", false)
      emit("update:modelValue", false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      emit("escape", event)
      emit("closeModal", false)
    }

    const mergedProps = computed(() => mergeProps(props, attrs))

    const styles = useMultiStyleConfig("Modal", mergedProps)
    const modalOptions = reactive({
      ...toRefs(reactive(props)),
      closeModal,
      handleEscape,
    })
    // @ts-expect-error
    const modal = useModal(modalOptions)

    ModalContextProvider(
      computed(() => ({
        ...modal,
        ...toRefs(reactive(props)),
        closeModal,
      })),
    )

    onErrorCaptured((error, target) => {
      console.error(`beaeModalCapturedError`, error, target)
    })

    StylesProvider(styles)
    return () =>
      h(Portal, { label: props.label }, () => [
        // props.modelValue && h(beae('span'), () => slots?.default?.()),
        h(LAnimatePresence, { type: props.motionPreset }, () => [
          props.modelValue && h(beae("span"), () => slots?.default?.()),
        ]),
      ])
  },
})

export interface ModalContentProps extends HTMLBeaeProps<"section"> {
  role?: string
}

/**
 * ModalContent is used to group modal's content. It has all the
 * necessary `aria-*` properties to indicate that it is a modal
 */
export const ModalContent: ComponentWithProps<DeepPartial<ModalContentProps>> =
  defineComponent({
    name: "ModalContent",
    inheritAttrs: false,
    emits: ["click", "mousedown", "keydown"],
    setup(_, { attrs, slots, emit }) {
      const {
        dialogContainerProps,
        dialogProps,
        blockScrollOnMount,
        modelValue,
        motionPreset,
      } = unref(useModalContext())
      const styles = useStyles()
      const transitionId = useId("modal-content")

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

      return () => {
        return h(
          // @ts-ignore
          beae("div", {
            label: "modal__content-container",
            __css: dialogContainerStyles.value,
          }),
          dialogContainerProps.value({ emit }),
          () => [
            modelValue!.value &&
              withDirectives(
                h(
                  beae("section", {
                    __css: dialogStyles.value,
                    label: "modal__content",
                  }),
                  {
                    ...dialogProps.value({ emit }),
                    ...attrs,
                  },
                  slots,
                ),
                [
                  [
                    MotionDirective(dialogMotionPresets[motionPreset?.value!]),
                    transitionId.value,
                  ],
                ],
              ),
          ],
        )
      }
    },
  })

/**
 * ModalOverlay renders a backdrop behind the modal. It is
 */
export const ModalOverlay: ComponentWithProps<
  DeepPartial<HTMLBeaeProps<"div">>
> = defineComponent({
  name: "ModalOverlay",
  setup(_, { attrs }) {
    const styles = useStyles()
    const overlayStyle = computed<SystemStyleObject>(() => ({
      pos: "fixed",
      left: "0",
      top: "0",
      w: "100vw",
      h: "100vh",
      // @ts-ignore
      ...styles.value.overlay,
    }))
    return () =>
      h(
        // @ts-ignore
        Motion,
        {
          type: "fade",
        },
        () => [
          h(
            beae("div", {
              label: "modal__overlay",
              __css: overlayStyle.value,
            }),
            attrs,
          ),
        ],
      )
  },
})

/**
 * ModalHeader
 */
export const ModalHeader: ComponentWithProps<
  DeepPartial<HTMLBeaeProps<"header">>
> = defineComponent({
  name: "ModalHeader",
  setup(_, { attrs, slots }) {
    const { hasHeader, headerId } = unref(useModalContext())
    const styles = useStyles()
    const headerStyles = computed<SystemStyleObject>(() => ({
      flex: 0,
      // @ts-ignore
      ...styles.value.header,
    }))

    const [headerRef, headerEl] = useRef()

    watch(headerEl, (el) => {
      hasHeader.value = !!el
    })

    return () =>
      h(
        beae("header", {
          label: "modal__header",
          __css: headerStyles.value,
        }),
        {
          ...attrs,
          ref: headerRef,
          id: headerId.value,
        },
        slots,
      )
  },
})

/**
 * ModalBody
 *
 */
export const ModalBody: ComponentWithProps<DeepPartial<HTMLBeaeProps<"div">>> =
  defineComponent({
    name: "ModalBody",
    setup(_, { slots, attrs }) {
      const { bodyId, hasBody } = unref(useModalContext())
      const styles = useStyles()

      const [bodyRef, bodyEl] = useRef()

      /**
       * Used to bind the `aria-descibedby` attribute
       */
      watch(bodyEl, (el) => {
        hasBody.value = !!el
      })

      return () =>
        h(
          beae("div", {
            label: "modal__body",
            // @ts-ignore
            __css: styles.value.body,
          }),
          {
            id: bodyId.value,
            ...attrs,
            ref: bodyRef,
          },
          slots,
        )
    },
  })

/**
 * ModalFooter
 */
export const ModalFooter: ComponentWithProps<
  DeepPartial<HTMLBeaeProps<"footer">>
> = defineComponent({
  name: "ModalFooter",
  setup(_, { slots, attrs }) {
    const styles = useStyles()

    const footerStyles = computed<SystemStyleObject>(() => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      // @ts-ignore
      ...styles.value.footer,
    }))

    return () =>
      h(
        beae("div", {
          label: "modal__body",
          __css: footerStyles.value,
        }),
        attrs,
        slots,
      )
  },
})

/**
 * ModalCloseButton
 *
 */
export const ModalCloseButton: ComponentWithProps<
  DeepPartial<HTMLBeaeProps<"button">>
> = defineComponent({
  name: "ModalCloseButton",
  emits: ["click"],
  setup(_, { attrs, emit }) {
    const { closeModal } = unref(useModalContext())
    const styles = useStyles()

    return () =>
      h(
        beae(CloseButton, {
          label: "modal__close-button",
          // @ts-ignore
          __css: styles.value.closeButton,
        }),
        {
          ...attrs,
          onClick: (e: MouseEvent | TouchEvent) => {
            closeModal()
            emit("click", e)
          },
        },
      )
  },
})