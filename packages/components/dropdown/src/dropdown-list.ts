import { callAll } from "@beae-ui/utils"
import {
  beae,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"

import { HTMLMotionProps, motion } from "framer-motion" //TODO: for dropdown

import { useDropdownStyles } from "./dropdown"
import { useDropdownList, useDropdownPositioner } from "./use-dropdown-list"
import { useDropdownContext } from "./use-common"
import { defineComponent, PropType, h } from "vue"

export interface DropdownListProps extends HTMLBeaeProps<"div"> {
  /**
   * Props for the root element that positions the menu.
   */
  rootProps?: HTMLBeaeProps<"div">
  /**
   * The framer-motion props to animate the menu list
   */
  motionProps?: HTMLMotionProps<"div">
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

const MenuTransition = beae(motion.div)

export const DropdownList: ComponentWithProps<DeepPartial<DropdownListProps>> =
  defineComponent({
    props: {
      rootProps: String as PropType<DropdownListProps["rootProps"]>,
      motionProps: String as PropType<DropdownListProps["motionProps"]>,
      zIndex: String as PropType<DropdownListProps["zIndex"]>,
    },
    setup(props, { attrs, slots }) {
      const { rootProps, motionProps, zIndex, ...rest } = props

      const dropContext = useDropdownContext()
      const listProps = useDropdownList(rest) as any
      const positionerProps = useDropdownPositioner(rootProps)
      const styles = useDropdownStyles()
      return () =>
        h(
          beae.div,
          {
            ...positionerProps,
            __css: { zIndex: zIndex ?? styles.list?.zIndex },
          },
          [
            h(MenuTransition, {
              variants: motionVariants,
              initial: false,
              animate: dropContext.isOpen ? "enter" : "exit",
              __css: { outline: 0, ...styles.list },
              ...motionProps,
              ...listProps,
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
