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
  Teleport,
  TeleportProps,
  onBeforeMount,
  ref,
  onUnmounted,
} from "vue"
import { createPortalTarget, ensureTarget, unmountTarget } from "./portal.utils"
import { useStackProvider } from "@beae-ui/composables"
import { ComponentWithProps, DeepPartial } from "@beae-ui/system"

export interface PortalProps extends Omit<TeleportProps, "to"> {
  /**
   * The target element to which to mount the portal
   */
  to?: string
  /**
   * Determines whether the `Portal` component is enabled or disabled
   */
  disabled?: boolean
  /**
   * Name of the portal we use to label component with
   */
  label?: string
}

/**
 * beae component to teleport it's children to pre-ordained target.
 *
 * If no target is given to the `Portal` component via the `to` prop,
 * it will generate a target and append to the document body
 */
const Portal: ComponentWithProps<DeepPartial<PortalProps>> = defineComponent({
  name: "Portal",
  props: {
    to: String as PropType<PortalProps["to"]>,
    disabled: Boolean as PropType<PortalProps["disabled"]>,
    label: String as PropType<PortalProps["label"]>,
  },
  setup(props, { slots, attrs }) {
    const target = ref<string | null>(null)

    onBeforeMount(() => {
      if (props.to) {
        ensureTarget(props.to)
        target.value = props.to
      } else {
        target.value = `#${createPortalTarget(props.label).id}`
      }
    })

    onUnmounted(() => {
      if (!props.to) {
        unmountTarget(target.value!)
      }
    })

    useStackProvider()

    return () => {
      return h(
        Teleport,
        {
          ...props,
          ...attrs,
          to: target.value,
        },
        slots,
      )
    }
  },
})

export default Portal
