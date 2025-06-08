import type { Constructor } from "../types.ts";
import type { BaquexElement } from "./BaquexElement.ts";
import type { BaquexComponent, BaquexElementKind } from "./types.ts";

class ElementBinding<
  Props extends Record<PropertyKey, unknown>,
  RefType extends HTMLElement,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
> {
  private readonly _ElementClass: Constructor<
    BaquexElement<Props, DefaultValues, EventMap>
  >;
  private readonly _Component: BaquexComponent<Props, RefType>;

  constructor(
    ElementClass: Constructor<BaquexElement<Props, DefaultValues, EventMap>>,
    Component: BaquexComponent<Props, RefType>,
  ) {
    this._ElementClass = ElementClass;
    this._Component = Component;
  }

  public get Component(): BaquexComponent<Props, RefType> {
    return this._Component;
  }

  public createElement(): BaquexElementKind<
    Props,
    DefaultValues,
    EventMap,
    BaquexElement<Props, DefaultValues, EventMap>
  > {
    const element = new this._ElementClass();

    return element as BaquexElementKind<
      Props,
      DefaultValues,
      EventMap,
      BaquexElement<Props, DefaultValues, EventMap>
    >;
  }
}

export const createElementBinding = <
  Props extends Record<PropertyKey, unknown>,
  RefType extends HTMLElement,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
>(
  ElementClass: Constructor<BaquexElement<Props, DefaultValues, EventMap>>,
  Component: BaquexComponent<Props, RefType>,
): ElementBinding<Props, RefType, DefaultValues, EventMap> => {
  const binding = new ElementBinding(ElementClass, Component);

  return binding;
};

export { type ElementBinding };
