export interface BaseButton {
  /** A unique identifier for the button */
  id?: string
  /** A destination to link to, rendered in the href attribute of a link */
  url?: string
  /** Forces url to open in a new tab */
  external?: boolean
  /** Where to display the url */
  target?: Target
  /** Tells the browser to download the url instead of opening it. Provides a hint for the downloaded filename if it is a string value */
  download?: string | boolean
  /** Allows the button to submit a form */
  submit?: boolean
  /** Disables the button, disallowing merchant interaction */
  disabled?: boolean
  /** Replaces button text with a spinner while a background action is being performed */
  loading?: boolean
  /** Sets the button in a pressed state */
  pressed?: boolean
  /** Visually hidden text for screen readers */
  accessibilityLabel?: string
  /** A valid WAI-ARIA role to define the semantic value of this element */
  role?: string
  /** Id of the element the button controls */
  ariaControls?: string
  /** Tells screen reader the controlled element is expanded */
  ariaExpanded?: boolean
  /** Indicates the ID of the element that describes the button */
  ariaDescribedBy?: string
  /** Indicates the current checked state of the button when acting as a toggle or switch */
  ariaChecked?: "false" | "true"
  /** Callback when clicked */
  onClick?(): unknown
  /** Callback when button becomes focused */
  onFocus?(): void
  /** Callback when focus leaves button */
  onBlur?(): void
  /** Callback when a keypress event is registered on the button */
  onKeyPress?(event: React.KeyboardEvent<HTMLButtonElement>): void
  /** Callback when a keyup event is registered on the button */
  onKeyUp?(event: React.KeyboardEvent<HTMLButtonElement>): void
  /** Callback when a keydown event is registered on the button */
  onKeyDown?(event: React.KeyboardEvent<HTMLButtonElement>): void
  /** Callback when mouse enter */
  onMouseEnter?(): void
  /** Callback when element is touched */
  onTouchStart?(): void
  /** Callback when pointerdown event is being triggered */
  onPointerDown?(event: React.PointerEvent<HTMLButtonElement>): void
}

export interface ButtonProps extends BaseButton {
  /** Provides extra visual weight and identifies the primary action in a set of buttons */
  primary?: boolean
  /** Indicates a dangerous or potentially negative action */
  destructive?: boolean
  /**
   * Changes the size of the button, giving it more or less padding
   * @default 'medium'
   */
  size?: "micro" | "slim" | "medium" | "large"
  /** Changes the inner text alignment of the button */
  textAlign?: "left" | "right" | "center" | "start" | "end"
  /** Gives the button a subtle alternative to the default button styling, appropriate for certain backdrops */
  outline?: boolean
  /** Allows the button to grow to the width of its container */
  fullWidth?: boolean
  /** Displays the button with a disclosure icon. Defaults to `down` when set to true */
  disclosure?: "down" | "up" | "select" | boolean
  /** Renders a button that looks like a link */
  plain?: boolean
  /** Makes `plain` and `outline` Button colors (text, borders, icons) the same as the current text color. Also adds an underline to `plain` Buttons */
  monochrome?: boolean
  /** Removes underline from button text (including on interaction) when `monochrome` and `plain` are true */
  removeUnderline?: boolean
  /** Indicates whether or not the button is the primary navigation link when rendered inside of an `IndexTable.Row` */
  dataPrimaryLink?: boolean
  /** Extra visual weight combined with indication of a positive action */
  primarySuccess?: boolean
}
