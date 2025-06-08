import { signal } from "@preact/signals-core";
import type { BaquexElement } from "./BaquexElement.ts";
import type { ReactiveProps } from "./types.ts";

export const createReactiveProps = <
  Props extends Record<PropertyKey, unknown>,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
>(
  cls: BaquexElement<Props, DefaultValues, EventMap>,
  initialProps: Props,
  defaultValues: DefaultValues,
): ReactiveProps<Props> => {
  const reactiveProps = {} as ReactiveProps<Props>;

  for (const k of Object.keys(initialProps)) {
    type K = keyof Props;
    type V = ReactiveProps<Props>[K];

    (reactiveProps[k] as V) = signal(initialProps[k] ?? defaultValues[k]) as V;

    Object.defineProperty(cls, k, {
      get(): Props[K] {
        return (
          reactiveProps[k]!.value ?? (defaultValues[k] as unknown as Props[K])
        );
      },
      set(v: Props[K]) {
        if (reactiveProps[k]!.peek() === v) return;

        (reactiveProps[k] as V).value = v;
      },
    });
  }

  return reactiveProps;
};
