import { effect, signal, type Signal } from "@preact/signals-core";
import { VNode } from "@tapsioss/baquex-vtree";
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
  cls: BaquexElement<Props, ReactiveKeys, DefaultValues>,
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

export abstract class BaquexElement<
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

export type ReactiveBaquexElementClass<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  Element extends BaquexElement<Props, ReactiveKeys, DefaultValues>,
> = new (initialProps: Props) => Element & {
  [K in ReactiveKeys]-?: Props[K];
};

export type ReactiveBaquexElement<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  Element extends BaquexElement<Props, ReactiveKeys, DefaultValues>,
> = Element & {
  [K in ReactiveKeys]-?: Props[K];
};
