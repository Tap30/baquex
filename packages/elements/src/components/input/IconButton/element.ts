import { BaquexElement } from "../../../element/BaquexElement.ts";
import { DEFAULT_VALUES, ICON_BUTTON_TYPE } from "./constants.ts";
import type { IconButtonEventMap, IconButtonProps } from "./types.ts";

export class IconButtonElement extends BaquexElement<
  IconButtonProps,
  typeof DEFAULT_VALUES,
  IconButtonEventMap
> {
  public static readonly elementType: symbol = ICON_BUTTON_TYPE;

  constructor(initialProps: IconButtonProps) {
    super(initialProps, DEFAULT_VALUES);
  }
}
