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

import { computed, defineComponent, mergeProps, type PropType } from "vue"
import { useId } from "@beae-ui/composables"
import { vueThemingProps } from "@beae-ui/prop-utils"
import {
  useMultiStyleConfig,
  type ComponentWithProps,
  type AnatomyParts,
} from "@beae-ui/system"
import { usePopover, type UsePopoverProps } from "./use-popover"
import { PopoverProvider, PopoverStylesProvider } from "./popover.context"

export interface PopoverProps extends UsePopoverProps {
  trigger: "click" | "hover"
}

const props = {
  autoFocus: {
    type: Boolean as PropType<boolean>,
  },
  closeOnEsc: {
    type: Boolean as PropType<boolean>,
  },
  closeOnInteractOutside: {
    type: Boolean as PropType<boolean>,
  },
  getRootNode: {
    type: Function as PropType<() => void>,
  },
  id: {
    type: String as PropType<string>,
  },
  ids: {
    type: Object as PropType<string>,
  },
  initialFocusEl: {
    type: [Object, Function] as PropType<any>,
  },
  isOpen: {
    type: Boolean as PropType<PopoverProps["isOpen"]>,
  },
  modal: {
    type: Boolean as PropType<boolean>,
  },
  portalled: {
    type: Boolean as PropType<PopoverProps["portalled"]>,
  },
  positioning: {
    type: Object as PropType<any>,
  },
  trigger: {
    type: String as PropType<PopoverProps["trigger"]>,
    default: "click",
  },
  ...vueThemingProps,
}

export const Popover = defineComponent({
  name: "Popover",
  props,
  emits: [
    "open",
    "escape-key-down",
    "pointer-down-outside",
    "focus-outside",
    "interact-outside",
  ],
  setup(props, { attrs, emit, slots }) {
    const mergedPropsComputed = computed(() => mergeProps(props, attrs))
    const stylesComputed = useMultiStyleConfig<AnatomyParts.Popover>(
      "Popover",
      mergedPropsComputed.value,
    )

    const popoverBindingComputed = computed(() => ({
      context: props,
      emit,
    }))

    // Provider options/configs to root/group component
    const popoverProviderConfigComputed = computed(() => ({
      trigger: props.trigger,
    }))

    PopoverProvider(popoverProviderConfigComputed)
    PopoverStylesProvider(stylesComputed)

    return () => slots?.default?.()
  },
}) as ComponentWithProps<PopoverProps>
