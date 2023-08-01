import type {
  Component,
  DefineComponent,
  HTMLAttributes,
  PropType,
  ComponentOptionsMixin,
  EmitsOptions,
  AllowedComponentProps,
  VNodeProps,
  ExtractPropTypes,
  ComponentCustomProps,
} from "vue"
import type {
  ResponsiveValue,
  SystemProps,
  SystemStyleObject,
} from "@beae-ui/styled-system"
import type { Dict } from "@beae-ui/utils"
import type { CSSObject } from "@emotion/css"
import type { FunctionInterpolation } from "@emotion/serialize"
import type { DOMElements } from "./system.utils"
import type { As, BeaeProps } from "./system.types"
import type { InputTypes } from "./beae.forms"

import { computed, defineComponent, h, resolveComponent } from "vue"
import { css, isStyleProp } from "@beae-ui/styled-system"
import {
  isFunction,
  objectFilter,
  isObject,
  memoizedGet as get,
} from "@beae-ui/utils"
import { css as _css, cx } from "./emotion"
import { domElements } from "./system.utils"
import { useBeae } from "./composables/use-beae"
import { extractStyleAttrs } from "@beae-ui/vue-utils"
import { formElements } from "./beae.forms"

export interface BaseStyleResolverProps {
  as?: BeaeTagOrComponent
  __css?: SystemStyleObject
  sx?: SystemStyleObject
  css?: CSSObject
  noOfLines?: ResponsiveValue<number>
  isTruncated?: boolean
  apply?: ResponsiveValue<string>
  componentName?: String
  label?: string
  baseStyle?:
    | SystemStyleObject
    | ((props: StyleResolverProps) => SystemStyleObject)
  /**
   * User provided styles from component/beae API
   */
  styles?: SystemStyleObject
  /**
   * This attribute/property is reserved for all TSX component definitions.
   * It is referenced by the beae factory function to
   * preserve the component's label class
   */
  __label?: string
  /**
   * @internal prop to handle factory components as raw elements
   */
  __beaeIsRaw?: boolean
  theme?: Dict<any>
  styleConfig?: Dict<any>
}

export interface StyleResolverProps
  extends BaseStyleResolverProps,
    SystemProps {}

interface StyleResolverOptions extends StyleResolverProps {
  truncateStyle?: CSSObject
  theme?: any
}

const beaeProps = {
  as: [String, Object] as PropType<BeaeTagOrComponent>,
  __css: Object as PropType<StyleResolverProps["__css"]>,
  sx: Object as PropType<StyleResolverProps["sx"]>,
  css: Object as PropType<StyleResolverProps["css"]>,
  noOfLines: [String, Number, Object, Array] as PropType<
    StyleResolverProps["noOfLines"]
  >,
  baseStyle: Object as PropType<StyleResolverProps["baseStyle"]>,
  isTruncated: Boolean as PropType<StyleResolverProps["isTruncated"]>,
  layerStyle: String as PropType<StyleResolverProps["layerStyle"]>,
  textStyle: String as PropType<StyleResolverProps["textStyle"]>,
  apply: String as PropType<StyleResolverProps["apply"]>,
  label: String as PropType<StyleResolverOptions["label"]>,
  modelValue: [String, Number, Object, Array] as PropType<
    string | boolean | object
  >,
  /**
   * @warning
   * @internal
   * This internal is an internal BeaeFactoryFunction prop that
   * is used to determine how events are handled on Beae Factory
   * components.
   *
   * For example, if a factory component is considered to be raw (i.e. `__beaeIsRaw: true`),
   * then, we do not pass v-model event listeners onto the component. This means that
   * `v-model` will not work in the template context.
   *
   * You can see how this prop is used in the `input` component.
   *
   * THIS PROP IS A NON-DOCUMENTED PROP, AND IS ONLY TO BE USED FOR INTERNAL DEVELOPMENT.
   */
  __beaeIsRaw: Boolean as PropType<boolean>,
}

export type BeaeBaseComponentProps = typeof beaeProps
export type BeaeTagOrComponent =
  | DOMElements
  | Component
  | "router-link"
  | "nuxt-link"

export type BeaeFactoryComponent<Props extends {} = {}> = DefineComponent<
  Props,
  () => JSX.Element,
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptions,
  string,
  VNodeProps & AllowedComponentProps & ComponentCustomProps,
  Readonly<ExtractPropTypes<Props>>,
  {}
>

export type ComponentWithProps<Props extends {}> = BeaeFactoryComponent<Props>

type IBeaeFactory = {
  [key in DOMElements]: BeaeFactoryComponent
} & {
  (
    tag: BeaeTagOrComponent,
    options?: StyleResolverOptions & UserProvidedProps,
  ): BeaeFactoryComponent
}

export function ___beae___(
  tag: BeaeTagOrComponent,
  options: StyledOptions = {},
) {
  const inputHandlers = formElements[typeof tag === "string" ? tag : ""]
  const _props = ((inputHandlers && inputHandlers.props) as any) || {}
  const handleValueChange = inputHandlers && inputHandlers.handleValueChange

  return defineComponent({
    name: `beae-factory-${String(tag)}`,
    inheritAttrs: false,
    props: {
      ...beaeProps,
      ..._props,
    },
    setup(props, { slots, emit, attrs }) {
      const { theme, colorMode, forced } = useBeae()

      const layerStyle$ = computed(
        () => props.layerStyle || options?.layerStyle,
      )
      const textStyle$ = computed(() => props.textStyle || options?.textStyle)
      const baseStyle$ = computed(() => props.baseStyle || options?.baseStyle)
      const noOfLines$ = computed(() => props.noOfLines || options?.noOfLines)
      const isTruncated$ = computed(
        () => props.isTruncated || options?.isTruncated,
      )
      const __css$ = computed(() => props.__css || options?.__css)
      const css$ = computed(() => props.css || options?.css)
      const sx$ = computed(() => props.sx || options?.sx)
      const apply$ = computed(() => props.apply || options?.apply)

      return () => {
        const { class: inheritedClass, __label, ...rest } = attrs
        const {
          layerStyle,
          baseStyle,
          textStyle,
          noOfLines,
          isTruncated,
          __css,
          css,
          sx,
          apply,
          label,
          ...otherStyles
        } = options

        // Separate component style attributes from raw HTML attributes
        const { styles, attrs: elementAttributes } = extractStyleAttrs<
          any,
          HTMLAttributes & BaseStyleResolverProps
        >({
          ...otherStyles,
          // Prioritize user provided styles
          ...rest,
        })

        const resolvedComponentStyles = resolveStyles({
          __css: __css$.value,
          baseStyle: baseStyle$.value,
          apply: apply$.value,
          layerStyle: layerStyle$.value,
          noOfLines: noOfLines$.value,
          isTruncated: isTruncated$.value,
          textStyle: textStyle$.value,
          sx: sx$.value,
          css: css$.value,
          ...(styles as SystemProps),
          theme,
        })

        const componentLabel = label || __label
        const _componentName = componentLabel ? `beae-${componentLabel}` : ""
        const className = _css(resolvedComponentStyles)

        let componentOrTag = props.as || tag

        // if tag is not a dom element like as="div" and an object (vue component as an object) like v-bind:as="RouterLink"
        if (
          !isObject(componentOrTag) &&
          !domElements.includes(componentOrTag as any)
        ) {
          // it's a string like as="router-link"
          componentOrTag = resolveComponent(componentOrTag)
        }

        const Tag = (componentOrTag as any) || props.as

        return h(
          Tag,
          {
            class: cx(inheritedClass as string, _componentName, className),
            ...elementAttributes,
            "data-theme": forced ? colorMode.value : undefined,
            ...(!props.__beaeIsRaw &&
              handleValueChange &&
              handleValueChange(props, attrs.type as InputTypes)(emit)),
          },
          slots,
        )
      }
    },
  }) as any as DefineComponent<
    {},
    () => JSX.Element,
    {},
    {},
    {},
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    EmitsOptions,
    string,
    VNodeProps & AllowedComponentProps & ComponentCustomProps,
    Readonly<ExtractPropTypes<{}>>,
    {}
  >
}

/**
 * Beae factory serves as an object of beae enabled HTML elements,
 * and also a function that can be used to enable custom component receive beae's style props.
 * @param tag Tag or Component
 * @param options resolver options
 *
 * How does it work?
 *
 * 1. Components returned from the beae factory can be styled after consuming them
 *    @example
 *    ```js
 *    const Form = beae('form') // returns a VNode you can use in the template directly
 *    ```
 *
 * 2. Beae components can directly be styled upon creation using the options object of type `StyleResolverProps`
 *    This resolves style object for component styles defined in the theme.
 *
 *    Styling components using the beae factory function can be done using the following keys from the theme:
 *    - `baseStyle`
 *    - `layerStyle`
 *    - `textStyle`
 *
 *    @example
 *    ```js
 *    const MyCustomButton = beae('button', {
 *     baseStyle: {
         bg: 'purple,
         color: 'red.500,
         px: 4,
         py: 3
       }
 *    })
 *    ```
 *    ```html
 *    <my-custom-button>Hello Papaya Button</my-custom-button>
 *    ```
 *
 *    See more about the style resolution in the `resolveStyles` function.
 *
 * 3. Beae components created and styled using the `beae` factory can be override in the template by applying
 *    style properties directly
 *
 *    @example
 *    ```html
 *    <my-custom-button bg="blue.400">
 *      Papaya button goes blue
 *    </my-custom-button>
 *    ```
 */
export const beae = Object.assign(
  ___beae___,
  domElements.reduce(
    (acc, curr) => {
      acc[curr] = ___beae___(curr)
      return acc
    },
    {} as { [key in DOMElements]: BeaeFactoryComponent },
  ),
)

type EventHandler = (...args: any[]) => void

declare module "vue" {
  interface ComponentCustomProps
    extends BeaeProps,
      StyleResolverProps,
      HTMLAttributes {
    id?: string
    role?: string
    tabindex?: number | string
    value?: unknown
    viewBox?: unknown
    src?: unknown
    srcset?: unknown
    crossOrigin?: unknown
    srcSet?: unknown
    loading?: unknown
    alt?: unknown
    referrerPolicy?: unknown
    focusable?: unknown
    type?: unknown
    disabled?: unknown
    href?: unknown
    // should be removed after Vue supported component events typing
    // see: https://github.com/vuejs/vue-next/issues/1553
    //      https://github.com/vuejs/vue-next/issues/3029
    onBlur?: EventHandler
    onOpen?: EventHandler
    onEdit?: EventHandler
    onLoad?: EventHandler
    onClose?: EventHandler
    onFocus?: EventHandler
    onInput?: EventHandler
    onClick?: EventHandler
    onPress?: EventHandler
    onCancel?: EventHandler
    onChange?: EventHandler
    onDelete?: EventHandler
    onScroll?: EventHandler
    onSubmit?: EventHandler
    onSelect?: EventHandler
    onConfirm?: EventHandler
    onPreview?: EventHandler
    onKeypress?: EventHandler
    onTouchend?: EventHandler
    onTouchmove?: EventHandler
    onTouchstart?: EventHandler
    onTouchcancel?: EventHandler
    onMouseenter?: EventHandler
    onMouseleave?: EventHandler
    onMousemove?: EventHandler
    onKeydown?: EventHandler
    onKeyup?: EventHandler
    onDeselect?: EventHandler
    onClear?: EventHandler
  }
}

interface GetStyleObject {
  (options: {
    baseStyle?:
      | SystemStyleObject
      | ((props: StyleResolverProps) => SystemStyleObject)
  }): FunctionInterpolation<StyleResolverProps>
}

export const toCSSObject: GetStyleObject = (options) => (props) => {
  const { theme, css: cssProp, __css, sx, ...rest } = props
  const styleProps = objectFilter(rest, (_, prop) => isStyleProp(prop))
  const finalStyles = resolveStyles(
    Object.assign(options, { theme }, styleProps),
  )
  const computedCSS = css(finalStyles)(props.theme)

  return cssProp ? [computedCSS, cssProp] : computedCSS
}

interface StyledOptions extends StyleResolverOptions {
  label?: string
  baseStyle?:
    | SystemStyleObject
    | ((props: StyleResolverProps) => SystemStyleObject)
}

export function styled<T extends As, P = {}>(
  component: T,
  options: StyledOptions,
) {
  const { baseStyle, ...styledOptions } = options ?? {}

  return beae(component as BeaeTagOrComponent, styledOptions)
}

export type BeaeComponent<P = BeaeProps> = ComponentWithProps<As & P>

export type HTMLBeaeComponents<P> = {
  [Tag in DOMElements]: BeaeComponent<P>
}

export const _beae = styled as unknown as IBeaeFactory &
  HTMLBeaeComponents<BeaeProps>

export const resolveStyles = (
  resolvers = {} as StyleResolverOptions,
): CSSObject => {
  const {
    layerStyle,
    baseStyle,
    textStyle,
    noOfLines,
    isTruncated,
    __css,
    css: cssProp,
    sx,
    apply,
    theme,
    ...otherStyles
  } = resolvers

  const _layerStyle = get(theme as object, `layerStyles.${layerStyle}`, {})
  const _textStyle = get(theme as object, `textStyles.${textStyle}`, {})

  let truncateStyle: any = {}
  if (noOfLines != null) {
    truncateStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: noOfLines,
    }
  } else if (isTruncated) {
    truncateStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }
  }

  const finalStyles = css(
    Object.assign(
      {},
      __css,
      baseStyle,
      { apply: apply },
      _layerStyle,
      _textStyle,
      truncateStyle,
      otherStyles,
      sx,
    ),
  )(theme)

  const cssObject: CSSObject = Object.assign(
    finalStyles,
    isFunction(cssProp) ? cssProp(theme) : cssProp,
  )
  return cssObject
}

export type BeaeFactoryProps = BeaeProps & StyleResolverProps

/**
 * @example
 * h(beae(RouterLink, { to: 'https://ui.beae.com' }), {}, slots)
 */
type UserProvidedProps = { [key: string]: any }

domElements.forEach((tag) => {
  // @ts-ignore
  _beae[tag] = _beae(tag)
})
