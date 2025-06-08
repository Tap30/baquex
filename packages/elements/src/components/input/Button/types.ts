import type {
  BaquexElementKind,
  GlobalEventMap,
} from "../../../element/types.ts";
import type { BaseButtonProps } from "../../internals/BaseButton.tsx";
import type { DEFAULT_VALUES } from "./constants.ts";
import type { ButtonElement } from "./element.ts";

export type ButtonProps = Omit<BaseButtonProps, "aria-label" | "children"> & {
  /**
   * The text to display inside the button.
   * This string will be rendered as the main label of the button.
   */
  text: string;

  /**
   * The icon to display at the start of the button text.
   */
  startIcon?: string;

  /**
   * The icon to display at the end of the button text.
   */
  endIcon?: string;
};

export type ButtonEventMap = GlobalEventMap;

export type ButtonElementKind = BaquexElementKind<
  ButtonProps,
  typeof DEFAULT_VALUES,
  ButtonEventMap,
  ButtonElement
>;
