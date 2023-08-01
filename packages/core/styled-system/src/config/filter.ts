import type * as CSS from "csstype"
import type { Config } from "../utils/prop-config"
import type { Length, Token } from "../utils"

import { t, transforms } from "../utils"

export const filter: Config = {
  filter: { transform: transforms.filter },
  blur: t.blur("--beae-blur"),
  brightness: t.propT("--beae-brightness", transforms.brightness),
  contrast: t.propT("--beae-contrast", transforms.contrast),
  hueRotate: t.degreeT("--beae-hue-rotate"),
  invert: t.propT("--beae-invert", transforms.invert),
  saturate: t.propT("--beae-saturate", transforms.saturate),
  dropShadow: t.propT("--beae-drop-shadow", transforms.dropShadow),
  backdropFilter: { transform: transforms.backdropFilter },
  backdropBlur: t.blur("--beae-backdrop-blur"),
  backdropBrightness: t.propT(
    "--beae-backdrop-brightness",
    transforms.brightness,
  ),
  backdropContrast: t.propT("--beae-backdrop-contrast", transforms.contrast),
  backdropHueRotate: t.degreeT("--beae-backdrop-hue-rotate"),
  backdropInvert: t.propT("--beae-backdrop-invert", transforms.invert),
  backdropSaturate: t.propT("--beae-backdrop-saturate", transforms.saturate),
}

export interface FilterProps {
  /**
   * The CSS `filter` property. When set to `auto`, you allow
   * Beae UI to define the color based on the filter style props
   * (`blur`, `saturate`, etc.)
   */
  filter?: Token<CSS.Property.Filter | "auto">
  /**
   * Sets the blur filter value of an element.
   * Value is assigned to `--beae-filter` css variable
   */
  blur?: Token<{}, "blur">
  /**
   * Sets the brightness filter value of an element.
   * Value is assigned to `--beae-brightness` css variable
   */
  brightness?: Token<Length>
  /**
   * Sets the contrast filter value of an element.
   * Value is assigned to `--beae-contrast` css variable
   */
  contrast?: Token<Length>
  /**
   * Sets the hue-rotate filter value of an element.
   * Value is assigned to `--beae-hue-rotate` css variable
   */
  hueRotate?: Token<Length>
  /**
   * Sets the invert filter value of an element.
   * Value is assigned to `--beae-invert` css variable
   */
  invert?: Token<Length>
  /**
   * Sets the saturation filter value of an element.
   * Value is assigned to `--beae-saturate` css variable
   */
  saturate?: Token<Length>
  /**
   * Sets the drop-shadow filter value of an element.
   * Value is assigned to `--beae-drop-shadow` css variable
   */
  dropShadow?: Token<CSS.Property.BoxShadow, "shadows">
  /**
   * The CSS `backdrop-filter` property. When set to `auto`, you allow
   * Beae UI to define the color based on the backdrop filter style props
   * (`backdropBlur`, `backdropSaturate`, etc.)
   */
  backdropFilter?: Token<CSS.Property.BackdropFilter | "auto">
  /**
   * Sets the backdrop-blur filter value of an element.
   * Value is assigned to `--beae-backdrop-blur` css variable
   */
  backdropBlur?: Token<{}, "blur">
  /**
   * Sets the backdrop-brightness filter value of an element.
   * Value is assigned to `--beae-backdrop-brightness` css variable
   */
  backdropBrightness?: Token<Length>
  /**
   * Sets the backdrop-contrast filter value of an element.
   * Value is assigned to `--beae-backdrop-contrast` css variable
   */
  backdropContrast?: Token<Length>
  /**
   * Sets the backdrop-hue-rotate filter value of an element.
   * Value is assigned to `--beae-backdrop-hue-rotate` css variable
   */
  backdropHueRotate?: Token<Length>
  /**
   * Sets the backdrop-invert filter value of an element.
   * Value is assigned to `--beae-backdrop-invert` css variable
   */
  backdropInvert?: Token<Length>
  /**
   * Sets the backdrop-saturate filter value of an element.
   * Value is assigned to `--beae-backdrop-saturate` css variable
   */
  backdropSaturate?: Token<Length>
}
