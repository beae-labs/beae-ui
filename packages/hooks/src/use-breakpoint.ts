import type { BreakpointsTokenGroup } from "@beae-ui/tokens"
import type { BreakpointsDirectionAlias } from "@beae-ui/utils"
import { onMounted, ref } from "vue"
import { breakpoints, getMediaConditions } from "@beae-ui/tokens"
import { isServer } from "@beae-ui/utils"

/**
 * Match results for each directional Polaris `breakpoints` alias.
 */
type BreakpointsMatches = {
  [DirectionAlias in BreakpointsDirectionAlias]: boolean
}

export interface UseBreakpointsOptions {
  /**
   * Default values applied during SSR. Accepts a single value to use for each
   * breakpoint alias, or an object for configuring select breakpoints.
   *
   * @default false
   */
  defaults:
    | boolean
    | {
        [DirectionAlias in BreakpointsDirectionAlias]?: boolean
      }
}

function getMatches(defaults?: UseBreakpointsOptions["defaults"]) {
  if (!isServer) {
    return Object.fromEntries(
      breakpointsQueryEntries.map(([directionAlias, query]) => [
        directionAlias,
        window.matchMedia(query).matches,
      ]),
    ) as BreakpointsMatches
  }

  if (typeof defaults === "object" && defaults !== null) {
    return Object.fromEntries(
      breakpointsQueryEntries.map(([directionAlias]) => [
        directionAlias,
        defaults[directionAlias] ?? false,
      ]),
    ) as BreakpointsMatches
  }

  return Object.fromEntries(
    breakpointsQueryEntries.map(([directionAlias]) => [
      directionAlias,
      defaults ?? false,
    ]),
  ) as BreakpointsMatches
}

const breakpointsQueryEntries = getBreakpointsQueryEntries(breakpoints as any)

/**
 * Retrieves media query matches for each directional Polaris `breakpoints` alias.
 *
 * @example
 * const {smUp} = useBreakpoints();
 * return smUp && 'Hello world';
 *
 * @example
 * const {mdUp} = useBreakpoints({defaults: {mdUp: true}});
 * mdUp //=> `true` during SSR
 *
 * @example
 * const breakpoints = useBreakpoints({defaults: true});
 * breakpoints // => All values will be `true` during SSR
 */
export function useBreakpoints(options?: UseBreakpointsOptions) {
  const breakpoints = ref(getMatches(options?.defaults))

  onMounted(() => {
    const mediaQueryLists = breakpointsQueryEntries.map(([_, query]) =>
      window.matchMedia(query),
    )

    const handler = () => (breakpoints.value = getMatches())

    mediaQueryLists.forEach((mql) => {
      if (mql.addListener) {
        mql.addListener(handler)
      } else {
        mql.addEventListener("change", handler)
      }
    })

    return () => {
      mediaQueryLists.forEach((mql) => {
        if (mql.removeListener) {
          mql.removeListener(handler)
        } else {
          mql.removeEventListener("change", handler)
        }
      })
    }
  })

  return breakpoints
}

/**
 * Converts `breakpoints` tokens into directional media query entries.
 *
 * @example
 * const breakpointsQueryEntries = getBreakpointsQueryEntries(breakpoints);
 * breakpointsQueryEntries === [
 *   ['xsUp', '(min-width: ...)'],
 *   ['xsDown', '(max-width: ...)'],
 *   ['xsOnly', '(min-width: ...) and (max-width: ...)'],
 *   ['smUp', '(min-width: ...) and (max-width: ...)'],
 *   ['mdUp', '(min-width: ...) and (max-width: ...)'],
 *   // etc.
 * ]
 */
export function getBreakpointsQueryEntries(breakpoints: BreakpointsTokenGroup) {
  const mediaConditionEntries = Object.entries(getMediaConditions(breakpoints))

  return mediaConditionEntries
    .map(([breakpointsToken, mediaConditions]) =>
      Object.entries(mediaConditions).map(([direction, mediaCondition]) => {
        const breakpointsAlias = breakpointsToken.split("-")[1]

        // e.g. smUp, smDown, smOnly, etc.
        const directionAlias = `${breakpointsAlias}${capitalize(direction)}`

        return [directionAlias, mediaCondition]
      }),
    )
    .flat() as [BreakpointsDirectionAlias, string][]
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
