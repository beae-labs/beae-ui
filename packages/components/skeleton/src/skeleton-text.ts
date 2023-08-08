import { type PropType, defineComponent, h, toRefs } from "vue"
import { useBreakpointValue } from "@beae-ui/media-query"
import { beae } from "@beae-ui/system"
import { cx } from "@beae-ui/utils"
import { SkeletonProps, Skeleton } from "./skeleton"

function range(count: number) {
  return Array(count)
    .fill(1)
    .map((_, index) => index + 1)
}

export interface SkeletonTextProps extends SkeletonProps {
  spacing?: SkeletonProps["margin"]
  skeletonHeight?: SkeletonProps["height"]
  startColor?: SkeletonProps["startColor"]
  endColor?: SkeletonProps["endColor"]
  isLoaded?: SkeletonProps["isLoaded"]
}

const defaultNoOfLines = 3

export const SkeletonText = defineComponent({
  name: "SkeletonText",
  props: {
    spacing: {
      type: String as PropType<string>,
      default: "0.5rem",
    },
    skeletonHeight: {
      type: String as PropType<string>,
      default: "0.5rem",
    },
    startColor: {
      type: String as PropType<SkeletonTextProps["startColor"]>,
      default: "#EDF2F7",
    },
    endColor: {
      type: String as PropType<SkeletonTextProps["endColor"]>,
      default: "#A0AEC0",
    },
    isLoaded: Boolean as PropType<SkeletonTextProps["isLoaded"]>,
    fadeDuration: {
      type: Number as PropType<SkeletonTextProps["fadeDuration"]>,
      default: null,
    },
    speed: {
      type: Number as PropType<SkeletonTextProps["speed"]>,
      default: null,
    },
    noOfLines: {
      type: Number as PropType<SkeletonTextProps["noOfLines"]>,
      default: defaultNoOfLines,
    },
  },
  setup(props, { slots }) {
    const {
      noOfLines,
      spacing,
      className,
      skeletonHeight,
      startColor,
      endColor,
      isLoaded,
      fadeDuration,
      speed,
      ...rest
    } = toRefs<any>(props)

    const noOfLinesValue =
      useBreakpointValue([noOfLines.value]) || defaultNoOfLines
    const numbers = range(noOfLinesValue)

    const getWidth = (index: number) => {
      if (noOfLinesValue > 1) {
        return index === numbers.length ? "80%" : "100%"
      }
      return "100%"
    }

    const _className = cx("beae-skeleton__group", className)

    return () => {
      return h(
        beae("div", {
          // @ts-ignore
          class: _className,
          ...rest,
        }),
        () => [
          numbers.map((number, index) => {
            if (isLoaded.value && index > 0) {
              // skip other lines
              return null
            }

            const sizeProps = isLoaded.value
              ? null
              : {
                  mb: number === numbers.length ? "0" : spacing.value,
                  width: getWidth(number),
                  height: skeletonHeight.value,
                }

            return h(
              // @ts-ignore
              beae(Skeleton),
              {
                key: numbers.length.toString() + number,
                startColor: startColor.value,
                endColor: endColor.value,
                isLoaded: isLoaded.value,
                fadeDuration: fadeDuration.value,
                speed: speed.value,
                ...sizeProps,
              },
              index === 0 ? slots : undefined,
            )
          }),
        ],
      )
    }
  },
})
