import {
  h,
  defineComponent,
  Fragment,
  PropType,
  provide,
  inject,
  computed,
} from "vue"
import { Theme } from "@beae-ui/theme"
import { ComponentWithProps } from "@beae-ui/system"

export interface UThemeProviderProps {
  value?: Theme
}

const UThemeProvider: ComponentWithProps<UThemeProviderProps> = defineComponent(
  {
    name: "BeaeThemeProvider",
    props: {
      value: {
        type: [Object] as PropType<Theme>,
        default: () => undefined,
      },
    },
    setup(props, { slots }) {
      const pluginTheme = inject("$beaeTheme")
      const applicationTheme = computed(() => props.value || pluginTheme)
      provide("$beaeTheme", applicationTheme.value)
      return () => h(Fragment, slots.default?.({ $beaeTheme: props.value }))
    },
  },
)

export default UThemeProvider
