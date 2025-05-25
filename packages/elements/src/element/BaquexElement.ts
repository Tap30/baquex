import { effect, signal, type Signal } from "@preact/signals-core";
import { DoubleEndedQueue } from "@repo/utils";
import { VNode } from "@tapsioss/baquex-vtree";
import type { Defined } from "../types.ts";
import {
  createTriggerEventAction,
  type ElementAction,
  type ElementActionPerformer,
} from "./actions.ts";
import type { EventHandler } from "./types.ts";

/**
 * Defines the static properties of a component, excluding reactive keys.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 */
export type StaticProps<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
> = Pick<Props, Exclude<keyof Props, ReactiveKeys>>;

type ReactiveProp<T> = Signal<T>;

/**
 * Defines the reactive properties of a component, where each property is a Signal.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 */
export type ReactiveProps<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
> = {
  [K in ReactiveKeys]-?: ReactiveProp<Props[K]>;
};

/**
 * Internal helper function to create and separate static and reactive properties.
 * It initializes reactive properties as signals and sets up getters/setters on the class instance.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 * @template DefaultValues The type of default values for properties.
 *
 * @param cls The instance of the `ReactiveElement` class.
 * @param initialProps The initial properties provided to the component.
 * @param reactiveKeys An array of keys that should be treated as reactive.
 * @param defaultValues Default values for properties.
 */
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

/**
 * An abstract base class for elements with reactive properties.
 * It extends `VNode` and provides mechanisms for handling static and reactive properties,
 * and watching changes to reactive properties.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 * @template DefaultValues The type of default values for properties.
 */
abstract class ReactiveElement<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
> extends VNode {
  /**
   * Static properties of the element.
   */
  protected _staticProps: StaticProps<Props, ReactiveKeys>;

  /**
   * Reactive properties of the element.
   */
  protected _reactiveProps: ReactiveProps<Props, ReactiveKeys>;

  /**
   * Creates an instance of ReactiveElement.
   *
   * @param initialProps The initial properties for the element.
   * @param reactiveKeys An array of keys identifying properties that should be reactive.
   * @param defaultValues Default values for properties.
   */
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

  /**
   * Watches for changes to a specific reactive property and executes a callback.
   * The callback will be re-run whenever the reactive property's value changes.
   *
   * @template K The key of the reactive property to watch.
   * @param key The key of the reactive property.
   * @param callback The callback function to execute when the property changes.
   */
  public watch<K extends ReactiveKeys>(
    key: K,
    callback: (value: Defined<Props[K]>) => void,
  ): void {
    effect(() => {
      callback(this[key as keyof typeof this] as unknown as Defined<Props[K]>);
    });
  }

  /**
   * Gets a read-only snapshot of all current properties (both static and reactive).
   * Reactive properties' current values are peeked.
   */
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

/**
 * The base class for all Baquex elements, extending `ReactiveElement` with event handling and action queuing capabilities.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 * @template DefaultValues The type of default values for properties.
 * @template EventMap A map where keys are event types (strings) and values are the types of the event data.
 */
export abstract class BaquexElement<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
> extends ReactiveElement<Props, ReactiveKeys, DefaultValues> {
  private _listenerMap: Map<keyof EventMap, Set<EventHandler>>;
  private _actionsQueue = new DoubleEndedQueue<ElementAction>();

  /**
   * Creates an instance of BaquexElement.
   *
   * @param initialProps The initial properties for the element.
   * @param reactiveKeys An array of keys identifying properties that should be reactive.
   * @param defaultValues Default values for properties.
   */
  constructor(
    initialProps: Props,
    reactiveKeys: ReactiveKeys[],
    defaultValues: DefaultValues,
  ) {
    super(initialProps, reactiveKeys, defaultValues);

    this._listenerMap = new Map();
  }

  /**
   * Gets the map of event listeners attached to this element.
   */
  public get listeners(): Map<keyof EventMap, Set<EventHandler>> {
    return this._listenerMap;
  }

  private _queueAction(action: ElementAction): void {
    this._actionsQueue.pushFront(action);
  }

  /**
   * Executes all the actions currently in the queue sequentially.
   * Actions are processed in FIFO order.
   *
   * @param performAction A function that performs a given `ElementAction`.
   */
  public async runActions(
    performAction: ElementActionPerformer,
  ): Promise<void> {
    if (this._actionsQueue.getSize() <= 0) return Promise.resolve();

    // Process actions from the back of the queue (FIFO order).
    while (this._actionsQueue.getSize() > 0) {
      const action = this._actionsQueue.popBack()!;

      performAction(action);
    }
  }

  /**
   * Attaches an event handler to a specified event type.
   *
   * @template E The event type, which must be a key of `EventMap` and a string.
   * @param eventType The type of event to attach the handler to.
   * @param handler The event handler function.
   */
  public attachEvent<E extends keyof EventMap & string>(
    eventType: E,
    handler: EventHandler<EventMap[E]>,
  ): void {
    if (!this._listenerMap.has(eventType)) {
      this._listenerMap.set(eventType, new Set());
    }

    const listeners = this._listenerMap.get(eventType)!;

    listeners.add(handler as EventHandler);
  }

  /**
   * Detaches an event handler from a specified event type.
   *
   * @template E The event type, which must be a key of `EventMap` and a string.
   * @param eventType The type of event to detach the handler from.
   * @param handler The event handler function to detach.
   */
  public detachEvent<E extends keyof EventMap & string>(
    eventType: E,
    handler: EventHandler<EventMap[E]>,
  ): void {
    if (!this._listenerMap.has(eventType)) return;

    const listeners = this._listenerMap.get(eventType)!;

    listeners.delete(handler as EventHandler);
    if (listeners.size === 0) this._listenerMap.delete(eventType);
  }

  /**
   * Creates and queues an action to trigger a custom event on the runtime.
   * This event will be processed by the runtime's action performer.
   *
   * @template E The event type, which must be a key of `EventMap` and a string.
   * @param eventType The type of event to trigger.
   */
  public triggerEvent<E extends keyof EventMap & string>(eventType: E): void {
    const action = createTriggerEventAction({ eventType });

    this._queueAction(action);
  }

  /**
   * Triggers a 'click' event on the element.
   * This is a convenience method that calls `triggerEvent` with "click".
   */
  public click(): void {
    this.triggerEvent("click");
  }

  /**
   * Triggers a 'focus' event on the element.
   * This is a convenience method that calls `triggerEvent` with "focus".
   */
  public focus(): void {
    this.triggerEvent("focus");
  }
}

/**
 * Represents the "kind" or shape of a Baquex element, combining its properties with direct access to reactive keys.
 * This type is useful for defining concrete Baquex element classes.
 *
 * @template Props The full type of the component's properties.
 * @template ReactiveKeys The keys within `Props` that are reactive.
 * @template DefaultValues The type of default values for properties.
 * @template Element The specific BaquexElement class.
 * @template EventMap A map where keys are event types (strings) and values are the types of the event data.
 */
export type BaquexElementKind<
  Props extends Record<PropertyKey, unknown>,
  ReactiveKeys extends keyof Props,
  DefaultValues extends Partial<Props>,
  Element extends BaquexElement<Props, ReactiveKeys, DefaultValues, EventMap>,
  EventMap extends Record<string, unknown>,
> = Element & {
  [K in ReactiveKeys]-?: Props[K];
};
