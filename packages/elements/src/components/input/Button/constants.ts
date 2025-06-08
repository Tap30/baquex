import type { ButtonProps } from "./types.ts";

export const DEFAULT_VALUES = {
  color: "primary",
  variant: "filled",
  size: "medium",
  disabled: false,
  pending: false,
} as const satisfies Partial<ButtonProps>;

export const BUTTON_TYPE: unique symbol = Symbol("baquex.element.button");
