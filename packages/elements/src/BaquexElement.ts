import { effect, signal, type Signal } from "@preact/signals-core";
import type { EventHandler } from "@tapsioss/baquex-runtime";
import { VNode } from "@tapsioss/baquex-vtree";
import { runtimeManager } from "./runtime/manager.ts";
import type { Defined } from "./utils/types.ts";

export type StaticProps<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
> = Pick<Props, Exclude<keyof Props, ReactiveKeys>>;

type ReactiveProp<T> = Signal<T>;

export type ReactiveProps<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
> = {
  [K in ReactiveKeys]-?: ReactiveProp<Props[K]>;
};

const createProps = <
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
>(
  cls: ReactiveElement<Props, ReactiveKeys, DefaultValues>,
  initialProps: Props,
  reactiveKeys: Array<ReactiveKeys>,
  defaultValues: DefaultValues,
) => {
  const staticProps = {} as StaticProps<Props, ReactiveKeys>;
  const reactiveProps = {} as ReactiveProps<Props, ReactiveKeys>;

  const staticKeys = Object.keys(initialProps).filter(
    k => !reactiveKeys.includes(k as ReactiveKeys),
  );

  for (const k of reactiveKeys) {
    type K = typeof k;
    type V = ReactiveProps<Props, ReactiveKeys>[K];

    reactiveProps[k] = signal(initialProps[k] ?? defaultValues[k]) as V;

    Object.defineProperty(cls, k, {
      get(): Props[ReactiveKeys] {
        return (
          reactiveProps[k].value ??
          (defaultValues[k] as unknown as Props[ReactiveKeys])
        );
      },
      set(v: Props[ReactiveKeys]) {
        if (reactiveProps[k].peek() === v) return;

        reactiveProps[k].value = v;
      },
    });
  }

  for (const k of staticKeys) {
    type K = keyof typeof staticProps;
    type V = StaticProps<Props, ReactiveKeys>[K];

    staticProps[k as K] = (initialProps[k] ??
      defaultValues[k as keyof DefaultValues]) as V;
  }

  return {
    staticProps,
    reactiveProps,
  };
};

abstract class ReactiveElement<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
> extends VNode {
  protected _staticProps: StaticProps<Props, ReactiveKeys>;
  protected _reactiveProps: ReactiveProps<Props, ReactiveKeys>;

  constructor(
    initialProps: Props,
    reactiveKeys: ReactiveKeys[],
    defaultValues: DefaultValues,
  ) {
    super();

    const { reactiveProps, staticProps } = createProps(
      this,
      initialProps,
      reactiveKeys,
      defaultValues,
    );

    this._staticProps = staticProps;
    this._reactiveProps = reactiveProps;
  }

  public watch<K extends ReactiveKeys>(
    key: K,
    callback: (value: Defined<Props[K]>) => void,
  ): void {
    effect(() => {
      callback(this[key as keyof typeof this] as unknown as Defined<Props[K]>);
    });
  }

  public get props(): Readonly<Props> {
    const reactiveProps = Object.keys(this._reactiveProps).reduce(
      (result, k) => {
        result[k as ReactiveKeys] =
          this._reactiveProps[k as ReactiveKeys].peek();

        return result;
      },
      {} as Record<ReactiveKeys, Props[ReactiveKeys]>,
    );

    return Object.freeze({
      ...this._staticProps,
      ...reactiveProps,
    } as Props);
  }
}

export abstract class BaquexElement<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
> extends ReactiveElement<Props, ReactiveKeys, DefaultValues> {
  public addEventListener<E extends keyof EventMap & string>(
    eventType: E,
    handler: EventHandler<EventMap[E]>,
  ): void {
    runtimeManager.attachEvent(this, eventType, handler);
  }

  public removeEventListener<E extends keyof EventMap & string>(
    eventType: E,
    handler: EventHandler<EventMap[E]>,
  ): void {
    runtimeManager.detachEvent(this, eventType, handler);
  }

  public dispatchEvent<E extends keyof EventMap & string>(eventType: E): void {
    runtimeManager.triggerEvent(this, eventType);
  }

  public click(): void {
    this.dispatchEvent("click");
  }

  public focus(): void {
    this.dispatchEvent("focus");
  }

  public unfocus(): void {
    this.dispatchEvent("unfocus");
  }
}

export type BaquexElementKind<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  Element extends BaquexElement<Props, ReactiveKeys, DefaultValues, EventMap>,
  EventMap extends Record<string, unknown>,
> = Element & {
  [K in ReactiveKeys]-?: Props[K];
};
