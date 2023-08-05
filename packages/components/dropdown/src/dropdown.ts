import { createContext, runIfFn } from "@beae-ui/utils"
import {
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  useTheme,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import {
  defineComponent,
  PropType,
  VNode,
  watchEffect,
  ref,
  inject,
  h,
} from "vue"
import {
  DropdownDescendantsProvider,
  DropdownProvider,
  useDropdown,
  UseDropdownProps,
} from "./use-dropdown"

const [DropdownStylesProvider, useDropdownStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `DropdownStylesContext`,
  errorMessage: `useDropdownStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Dropdown />" `,
})

export { useDropdownStyles }

type MaybeRenderProp<P> = VNode | ((props: P) => VNode)

export interface DropdownProps
  extends UseDropdownProps,
    ThemingProps<"Dropdown"> {
  children: MaybeRenderProp<{
    isOpen: boolean
    onClose: () => void
    forceUpdate: (() => void) | undefined
  }>
}

export const Dropdown: ComponentWithProps<DeepPartial<DropdownProps>> =
  defineComponent({
    props: {
      children: Object as PropType<DropdownProps["children"]>,
    },

    setup(props, { attrs, slots }) {
      const styles = useMultiStyleConfig("Dropdown", props)
      const ownProps = omitThemingProps(props)
      const { direction } = useTheme()
      const { descendants, ...ctx } = useDropdown({ ...ownProps, direction })
      const context = inject(ctx)
      const reactiveContext = ref(ctx)
      watchEffect(() => {
        reactiveContext.value = context
      })

      const isOpen = ref(reactiveContext.value.isOpen)
      const onClose = reactiveContext.value.onClose
      const forceUpdate = reactiveContext.value.forceUpdate

      return () =>
        h(DropdownDescendantsProvider, { value: descendants }, [
          h(DropdownProvider, { value: context }, [
            h(DropdownStylesProvider, { value: styles }, [
              runIfFn(props.children, { isOpen, onClose, forceUpdate }),
            ]),
          ]),
        ])
    },
  })
