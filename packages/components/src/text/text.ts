import { defineComponent, h, PropType } from "vue"
import { classNames } from "@beae-ui/utils"

type Element =
  | "dt"
  | "dd"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "legend"
type Variant =
  | "headingXs"
  | "headingSm"
  | "headingMd"
  | "headingLg"
  | "headingXl"
  | "heading2xl"
  | "heading3xl"
  | "heading4xl"
  | "bodySm"
  | "bodyMd"
  | "bodyLg"
type Alignment = "start" | "center" | "end" | "justify"
type FontWeight = "regular" | "medium" | "semibold" | "bold"
type Color = "success" | "critical" | "warning" | "subdued" | "text-inverse"

const styles = {
  Break: "break",
  Number: "numeric",
  Truncate: "truncate",
  VisuallyHidden: "visuallyHidden",
}

export interface TextProps {
  /** Adjust horizontal alignment of text */
  alignment?: Alignment
  /** The element type */
  as: Element
  /** Prevent text from overflowing */
  breakWord?: boolean
  /** Text to display */
  children: string
  /** Adjust color of text */
  color?: Color
  /** Adjust weight of text */
  fontWeight?: FontWeight
  /** HTML id attribute */
  id?: string
  /** Use a numeric font variant with monospace appearance */
  numeric?: boolean
  /** Truncate text overflow with ellipsis */
  truncate?: boolean
  /** Typographic style of text */
  variant?: Variant
  /** Visually hide the text */
  visuallyHidden?: boolean
}

export const Text = defineComponent({
  props: {
    /** Adjust horizontal alignment of text */
    alignment: String as PropType<TextProps["alignment"]>,
    /** The element type */
    as: String as PropType<TextProps["as"]>,
    /** Prevent text from overflowing */
    breakWord: Boolean as PropType<TextProps["breakWord"]>,
    /** Text to display */
    children: String as PropType<TextProps["children"]>,
    /** Adjust color of text */
    color: String as PropType<TextProps["color"]>,
    /** Adjust weight of text */
    fontWeight: String as PropType<TextProps["fontWeight"]>,
    /** HTML id attribute */
    id: String as PropType<TextProps["id"]>,
    /** Use a numeric font variant with monospace appearance */
    numeric: Boolean as PropType<TextProps["numeric"]>,
    /** Truncate text overflow with ellipsis */
    truncate: Boolean as PropType<TextProps["truncate"]>,
    /** Typographic style of text */
    variant: String as PropType<TextProps["color"]>,
    /** Visually hide the text */
    visuallyHidden: Boolean as PropType<TextProps["numeric"]>,
  },
  setup(props, { slots }) {
    const Component = props?.as || (props?.visuallyHidden ? "span" : "p")

    const className = classNames(
      "root",
      props?.alignment,
      props?.color,
      props?.fontWeight,
      props?.variant,
      props?.breakWord && styles["Break"],
      props?.numeric && styles["Number"],
      props?.truncate && styles["Truncate"],
      props?.visuallyHidden && styles["VisuallyHidden"],
    )
    return () =>
      h(Component, { class: className, id: props?.id }, slots.default?.())
  },
})
