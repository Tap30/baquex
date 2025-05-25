import {
  BaquexElement,
  type BaquexElementKind,
} from "../../element/BaquexElement.ts";
import type { GlobalEventMap } from "../../element/types.ts";

export type ButtonProps = {
  /**
   * The text to display inside the button.
   * This string will be rendered as the main label of the button.
   */
  text: string;

  /**
   * The visual style variant of the button.
   * Defaults to `"filled"`.
   *
   * @default "filled"
   */
  variant?: "filled" | "outlined" | "ghost";

  /**
   * The color scheme of the button.
   * Defaults to `"primary"`.
   *
   * @default "primary"
   */
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";

  /**
   * The size of the button.
   * Defaults to `"medium"`.
   *
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * If true, the button will be disabled and non-interactive.
   * Defaults to `false`.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, a loading indicator will be displayed inside the button.
   * Defaults to `false`.
   *
   * @default false
   */
  pending?: boolean;

  /**
   * The icon to display at the start of the button text.
   */
  startIcon?: string;

  /**
   * The icon to display at the end of the button text.
   */
  endIcon?: string;

  /**
   * The URL to navigate to when the button is clicked.
   * If provided, the button will behave like a link.
   */
  href?: string;
};

const REACTIVE_KEYS = ["text", "disabled", "pending"] as const satisfies Array<
  keyof ButtonProps
>;

const DEFAULT_VALUES = {
  color: "primary",
  variant: "filled",
  size: "medium",
  disabled: false,
  pending: false,
} as const satisfies Partial<ButtonProps>;

type ReactiveKeys = (typeof REACTIVE_KEYS)[number];
type DefaultValues = typeof DEFAULT_VALUES;

type EventMap = GlobalEventMap;

export class Button extends BaquexElement<
  ButtonProps,
  ReactiveKeys,
  DefaultValues,
  EventMap
> {
  constructor(initialProps: ButtonProps) {
    super(initialProps, REACTIVE_KEYS, DEFAULT_VALUES);
  }
}

export type ButtonElement = BaquexElementKind<
  ButtonProps,
  ReactiveKeys,
  DefaultValues,
  Button,
  EventMap
>;

export const createButton = (initialProps: ButtonProps): ButtonElement => {
  return new Button(initialProps) as ButtonElement;
};
