import type { Component, Fragment, Suspense, Teleport } from "vue"
import type { IntrinsicElementAttributes } from "./dom.types"
import type {
  SystemProps,
  ResponsiveValue,
  StyleProps,
} from "@beae-ui/styled-system"
import type * as anatomy from "@beae-ui/anatomy"

import {
  AllowedComponentProps,
  ComponentCustomProps,
  VNodeProps,
  HTMLAttributes,
  VNode,
} from "vue"
import { DOMElements } from "./system.utils"
import { StyleResolverProps } from "./beae"

/**
 * Export component with custom type
 *
 * @example
 * export const CBox = CBoxImpl as ComponentWithProps<{ hello?: string }>
 */
export type ComponentWithProps2<P> = {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      P & {
        [key: string]: any
      }
  }
}

export type AsPolymorphicProp = { as?: DOMElements | string | object }

export type Tag =
  | string
  | typeof Fragment
  | typeof Teleport
  | typeof Suspense
  | Component

export interface BeaeProps extends SystemProps, StyleResolverProps {
  /**
   * apply layer styles defined in `theme.layerStyles`
   */
  layerStyle?: string
  /**
   * apply typography styles defined in `theme.textStyles`
   */
  textStyle?: string
  /**
   * Reference styles from any component or key in the theme.
   *
   * @example
   * ```html
   * <c-box apply="styles.h3">This is a div</box>
   * ```
   *
   * This will apply styles defined in `theme.styles.h3`
   */
  apply?: string
  /**
   * if `true`, it'll render an ellipsis when the text exceeds the width of the viewport or maxWidth set.
   */
  isTruncated?: boolean
  /**
   * Used to truncate text at a specific number of lines
   */
  noOfLines?: ResponsiveValue<number>
  /**
   * Internal prop used to label Beae factory component tags
   */
  label?: string
  /**
   * Internal prop used to label JSX component tags
   */
  __label?: string
}

type ElementType<P = any> =
  | {
      [K in keyof IntrinsicElementAttributes]: P extends IntrinsicElementAttributes[K]
        ? K
        : never
    }[keyof IntrinsicElementAttributes]
  | Component<P>

export type As<Props = any> = ElementType<Props>

/**
 * Extract the props of a Vue element or component
 */
export type PropsOf<T extends As> = T & {
  as?: As
}

export type HTMLBeaeProps<T extends As> = Omit<
  PropsOf<T>,
  T extends "svg"
    ? "ref" | "children" | keyof StyleProps
    : "ref" | keyof StyleProps
> &
  BeaeProps & { as?: As }

declare global {
  namespace h.JSX {
    interface Element extends VNode {}
    interface ElementClass {
      $props: {}
    }
    interface ElementAttributesProperty {
      $props: {}
    }

    interface IntrinsicAttributes
      extends Omit<HTMLAttributes, "color">,
        BeaeProps {}
  }
}

export namespace AnatomyParts {
  export type Accordion = typeof anatomy.accordionAnatomy.keys
  export type Alert = typeof anatomy.alertAnatomy.keys
  export type Avatar = typeof anatomy.avatarAnatomy.keys
  export type Breadcrumb = typeof anatomy.breadcrumbAnatomy.keys
  export type Card = typeof anatomy.cardAnatomy.keys
  export type Checkbox = typeof anatomy.checkboxAnatomy.keys
  export type CircularProgress = typeof anatomy.circularProgressAnatomy.keys
  export type Editable = typeof anatomy.editableAnatomy.keys
  export type Form = typeof anatomy.formAnatomy.keys
  export type FormError = typeof anatomy.formErrorAnatomy.keys
  export type Input = typeof anatomy.inputAnatomy.keys
  export type List = typeof anatomy.listAnatomy.keys
  export type Menu = typeof anatomy.menuAnatomy.keys
  export type Modal = typeof anatomy.modalAnatomy.keys
  export type NumberInput = typeof anatomy.numberInputAnatomy.keys
  export type Popover = typeof anatomy.popoverAnatomy.keys
  export type Progress = typeof anatomy.progressAnatomy.keys
  export type Radio = typeof anatomy.radioAnatomy.keys
  export type Select = typeof anatomy.selectAnatomy.keys
  export type Slider = typeof anatomy.sliderAnatomy.keys
  export type Stat = typeof anatomy.statAnatomy.keys
  export type Switch = typeof anatomy.switchAnatomy.keys
  export type Table = typeof anatomy.tableAnatomy.keys
  export type Tabs = typeof anatomy.tabsAnatomy.keys
  export type Tag = typeof anatomy.tagAnatomy.keys
}
