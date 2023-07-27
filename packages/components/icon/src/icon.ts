/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import {
  h,
  defineComponent,
  computed,
  inject,
  PropType,
  SVGAttributes,
} from "vue"
import {
  beae,
  BeaeProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { SNAO, camelCase, mergeWith } from "@beae-ui/utils"

const fallbackIcon = {
  path: `
    <g stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        fill="none"
        d="M9,9a3,3,0,1,1,4,2.829,1.5,1.5,0,0,0-1,1.415V14.25"
      />
      <path
        fill="currentColor"
        strokeLinecap="round"
        d="M12,17.25a.375.375,0,1,0,.375.375A.375.375,0,0,0,12,17.25h0"
      />
      <circle fill="none" strokeMiterlimit="10" cx="12" cy="12" r="11.25" />
    </g>
  `,
  viewBox: "0 0 24 24",
}

export interface IconProps
  extends Omit<SVGAttributes, keyof BeaeProps>,
    BeaeProps {
  /**
   * Icon Size
   */
  size?: string | number | object
  name?: string | undefined
}

export const iconProps = {
  as: "svg",
  size: "1em",
}

const _iconProps = {
  as: SNAO as PropType<IconProps["as"]>,
  size: SNAO as PropType<IconProps["size"]>,
  name: String as PropType<IconProps["name"]>,
}

export const Icon: ComponentWithProps<DeepPartial<IconProps>> = defineComponent(
  {
    name: "Icon",
    props: _iconProps,
    setup(_props, { slots, attrs }) {
      const props = computed<IconProps>(() => mergeWith({}, iconProps, _props))
      const icons = inject<Record<string, any>>("$beaeIcons")
      const icon = computed(
        () => icons?.[props.value?.name as string] || fallbackIcon,
      )

      const hasDefaultSlot = computed(() => slots?.default?.()?.length)
      const vnodeProps = computed(() => ({
        w: props.value.size,
        h: props.value.size,
        display: "inline-block",
        lineHeight: "1em",
        flexShrink: 0,
        color: "currentColor",
        ...(!hasDefaultSlot.value && {
          innerHTML: icon.value.path,
        }),
        focusable: false,
        viewBox: icon.value.viewBox || fallbackIcon.viewBox,
      }))

      return () =>
        h(
          beae.svg,
          {
            as: props.value.as,
            __label: "icon",
            ...(icon.value.attrs || {}),
            ...vnodeProps.value,
            ...attrs,
          },
          slots,
        )
    },
  },
)

export function createIconComponent(name: string) {
  const componentName = camelCase(name)
  const iconComponent = defineComponent({
    setup(props: IconProps, { slots, attrs }) {
      return () =>
        h(
          Icon,
          {
            name,
            ...props,
            ...attrs,
          },
          slots.defaults?.(),
        )
    },
  })

  iconComponent.name = componentName
  return iconComponent
}
