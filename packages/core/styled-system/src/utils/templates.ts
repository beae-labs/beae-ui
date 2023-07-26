/**
 * The CSS transform order following the upcoming spec from CSSWG
 * translate => rotate => scale => skew
 * @see https://drafts.csswg.org/css-transforms-2/#ctm
 * @see https://www.stefanjudis.com/blog/order-in-css-transformation-transform-functions-vs-individual-transforms/
 */
const transformTemplate = [
  "rotate(var(--beae-rotate, 0))",
  "scaleX(var(--beae-scale-x, 1))",
  "scaleY(var(--beae-scale-y, 1))",
  "skewX(var(--beae-skew-x, 0))",
  "skewY(var(--beae-skew-y, 0))",
]

export function getTransformTemplate() {
  return [
    "translateX(var(--beae-translate-x, 0))",
    "translateY(var(--beae-translate-y, 0))",
    ...transformTemplate,
  ].join(" ")
}

export function getTransformGpuTemplate() {
  return [
    "translate3d(var(--beae-translate-x, 0), var(--beae-translate-y, 0), 0)",
    ...transformTemplate,
  ].join(" ")
}

export const filterTemplate = {
  "--beae-blur": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-brightness": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-contrast": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-grayscale": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-hue-rotate": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-invert": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-saturate": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-sepia": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-drop-shadow": "var(--beae-empty,/*!*/ /*!*/)",
  filter: [
    "var(--beae-blur)",
    "var(--beae-brightness)",
    "var(--beae-contrast)",
    "var(--beae-grayscale)",
    "var(--beae-hue-rotate)",
    "var(--beae-invert)",
    "var(--beae-saturate)",
    "var(--beae-sepia)",
    "var(--beae-drop-shadow)",
  ].join(" "),
}

export const backdropFilterTemplate = {
  backdropFilter: [
    "var(--beae-backdrop-blur)",
    "var(--beae-backdrop-brightness)",
    "var(--beae-backdrop-contrast)",
    "var(--beae-backdrop-grayscale)",
    "var(--beae-backdrop-hue-rotate)",
    "var(--beae-backdrop-invert)",
    "var(--beae-backdrop-opacity)",
    "var(--beae-backdrop-saturate)",
    "var(--beae-backdrop-sepia)",
  ].join(" "),
  "--beae-backdrop-blur": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-brightness": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-contrast": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-grayscale": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-hue-rotate": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-invert": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-opacity": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-saturate": "var(--beae-empty,/*!*/ /*!*/)",
  "--beae-backdrop-sepia": "var(--beae-empty,/*!*/ /*!*/)",
}

export function getRingTemplate(value: any) {
  return {
    "--beae-ring-offset-shadow": `var(--beae-ring-inset) 0 0 0 var(--beae-ring-offset-width) var(--beae-ring-offset-color)`,
    "--beae-ring-shadow": `var(--beae-ring-inset) 0 0 0 calc(var(--beae-ring-width) + var(--beae-ring-offset-width)) var(--beae-ring-color)`,
    "--beae-ring-width": value,
    boxShadow: [
      `var(--beae-ring-offset-shadow)`,
      `var(--beae-ring-shadow)`,
      `var(--beae-shadow, 0 0 #0000)`,
    ].join(", "),
  }
}

export const flexDirectionTemplate = {
  "row-reverse": {
    space: "--beae-space-x-reverse",
    divide: "--beae-divide-x-reverse",
  },
  "column-reverse": {
    space: "--beae-space-y-reverse",
    divide: "--beae-divide-y-reverse",
  },
}

const owlSelector = "& > :not(style) ~ :not(style)"

export const spaceXTemplate = {
  [owlSelector]: {
    marginInlineStart:
      "calc(var(--beae-space-x) * calc(1 - var(--beae-space-x-reverse)))",
    marginInlineEnd: "calc(var(--beae-space-x) * var(--beae-space-x-reverse))",
  },
}

export const spaceYTemplate = {
  [owlSelector]: {
    marginTop:
      "calc(var(--beae-space-y) * calc(1 - var(--beae-space-y-reverse)))",
    marginBottom: "calc(var(--beae-space-y) * var(--beae-space-y-reverse))",
  },
}
