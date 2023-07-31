import { PropType, computed, defineComponent, h, onBeforeUnmount } from "vue"
import { useMotions } from "@vueuse/motion"
import { ComponentWithProps, DeepPartial, beae } from "@beae-ui/system"
import { useId } from "@beae-ui/composables"
import { CheckboxIconProps } from "./checkbox.types"

const CheckIcon = defineComponent({
  name: "CheckIcon",
  setup(_, { attrs }) {
    const transitionId = `check-icon-${useId()}`

    const leave = (done: VoidFunction) => {
      const motions = useMotions()
      const instance = motions[transitionId]
      instance.leave(() => done())
    }

    onBeforeUnmount(() => leave(() => null))

    return () =>
      h(
        beae.svg,
        {
          width: "1.2em",
          viewBox: "0 0 12 10",
          style: {
            fill: "none",
            strokeWidth: 2,
            stroke: "currentColor",
            strokeDasharray: 16,
          },
          ...attrs,
        },
        () =>
          h("polyline", {
            points: "1.5 6 4.5 9 10.5 1",
          }),
      )
  },
})

const IndeterminateIcon = defineComponent({
  name: "IndeterminateIcon",
  setup(_, { attrs }) {
    const transitionId = `indeterminate-icon-${useId()}`

    const leave = (done: VoidFunction) => {
      const motions = useMotions()
      const instance = motions[transitionId]
      instance.leave(() => done())
    }

    onBeforeUnmount(() => leave(() => null))

    return () =>
      h(
        beae.svg,
        {
          width: "1.2em",
          viewBox: "0 0 24 24",
          style: {
            strokeWidth: 4,
            stroke: "currentColor",
          },
          ...attrs,
        },
        () =>
          h("line", {
            x1: 21,
            x2: 3,
            y1: 12,
            y2: 12,
          }),
      )
  },
})

export const CheckboxIcon: ComponentWithProps<DeepPartial<CheckboxIconProps>> =
  defineComponent({
    name: "CheckboxIcon",
    props: {
      isIndeterminate: {
        type: Boolean as PropType<CheckboxIconProps["isIndeterminate"]>,
        default: false,
      },
      isChecked: {
        type: Boolean as PropType<CheckboxIconProps["isChecked"]>,
        default: false,
      },
    },
    setup(props, { attrs }) {
      const IconElement = computed(() =>
        props.isIndeterminate ? IndeterminateIcon : CheckIcon,
      )

      return () => h(IconElement.value, { ...attrs })
    },
  })
