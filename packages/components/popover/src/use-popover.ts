/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend creating hooks that
 * handles accessibility, state management, and behavior concerns.
 *
 * - Hooks should return prop-getters and some state information.
 *
 * > If you're not creating an interactive component, you can delete this file.
 *
 * @see https://ui.beae.com/guides/component-guide
 */

type Placement = "top" | "right" | "bottom" | "left"

export type PositioningOptions = {
  /**
   * The strategy to use for positioning
   */
  strategy?: "absolute" | "fixed"
  /**
   * The initial placement of the floating element
   */
  placement?: Placement
  /**
   * The offset of the floating element
   */
  offset?: { mainAxis?: number; crossAxis?: number }
  /**
   * The main axis offset or gap between the reference and floating elements
   */
  gutter?: number
  /**
   * The virtual padding around the viewport edges to check for overflow
   */
  overflowPadding?: number
  /**
   * Whether to flip the placement
   */
  flip?: boolean
  /**
   * Whether the floating element can overlap the reference element
   * @default false
   */
  overlap?: boolean
  /**
   * Whether to make the floating element same width as the reference element
   */
  sameWidth?: boolean
  /**
   * Whether the popover should fit the viewport.
   */
  fitViewport?: boolean
  /**
   * Function called on cleanup of all listeners
   */
  onCleanup?: VoidFunction
}

export interface UsePopoverProps {
  /**
   * Whether the popover is portalled
   */
  portalled: boolean
  /**
   * Whether the popover is open
   */
  isOpen: boolean
  /**
   * Function to open the popover
   */
  open(): void
  /**
   * Function to close the popover
   */
  close(): void
  /**
   * Function to reposition the popover
   */
  setPositioning(options?: Partial<PositioningOptions>): void
}

export function usePopover(props: UsePopoverProps) {
  return {}
}

export type UsePopoverReturn = ReturnType<typeof usePopover>
