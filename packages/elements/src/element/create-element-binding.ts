import type { Constructor } from "../types.ts";
import type { BaquexElement } from "./BaquexElement.ts";
import type { BaquexComponent } from "./types.ts";

class ElementBinding<
  Props extends Record<PropertyKey, unknown>,
  RefType extends HTMLElement,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
> {
  constructor(
    element: Constructor<BaquexElement<Props, DefaultValues, EventMap>>,
    component: BaquexComponent<Props, RefType>,
  ) {}

  public createElement() {}
}

export const createElementBinding = <
  Props extends Record<PropertyKey, unknown>,
  RefType extends HTMLElement,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
>(
  element: Constructor<BaquexElement<Props, DefaultValues, EventMap>>,
  component: BaquexComponent<Props, RefType>,
): ElementBinding<Props, RefType, DefaultValues, EventMap> => {
  const binding = new ElementBinding(element, component);

  return binding;
};

export { type ElementBinding };
