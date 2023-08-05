import { h, ref, defineComponent, toRefs } from "vue"
import {
  ComponentWithProps,
  beae,
  DeepPartial,
  ThemingProps,
} from "@beae-ui/system"
import { vueThemingProps } from "@beae-ui/prop-utils"

import { Skeleton } from "./skeleton"

export const SkeletonCircle: ComponentWithProps<DeepPartial<ThemingProps>> =
  defineComponent({
    props: {
      ...vueThemingProps,
    },
    setup(props) {
      const { size = ref("2rem") } = toRefs(props)
      return () => {
        return h(beae(Skeleton, { label: "skeleton__circle" }), {
          borderRadius: "full",
          boxSize: size.value,
        })
      }
    },
  })
