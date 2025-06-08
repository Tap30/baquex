import type {
  BaquexElementKind,
  GlobalEventMap,
} from "../../../element/types.ts";
import type { BaseButtonProps } from "../../internals/BaseButton.tsx";
import type { DEFAULT_VALUES } from "./constants.ts";
import type { IconButtonElement } from "./element.ts";

export type IconButtonProps = Omit<
  BaseButtonProps,
  "aria-label" | "children"
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

export type IconButtonEventMap = GlobalEventMap;

export type IconButtonElementKind = BaquexElementKind<
  IconButtonProps,
  typeof DEFAULT_VALUES,
  IconButtonEventMap,
  IconButtonElement
>;
