/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme-able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import {
  h,
  defineComponent,
  PropType,
  computed,
  ComputedRef,
  ref,
  watch,
  Ref,
  reactive,
} from "vue"
import {
  beae,
  DOMElements,
  StylesProvider,
  ComponentWithProps,
  HTMLBeaeProps,
  ThemingProps,
  useMultiStyleConfig,
  useStyles,
  DeepPartial,
} from "@beae-ui/system"
import { useId } from "@beae-ui/composables"
import { createContext, genId, SNAO, getValidChildren } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { filterUndefined, mergeWith } from "@beae-ui/utils"
import { SystemStyleObject } from "@beae-ui/styled-system"
import { LCollapse } from "../../motion"

export type ExpandedValues = string | string[]

export interface AccordionProps
  extends HTMLBeaeProps<"div">,
    ThemingProps<"Accordion"> {
  /**
   * If `true`, multiple accordion items can be expanded at once.
   */
  allowMultiple?: boolean
  /**
   * If `true`, any expanded accordion item can be collapsed again.
   */
  allowToggle?: boolean
  /**
   * The index(es) of the expanded accordion item
   */
  index?: ExpandedValues
  defaultIndex?: ExpandedValues
  /**
   * The initial index(es) of the expanded accordion item
   */
  defaultOpen?: ExpandedValues

  /**
   * If `true`, height animation and transitions will be disabled.
   */
  reduceMotion: boolean
  opens: string[]
  setOpen: (payload: string) => void
}

export interface AccordionContext {
  // api: ComputedRef<ReturnType<typeof allowToggle.connect>>;
  // @ts-ignore
  // api: ComputedRef<ReturnType<any>>;
  reduceMotion: ComputedRef<boolean>
  opens: Ref<string[]>
  setOpen: (payload: string) => void
}

const [AccordionProvider, useAccordion] = createContext<AccordionContext>({
  name: "AccordionContext",
  strict: true,
})

export const Accordion: ComponentWithProps<DeepPartial<AccordionProps>> =
  defineComponent({
    name: "Accordion",
    props: {
      as: {
        type: [String] as PropType<DOMElements>,
        default: "div",
      },
      allowMultiple: Boolean as PropType<AccordionProps["allowMultiple"]>,
      allowToggle: Boolean as PropType<AccordionProps["allowToggle"]>,
      index: SNAO as PropType<AccordionProps["index"]>,
      defaultIndex: SNAO as PropType<AccordionProps["defaultIndex"]>,
      reduceMotion: {
        type: Boolean as PropType<AccordionProps["reduceMotion"]>,
        default: false,
      },
      ...vueThemingProps,
    },
    setup(_props, { slots, attrs }) {
      const opens: Ref<string[]> = ref([])

      const props = computed<AccordionProps>(() => mergeWith({}, _props, attrs))
      const themingProps = computed<ThemingProps>(() =>
        filterUndefined({
          colorScheme: props.value.colorScheme,
          variant: props.value.variant,
          size: props.value.size,
          styleConfig: props.value.styleConfig,
        }),
      )

      const styles = useMultiStyleConfig("Accordion", themingProps)

      const reduceMotion = computed(() => props.value.reduceMotion)
      function setOpen(payload: string) {
        if (props.value.allowMultiple) {
          if (opens.value.includes(payload)) {
            opens.value = opens.value.filter((id) => id != payload)
          } else {
            opens.value.push(payload)
          }
        } else {
          if (opens.value.includes(payload)) {
            if (props.value.allowToggle) {
              opens.value = []
            }
          } else {
            opens.value = [payload]
          }
        }
      }

      AccordionProvider({
        reduceMotion,
        opens: opens,
        setOpen: setOpen,
      })
      StylesProvider(styles)

      return () => {
        // const api = apiRef.value;
        return h(
          beae.div,
          {
            sx: {
              "> div": styles.value.root,
            },
          },
          () => [h("div", getValidChildren(slots))],
        )
      }
    },
  })

export interface AccordionItemProps extends HTMLBeaeProps<"div"> {
  disabled?: boolean
}

export interface AccordionItemContext {
  id: ComputedRef<string>
  // isOpen: ComputedRef<boolean>;
  // isDisabled: ComputedRef<boolean | undefined>;
}

const [AccordionItemProvider, useAccordionItem] =
  createContext<AccordionItemContext>({
    name: "AccordionItemContext",
    strict: true,
  })
export const AccordionItem: ComponentWithProps<AccordionItemProps> =
  defineComponent({
    name: "AccordionItem",
    props: {
      disabled: Boolean as PropType<boolean>,
      value: String as PropType<string>,
    },
    setup(props, { slots, attrs }) {
      const _uid = useId(undefined, "accordion-item")
      const id = computed(() => (attrs.id as string) || _uid.value)
      AccordionItemProvider({
        id,
      })

      const styles = useStyles()

      const containerStyles = computed<SystemStyleObject>(() => ({
        // @ts-ignore
        ...styles.value.container,
        overflowAnchor: "none",
      }))

      return () =>
        h(
          beae.div,
          {
            __css: containerStyles.value,
            ...attrs,
          },
          () => getValidChildren(slots),
        )
    },
  })

export interface AccordionButtonProps extends HTMLBeaeProps<"button"> {
  disabled?: boolean
  _expanded?: SystemStyleObject
}
export const AccordionButton: ComponentWithProps<AccordionButtonProps> =
  defineComponent({
    name: "AccordionButton",
    props: {
      disabled: Boolean as PropType<boolean>,
      _expanded: {} as PropType<SystemStyleObject>,
    },
    setup(props, { slots, attrs }) {
      const { id } = useAccordionItem()

      const { opens, setOpen } = useAccordion()

      const styles = useStyles()
      const buttonStyles = computed<SystemStyleObject>(() => ({
        display: "flex",
        alignItems: "center",
        width: "100%",
        outline: 0,
        // @ts-ignore
        ...styles.value.button,
        ...(opens.value.includes(id.value) ? props._expanded : {}),
      }))

      return () =>
        h(
          beae.button,
          {
            __css: buttonStyles.value,
            ...attrs,
            open: opens.value.includes(id.value),
            onClick: () => setOpen(id.value),
          },
          () => getValidChildren(slots),
        )
    },
  })

export interface AccordionPanelProps extends HTMLBeaeProps<"div"> {
  disabled?: boolean
}
export const AccordionPanel: ComponentWithProps<AccordionPanelProps> =
  defineComponent({
    name: "AccordionPanel",
    props: {
      disabled: Boolean as PropType<boolean>,
    },
    setup(props, { slots, attrs }) {
      const { id } = useAccordionItem()
      const { opens } = useAccordion()
      const styles = useStyles()

      return () => {
        return h(LCollapse, { isOpen: opens.value.includes(id.value) }, () =>
          h(
            beae.div,
            {
              // @ts-ignore
              __css: styles.value.panel,
              ...attrs,
            },
            () => getValidChildren(slots),
          ),
        )
      }
    },
  })

export interface AccordionIconProps extends HTMLBeaeProps<"svg"> {}
export const AccordionIcon: ComponentWithProps<AccordionIconProps> =
  defineComponent({
    name: "AccordionIcon",
    setup(props, { slots, attrs }) {
      const { reduceMotion, opens } = useAccordion()
      const { id } = useAccordionItem()
      const styles = useStyles()

      const iconStyles = computed<SystemStyleObject>(() => ({
        // opacity: isDisabled.value ? 0.4 : 1,
        transform: opens.value.includes(id.value)
          ? "rotate(-180deg)"
          : undefined,
        transition: reduceMotion.value ? undefined : "transform 0.2s",
        transformOrigin: "center",
        // @ts-ignore
        ...styles.value.icon,
      }))

      return () =>
        h(
          beae.svg,
          {
            viewBox: "0 0 24 24",
            ariaHidden: true,
            __css: iconStyles.value,
            size: "1em",
            w: "1em",
            h: "1em",
            ...attrs,
          },
          () =>
            h(
              "g",
              h("path", {
                fill: "currentColor",
                d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
              }),
            ),
        )
    },
  })
