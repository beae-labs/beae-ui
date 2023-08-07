import {
  h,
  defineComponent,
  Fragment,
  PropType,
  provide,
  inject,
  computed,
} from "vue"
import { type Theme } from "@beae-ui/theme"

export interface ThemingProviderProps {
  value?: Theme
}

// @ts-ignore
export const ThemingProvider = defineComponent({
  name: "ThemingProvider",
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
})
