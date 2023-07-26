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
  | "heading-xs"
  | "heading-sm"
  | "heading-md"
  | "heading-lg"
  | "heading-xl"
  | "heading-2xl"
  | "heading-3xl"
  | "heading-4xl"
  | "body-sm"
  | "body-md"
  | "body-lg"
type Alignment = "start" | "center" | "end" | "justify"
type FontWeight = "regular" | "medium" | "semibold" | "bold"
type Color = "success" | "critical" | "warning" | "subdued" | "text-inverse"

const styles = {
  break: "break",
  number: "numeric",
  truncate: "truncate",
  visuallyHidden: "visuallyHidden",
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
    alignment: {
      type: String as PropType<TextProps["alignment"]>,
      required: false,
    },
    /** The element type */
    as: {
      type: String as PropType<TextProps["as"]>,
      required: false,
    },
    /** Prevent text from overflowing */
    breakWord: {
      type: Boolean as PropType<TextProps["breakWord"]>,
      required: false,
    },
    /** Text to display */
    children: {
      type: String as PropType<TextProps["children"]>,
      required: false,
    },
    /** Adjust color of text */
    color: {
      type: String as PropType<TextProps["color"]>,
      required: false,
    },
    /** Adjust weight of text */
    fontWeight: {
      type: String as PropType<TextProps["fontWeight"]>,
      required: false,
    },
    /** HTML id attribute */
    id: {
      type: String as PropType<TextProps["id"]>,
      required: false,
    },
    /** Use a numeric font variant with monospace appearance */
    numeric: {
      type: Boolean as PropType<TextProps["numeric"]>,
      required: false,
    },
    /** Truncate text overflow with ellipsis */
    truncate: {
      type: Boolean as PropType<TextProps["truncate"]>,
      required: false,
    },
    /** Typographic style of text */
    variant: {
      type: String as PropType<TextProps["color"]>,
      required: false,
    },
    /** Visually hide the text */
    visuallyHidden: {
      type: Boolean as PropType<TextProps["numeric"]>,
      required: false,
    },
  },
  setup(props, { slots }) {
    const Component = props?.as || (props?.visuallyHidden ? "span" : "p")

    const className = classNames(
      "root",
      props?.alignment,
      props?.color,
      props?.fontWeight,
      props?.variant,
      props?.breakWord && styles["break"],
      props?.numeric && styles["number"],
      props?.truncate && styles["truncate"],
      props?.visuallyHidden && styles["visuallyHidden"],
    )
    return () =>
      h(Component, { class: className, id: props?.id }, slots.default?.())
  },
})
