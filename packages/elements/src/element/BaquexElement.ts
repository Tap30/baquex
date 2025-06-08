import { effect } from "@preact/signals-core";
import { baquexRuntime } from "@tapsioss/baquex-runtime";
import { VNode } from "@tapsioss/baquex-vtree";
import { createTriggerEventAction } from "../actions/action-creators.ts";
import { ActionQueue } from "../actions/ActionQueue.ts";
import type { Defined } from "../types.ts";
import type { EventHandler, ReactiveProps } from "./types.ts";
import { createReactiveProps } from "./utils.ts";

export abstract class BaquexElement<
  Props extends Record<PropertyKey, unknown>,
  DefaultValues extends Partial<Props>,
  EventMap extends Record<string, unknown>,
> {
  private _reactiveProps: ReactiveProps<Props>;
  private _node: VNode<Readonly<Props>>;
  private _listenerMap: Map<keyof EventMap, Set<EventHandler>>;
  private _actionsQueue: ActionQueue;

  constructor(initialProps: Props, defaultValues: DefaultValues) {
    this._listenerMap = new Map();
    this._actionsQueue = new ActionQueue();
    this._node = new VNode();

    this._reactiveProps = createReactiveProps(
      this,
      initialProps,
      defaultValues,
    );

    if (this._node.parent) {
      this._node.parent.appendChild(this._node);
    } else {
      const runtimeRoot = baquexRuntime.tree.root;

      baquexRuntime.tree.appendChild(runtimeRoot, this._node);
    }

    this._node.data = this.props;
  }

  public get listeners(): Map<keyof EventMap, Set<EventHandler>> {
    return this._listenerMap;
  }

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

  public detachEvent<E extends keyof EventMap & string>(
    eventType: E,
    handler: EventHandler<EventMap[E]>,
  ): void {
    if (!this._listenerMap.has(eventType)) return;

    const listeners = this._listenerMap.get(eventType)!;

    listeners.delete(handler as EventHandler);
    if (listeners.size === 0) this._listenerMap.delete(eventType);
  }

  public triggerEvent<E extends keyof EventMap & string>(eventType: E): void {
    const action = createTriggerEventAction({ eventType });

    this._actionsQueue.enqueue(action);
  }

  public click(): void {
    this.triggerEvent("click");
  }

  public focus(): void {
    this.triggerEvent("focus");
  }

  /**
   * Watches for changes to a specific reactive property and executes a callback.
   * The callback will be re-run whenever the reactive property's value changes.
   *
   * @template K The key of the reactive property to watch.
   * @param key The key of the reactive property.
   * @param callback The callback function to execute when the property changes.
   */
  public watch<K extends keyof Props>(
    key: K,
    callback: (value: Defined<Props[K]>) => void,
  ): void {
    effect(() => {
      callback(this[key as keyof typeof this] as unknown as Defined<Props[K]>);
    });
  }

  /**
   * Gets a read-only snapshot of all current properties.
   */
  public get props(): Readonly<Props> {
    type Keys = keyof ReactiveProps<Props>;
    type Values = Props[Keys];

    const reactiveProps = Object.keys(this._reactiveProps).reduce(
      (result, k) => {
        result[k as Keys] = this._reactiveProps[k as Keys].value;

        return result;
      },
      {} as Record<Keys, Values>,
    );

    return Object.freeze(reactiveProps as Props);
  }
}
