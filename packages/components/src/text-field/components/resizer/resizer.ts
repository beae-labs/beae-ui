// eslint-disable-next-line import/no-deprecated
import { PropType, defineComponent, h, onMounted, ref, watchEffect } from "vue"
import { useEventListener } from "./use-resizer"
const styles = {
  dummyInput: "resizer-dummy-input",
  resizer: "resizer",
}
export interface ResizerProps {
  contents?: string
  currentHeight?: number | null
  minimumLines?: number
  onHeightChange(height: number): void
}

export const Resizer = defineComponent({
  props: {
    contents: String as PropType<ResizerProps["contents"]>,
    currentHeight: Number as PropType<ResizerProps["currentHeight"]>,
    minimumLines: Number as PropType<ResizerProps["minimumLines"]>,
    onHeightChange: Function as PropType<ResizerProps["onHeightChange"]>,
  },
  setup(props, { slots }) {
    const contentNode = ref<HTMLDivElement | null>(null)
    const minimumLinesNode = ref<HTMLDivElement | null>(null)
    const animationFrame = ref<number>(0)
    const currentHeight = ref<number | null | undefined>(props.currentHeight)

    if (props.currentHeight !== currentHeight.value) {
      currentHeight.value = props.currentHeight
    }
    onMounted(() => {
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
      }
    })

    const minimumLinesMarkup = props.minimumLines
      ? h(
          "div",
          {
            ref: minimumLinesNode,
            class: styles.dummyInput,
          },
          getContentsForMinimumLines(props.minimumLines),
        )
      : null

    const handleHeightCheck = () => {
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
      }

      animationFrame.value = requestAnimationFrame(() => {
        if (!contentNode.value || !minimumLinesNode.value) {
          return
        }

        const newHeight = Math.max(
          contentNode.value.offsetHeight,
          minimumLinesNode.value.offsetHeight,
        )

        if (newHeight !== currentHeight.value) {
          props.onHeightChange?.(newHeight)
        }
      })
    }

    watchEffect(() => {
      handleHeightCheck()
    })
    useEventListener("resize", handleHeightCheck)

    return h(
      "div",
      {
        class: styles.resizer,
        "aria-hidden": true,
      },
      [
        h(
          "div",
          {
            ref: contentNode,
            class: styles.dummyInput,
          },
          getFinalContents(props.contents),
        ),
        minimumLinesMarkup,
      ],
    )
  },
})

const ENTITIES_TO_REPLACE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\n": "<br>",
  "\r": "",
}

const REPLACE_REGEX = new RegExp(
  `[${Object.keys(ENTITIES_TO_REPLACE).join()}]`,
  "g",
)

function replaceEntity(entity: keyof typeof ENTITIES_TO_REPLACE) {
  return ENTITIES_TO_REPLACE[entity]
}

function getContentsForMinimumLines(minimumLines: number) {
  let content = ""

  for (let line = 0; line < minimumLines; line++) {
    content += "<br>"
  }

  return content
}

function getFinalContents(contents?: string) {
  return contents
    ? `${contents.replace(REPLACE_REGEX, replaceEntity)}<br>`
    : "<br>"
}
