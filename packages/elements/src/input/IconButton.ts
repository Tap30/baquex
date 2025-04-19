import { BaquexElement, type ReactiveBaquexElement } from "../BaquexElement.ts";
import type { ButtonProps } from "./Button.ts";

export type IconButtonProps = Omit<
  ButtonProps,
  "endIcon" | "startIcon" | "text"
> & {
  /**
   * Provides an accessible label for the button, read by screen readers.
   * This is essential for accessibility, as the button only contains an icon.
   */
  screenReaderLabel: string;
  /**
   * The icon to display as the content of the icon button.
   */
  icon: string;
};

const REACTIVE_KEYS = ["icon", "disabled", "pending"] as const satisfies Array<
  keyof IconButtonProps
>;

const DEFAULT_VALUES = {
  color: "primary",
  variant: "filled",
  size: "medium",
  disabled: false,
  pending: false,
} as const satisfies Partial<IconButtonProps>;

type ReactiveKeys = (typeof REACTIVE_KEYS)[number];
type DefaultValues = typeof DEFAULT_VALUES;

export class IconButton extends BaquexElement<
  IconButtonProps,
  ReactiveKeys,
  DefaultValues
> {
  constructor(initialProps: IconButtonProps) {
    super(initialProps, REACTIVE_KEYS, DEFAULT_VALUES);
  }
}

export type IconButtonElement = ReactiveBaquexElement<
  IconButtonProps,
  ReactiveKeys,
  DefaultValues,
  IconButton
>;

export const createIconButton = (
  initialProps: IconButtonProps,
): IconButtonElement => {
  return new IconButton(initialProps) as IconButtonElement;
};
