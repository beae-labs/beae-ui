import type * as CSS from "csstype"
import type { Config } from "../utils/prop-config"
import type { Token } from "../utils"

import { t } from "../utils"

export const transition: Config = {
  transition: true,
  transitionDelay: true,
  animation: true,
  willChange: true,
  transitionDuration: t.prop("transitionDuration", "transition.duration"),
  transitionProperty: t.prop("transitionProperty", "transition.property"),
  transitionTimingFunction: t.prop(
    "transitionTimingFunction",
    "transition.easing",
  ),
}

export interface TransitionProps {
  /**
   * The CSS `transition` property
   */
  transition?: Token<CSS.Property.Transition>
  /**
   * The CSS `transition-property` property
   */
  transitionProperty?: Token<CSS.Property.TransitionProperty>
  /**
   * The CSS `transition-timing-function` property
   */
  transitionTimingFunction?: Token<CSS.Property.TransitionTimingFunction>
  /**
   * The CSS `transition-duration` property
   */
  transitionDuration?: Token<string>
  /**
   * The CSS `transition-delay` property
   */
  transitionDelay?: Token<CSS.Property.TransitionDelay>
  /**
   * The CSS `animation` property
   */
  animation?: Token<CSS.Property.Animation>
  /**
   * The CSS `will-change` property
   */
  willChange?: Token<CSS.Property.WillChange>
}
