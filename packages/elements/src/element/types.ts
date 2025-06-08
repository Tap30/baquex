import type { Signal } from "@preact/signals-core";
import type { ReactNode, Ref } from "react";
import type { BaquexElement } from "./BaquexElement.ts";

export type MouseEventMap = {
  click: MouseEvent;
  dblclick: MouseEvent;
  mousedown: MouseEvent;
  mouseup: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  mouseover: MouseEvent;
  mousemove: MouseEvent;
  mouseout: MouseEvent;
};

export type KeyboardEventMap = {
  keyup: KeyboardEvent;
  keydown: KeyboardEvent;
  keypress: KeyboardEvent;
};

export type GlobalEventMap = MouseEventMap & KeyboardEventMap & {};

export type EventHandler<T = unknown> = (event: T) => void;

type ReactiveProp<T> = Signal<T>;

export type ReactiveProps<Props extends Record<PropertyKey, unknown>> = {
  [K in keyof Props]-?: ReactiveProp<Props[K]>;
};

export type BaquexComponent<
  ElementProps extends Record<PropertyKey, unknown> = Record<
    PropertyKey,
    unknown
  >,
  RefType extends HTMLElement = HTMLElement,
> = (props: BaquexComponentProps<ElementProps, RefType>) => ReactNode;

export type BaquexComponentProps<
  ElementProps extends Record<PropertyKey, unknown> = Record<
    PropertyKey,
    unknown
  >,
  RefType extends HTMLElement = HTMLElement,
> = ElementProps & {
  ref?: Ref<RefType>;
};

export type BaquexElementKind<
  Props extends Record<PropertyKey, unknown>,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
  Element extends BaquexElement<Props, DefaultValues, EventMap>,
> = Element & {
  [K in keyof Props]-?: Props[K];
} & {
  readonly elementType: unique symbol;
};
