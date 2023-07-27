import { filterUndefined } from "@beae-ui/utils"
import {
  beae,
  HTMLBeaeProps,
  omitThemingProps,
  StylesProvider,
  ThemingProps,
  useMultiStyleConfig,
} from "@beae-ui/system"
import { getValidChildren } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import {
  computed,
  h,
  defineComponent,
  mergeProps,
  VNode,
  cloneVNode,
} from "vue"

export interface InputGroupProps
  extends HTMLBeaeProps<"div">,
    ThemingProps<"Input"> {}

export const InputGroup = defineComponent({
  name: "InputGroup",
  props: {
    ...vueThemingProps,
  },
  setup(props, { slots, attrs }) {
    const styleAttrs = computed(() => mergeProps(attrs, props))
    const styles = useMultiStyleConfig("Input", styleAttrs)
    const input = computed(() => styles.value?.field)
    const unthemedProps = computed(() => omitThemingProps(styleAttrs.value))

    StylesProvider(styles)

    return () => {
      const groupStyles = {} as InputGroupProps
      const validChildren = getValidChildren(slots)
      validChildren.forEach((vnode) => {
        if (!styles.value) return
        // @ts-expect-error Here we internally check for the appended `id` prop to the component
        if (input.value && vnode.type.id === "InputLeftElement") {
          // @ts-expect-error
          groupStyles.paddingStart = input.value.height || input.value.h
        }
        // @ts-expect-error
        if (input.value && vnode.type.id === "InputRightElement") {
          // @ts-expect-error
          groupStyles.paddingEnd = input.value.height || input.value.h
        }
        // @ts-expect-error
        if (input.value && vnode.type.id === "InputLeftAddon") {
          groupStyles.borderEndRadius = 0
        }
        // @ts-expect-error
        if (input.value && vnode.type.id === "InputRightAddon") {
          groupStyles.borderStartRadius = 0
        }
      })

      const clones = validChildren.map((vnode: VNode) => {
        const theming = filterUndefined({
          size: vnode.props?.size || props.size,
          variant: vnode.props?.size || props.variant,
        })

        // @ts-ignore
        return vnode.type?.name !== "Input"
          ? cloneVNode(vnode, theming)
          : cloneVNode(
              vnode,
              Object.assign(
                theming,
                groupStyles,
                // vnode.props
              ),
            )
      })

      return h(
        beae.div,
        {
          __label: "input__group",
          __css: {
            width: "100%",
            display: "flex",
            position: "relative",
          },
          ...unthemedProps.value,
        },
        () => clones,
      )
    }
  },
})
