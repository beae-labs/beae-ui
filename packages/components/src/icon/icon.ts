import { classNames } from "@beae-ui/utils"
import {
  defineComponent,
  h,
  ComponentPublicInstance,
  ComponentPropsOptions,
  PropType,
} from "vue"

type Color =
  | "base"
  | "subdued"
  | "critical"
  | "interactive"
  | "warning"
  | "highlight"
  | "success"
  | "primary"
  | "magic"

export type IconSource =
  | ComponentPublicInstance<Readonly<ComponentPropsOptions<IconProps>>>
  | "placeholder"
  | string

export interface IconProps {
  /** The SVG contents to display in the icon (icons should fit in a 20 × 20 pixel viewBox) */
  source: IconSource
  /** Set the color for the SVG fill */
  color?: Color
  /** Descriptive text to be read to screenreaders */
  accessibilityLabel?: string
}

const _iconProps = {
  source: {
    type: String as PropType<IconProps["source"]>,
    required: true,
  },
  color: {
    type: String as PropType<IconProps["color"]>,
    required: false,
  },
  accessibilityLabel: {
    type: String as PropType<IconProps["accessibilityLabel"]>,
    required: false,
  },
}

export const Icon = defineComponent({
  props: _iconProps,
  setup(props) {
    let sourceType: "function" | "placeholder" | "external"
    if (typeof props.source === "function") {
      sourceType = "function"
    } else if (props.source === "placeholder") {
      sourceType = "placeholder"
    } else {
      sourceType = "external"
    }

    if (
      props.color &&
      sourceType === "external" &&
      process.env.NODE_ENV === "development"
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        "Recoloring external SVGs is not supported. Set the intended color on your SVG instead.",
      )
    }

    const className = classNames("icon", props.color && "icon-color")

    const sourceComponent = props.source
    const contentMarkup = {
      function: h(sourceComponent, {
        class: "icon-svg",
        focusable: false,
        "aria-hidden": true,
      }),
      placeholder: h("div", { class: "icon-placeholder" }),
      external: h("img", {
        class: "icon-image",
        src: `data:image/svg+xml;utf8,${props.source}`,
        "aria-hidden": true,
      }),
    }

    return () =>
      h(
        "span",
        {
          class: className,
        },
        () => [h("div"), contentMarkup[sourceType]],
      )
  },
})
