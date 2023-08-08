import { keyframes } from "@beae-ui/system"

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min)
}

type Keyframe = ReturnType<typeof keyframes>

export const spin: Keyframe = keyframes({
  "0%": {
    strokeDasharray: "1, 400",
    strokeDashoffset: "0",
  },
  "50%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-100",
  },
  "100%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-260",
  },
})

export const rotate: Keyframe = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
})

export const loading: Keyframe = keyframes({
  "0%": { left: "-40%" },
  "100%": { left: "100%" },
})

export const stripe: Keyframe = keyframes({
  from: { backgroundPosition: "1rem 0" },
  to: { backgroundPosition: "0 0" },
})

export interface GetLoadingPropsOptions {
  value?: number
  min: number
  max: number
  valueText?: string
  getValueText?(value: number, percent: number): string
  isIndeterminate?: boolean
  role?: string
}

/**
 * Get the common `aria-*` attributes for both the linear and circular
 * loading components.
 */
export function getLoadingProps(options: GetLoadingPropsOptions) {
  const {
    value = 0,
    min,
    max,
    valueText,
    getValueText,
    isIndeterminate,
    role = "loading-bar",
  } = options

  const percent = valueToPercent(value, min, max)

  const getAriaValueText = () => {
    if (value == null) return undefined
    return typeof getValueText === "function"
      ? getValueText(value, percent)
      : valueText
  }

  return {
    bind: {
      "data-indeterminate": isIndeterminate ? "" : undefined,
      "aria-value-max": max,
      "aria-value-min": min,
      "aria-value-now": isIndeterminate ? undefined : value,
      "aria-value-text": getAriaValueText(),
      role,
    },
    percent,
    value,
  }
}
