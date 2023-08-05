import { callAll, cx } from "@beae-ui/utils"
import {
  beae,
  forwardRef,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"

import { useDropdownStyles } from "./dropdown"
import {
  useDropdownContext,
  useDropdownList,
  useDropdownPositioner,
} from "./use-dropdown"
import { defineComponent, PropType, h } from "vue"

export interface DropdownListProps extends HTMLBeaeProps<"div"> {
  /**
   * Props for the root element that positions the menu.
   */
  rootProps?: HTMLBeaeProps<"div">
  /**
   * The framer-motion props to animate the menu list
   */
  motionProps?: HTMLBeaeProps<"div">

  zIndex?: string
}

const motionVariants = {
  enter: {
    visibility: "visible",
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    transitionEnd: {
      visibility: "hidden",
    },
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      easings: "easeOut",
    },
  },
}

const MenuTransition = beae("div")

export const DropdownList: ComponentWithProps<DeepPartial<DropdownListProps>> =
  defineComponent({
    props: {
      rootProps: String as PropType<DropdownListProps["rootProps"]>,
      motionProps: String as PropType<DropdownListProps["motionProps"]>,
      zIndex: String as PropType<DropdownListProps["zIndex"]>,
    },
    setup(props, { attrs, slots }) {
      const dropContext = useDropdownContext()
      const listProps = useDropdownList(props) as any
      const positionerProps = useDropdownPositioner(props.rootProps)
      const styles = useDropdownStyles()
      return () =>
        h(
          beae.div,
          {
            ...positionerProps,
            __css: { zIndex: props?.zIndex ?? styles.list?.zIndex },
          },
          [
            h(MenuTransition, {
              variants: motionVariants,
              initial: false,
              animate: dropContext.isOpen ? "enter" : "exit",
              __css: { outline: 0, ...styles.list },
              ...props.motionProps,
              className: `chakra-menu__menu-list " ${listProps.className}`,
              listProps,
              onUpdate: dropContext.onTransitionEnd,
              onAnimationComplete: callAll(
                dropContext.animated.onComplete,
                listProps.onAnimationComplete,
              ),
            }),
          ],
        )
    },
  })
DropdownList.displayName = "DropdownList"
