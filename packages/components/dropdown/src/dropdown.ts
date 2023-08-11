import { createContext, runIfFn } from "@beae-ui/utils"
import {
  beae,
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  useTheme,
  ComponentWithProps,
} from "@beae-ui/system"
import { defineComponent, PropType, VNode, watchEffect, ref, h } from "vue"
import { useDropdown, UseDropdownProps } from "./use-dropdown"
import { DropdownDescendantsProvider, DropdownProvider } from "./use-common"

const [DropdownStylesProvider, useDropdownStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `DropdownStylesContext`,
  errorMessage: `useDropdownStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Dropdown />" `,
})

export { useDropdownStyles, DropdownStylesProvider }

type MaybeRenderProp<P> = VNode | ((props: P) => VNode)

export interface DropdownProps extends UseDropdownProps, ThemingProps<"Menu"> {
  children?: MaybeRenderProp<{
    isOpen: boolean
    onClose: () => void
    forceUpdate: (() => void) | undefined
  }>
}

export const Dropdown: ComponentWithProps<DropdownProps> = defineComponent({
  props: {
    children: Object as PropType<DropdownProps["children"]>,
  },

  setup(props, { attrs, slots }) {
    const styles = useMultiStyleConfig("Menu", props)
    const ownProps = omitThemingProps(attrs)
    const { direction } = useTheme()
    const { descendants, ...ctx } = useDropdown({ ...ownProps, direction })
    const context = ref(ctx)

    const isOpen = ref(context.value.isOpen)
    const onClose = context.value.onClose
    const forceUpdate = context.value.forceUpdate

    watchEffect(() => {
      isOpen.value = context.value.isOpen
    })

    return () =>
      h(DropdownDescendantsProvider, { value: descendants }, [
        h(DropdownProvider, { value: context }, [
          h(beae.div, { value: styles }, [
            runIfFn(props.children, { isOpen, onClose, forceUpdate }),
          ]),
        ]),
      ])
  },
})
