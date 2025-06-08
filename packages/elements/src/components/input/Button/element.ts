import { BaquexElement } from "../../../element/BaquexElement.ts";
import { BUTTON_TYPE, DEFAULT_VALUES } from "./constants.ts";
import type { ButtonEventMap, ButtonProps } from "./types.ts";

export class ButtonElement extends BaquexElement<
  ButtonProps,
  typeof DEFAULT_VALUES,
  ButtonEventMap
> {
  public static readonly elementType: symbol = BUTTON_TYPE;

  constructor(initialProps: ButtonProps) {
    super(initialProps, DEFAULT_VALUES);
  }
}
