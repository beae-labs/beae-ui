import { h, ref, defineComponent, toRefs } from "vue"
import { beae } from "@beae-ui/system"
import { vueThemingProps } from "@beae-ui/prop-utils"

import { Skeleton } from "./skeleton"

export const SkeletonCircle = defineComponent({
  props: {
    ...vueThemingProps,
  },
  setup(props) {
    const { size = ref("2rem") } = toRefs(props)
    return () => {
      // @ts-ignore
      return h(beae(Skeleton, { label: "skeleton__circle" }), {
        borderRadius: "full",
        boxSize: size.value,
      })
    }
  },
})
