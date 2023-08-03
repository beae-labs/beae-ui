import type { ThemeOverride } from "@beae-ui/theme-utils"
import type { BeaePluginOptions } from "./helpers/plugin.types"

import { beae } from "@beae-ui/system"
import { localStorageManager } from "@beae-ui/color-mode"

const defaultPluginOptions: BeaePluginOptions = {
  cssReset: true,
  isBaseTheme: false,
  colorModeManager: localStorageManager,
}

/**
 * Helper function to extend Beae plugin with options
 * It just returns its arguments with typescript types added
 */
export function extendBeae(options = defaultPluginOptions) {
  return options
}

export { createBeae } from "./create-beae"

export type { BeaePluginOptions }
export interface ThemeProviderProps extends ThemeOverride {}
export { extendTheme, extendBaseTheme } from "@beae-ui/theme-utils"
export * from "@beae-ui/system"

// Export beae factory function
export { beae as beae }

import * as BeaeComponents from "./components"
export { BeaeComponents }

/**
 *
 * Component exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */

// A

// B
export { Button, ButtonGroup, IconButton } from "@beae-ui/button"

// C
export {
  type ColorModeOptions,
  type ColorModeContext,
  type InternalColorModeContext,
  type IColorModeContext,
  AppColorModeContextSymbol,
  setupColorModeContext,
  useColorMode,
  useColorModeValue,
  DarkMode,
  LightMode,
  type StorageManager,
  localStorageManager,
  cookieStorageManager,
} from "@beae-ui/color-mode"
export {
  type CheckboxProps,
  type CheckboxGroupProps,
  Checkbox,
  CheckboxGroup,
} from "@beae-ui/checkbox"
export { type CloseButtonProps, CloseButton } from "@beae-ui/close-button"

// F
export {
  FocusLock,
  type FocusLockProps,
  useFocusTrap,
  useReturnFocusSelector,
} from "@beae-ui/focus-lock"
export {
  FormControl,
  type FormControlProps,
  type FormControlProviderContext,
  FormErrorIcon,
  FormErrorMessage,
  type FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  type HelpTextProps,
  type FormControlContext,
  type FormControlOptions,
  FormControlProvider,
  type FormLabelProps,
  type UseFormControlProps,
  formControlProps,
  useFormControl,
  useFormControlContext,
  useFormControlProps,
  useFormControlProvider,
} from "@beae-ui/form-control"

// I
export { Icon, type IconProps, createIconComponent } from "@beae-ui/icon"
export {
  Image,
  type ImageProps,
  type UseImageProps,
  useImage,
} from "@beae-ui/image"
export {
  Input,
  InputAddon,
  type InputAddonProps,
  type InputElementProps,
  InputGroup,
  type InputGroupProps,
  InputLeftAddon,
  InputLeftElement,
  type InputProps,
  InputRightAddon,
  InputRightElement,
} from "@beae-ui/input"

// L
export {
  type AspectRatioProps,
  type BadgeProps,
  type BoxProps,
  AspectRatio,
  Badge,
  Box,
  Center,
  type CenterProps,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  type GridItemProps,
  type GridProps,
  HStack,
  Heading,
  Kbd,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  ListIcon,
  ListItem,
  type ListProps,
  OrderedList,
  SimpleGrid,
  Spacer,
  Stack,
  StackDivider,
  StackItem,
  Text,
  UnorderedList,
  VStack,
  Wrap,
  WrapItem,
  type ContainerProps,
  type DividerProps,
  type FlexProps,
  type GridOptions,
  type HeadingProps,
  type KbdProps,
  type LinkBoxProps,
  type LinkOverlayProps,
  type LinkProps,
  type SpacerProps,
  type SquareProps,
  type StackDividerProps,
  type StackProps,
  type TextProps,
  type WrapItemProps,
  type WrapProps,
} from "@beae-ui/layout"

// M
export {
  useQuery,
  useBreakpointValue,
  useBreakpoint,
  type UseQueryProps,
  type UseBreakpointOptions,
} from "@beae-ui/media-query"

// P

// R
export { cssResetStyles } from "@beae-ui/css-reset"
export { Radio, RadioGroup } from "@beae-ui/radio"

// S
export { Spinner } from "@beae-ui/spinner"

// T

// V
export {
  VisuallyHidden,
  VisuallyHiddenInput,
  visuallyHiddenStyle,
} from "@beae-ui/visually-hidden"

// OTHERS
export {
  StackMessage,
  useClipboard,
  useCounter,
  useDisclosure,
  useElementStack,
  useEventListener,
  useId,
  useIds,
  useStackContext,
  useStackProvider,
  useWindowEvent,
  type DocumentEventName,
  type GeneralEventListener,
  type UseCounterProps,
  type UseDisclosureProps,
  type WindowEventName,
} from "@beae-ui/composables"

export {
  defineStyleConfig,
  defineStyle,
  createMultiStyleConfigHelpers,
  toCSSVar,
  getCSSVar,
  resolveStyleConfig,
  omitThemingProps,
  isStyleProp,
} from "@beae-ui/styled-system"

export type {
  SystemCSSProperties,
  WithCSSVar,
  ThemingProps,
  ThemeTypings,
  ResponsiveValue,
  CSSWithMultiValues,
  StyleObjectOrFn,
  StyleConfig,
  ResponsiveArray,
  ResponsiveObject,
  RecursivePseudo,
  RecursiveCSSObject,
  StyleFunctionProps,
  MultiStyleConfig,
  PartsStyleObject,
  PartsStyleFunction,
  PartsStyleInterpolation,
  ThemeThunk,
  SystemStyleObject,
  SystemStyleFunction,
} from "@beae-ui/styled-system"

/**
 *
 * Directives exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */
