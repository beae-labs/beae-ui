import type * as CSS from "csstype"
import type { Config } from "../utils/prop-config"
import type { Length, Token } from "../utils"

import { t, transforms } from "../utils"

/**
 * The parser configuration for common outline properties
 */
export const ring: Config = {
  ring: { transform: transforms.ring },
  ringColor: t.colors("--beae-ring-color"),
  ringOffset: t.prop("--beae-ring-offset-width"),
  ringOffsetColor: t.colors("--beae-ring-offset-color"),
  ringInset: t.prop("--beae-ring-inset"),
}

export interface RingProps {
  /**
   * Creates outline rings with CSS `box-shadow` property
   */
  ring?: Token<Length>
  /**
   * The color of the outline ring
   */
  ringColor?: Token<CSS.Property.Color, "colors">
  /**
   * The thickness of the offset shadow when using outline rings
   */
  ringOffset?: Token<Length>
  /**
   * The color of the offset shadow when adding outline rings
   */
  ringOffsetColor?: Token<CSS.Property.Color, "colors">
  /**
   * If the outline ring should an `inset`
   */
  ringInset?: Token<"inset" | "none">
}
