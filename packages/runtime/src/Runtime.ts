import { VTree } from "@tapsioss/baquex-vtree";
import { globalScope } from "./constants/global.ts";

/**
 * Symbol used as a key to store the runtime's scope within the global scope.
 * This ensures that only one runtime instance can exist per environment.
 */
export const RUNTIME_SCOPE = Symbol("baquex.scope:runtime");

/**
 * Type for event handlers used in the runtime.
 */
export type EventHandler<T = unknown> = (event: T) => void;

/**
 * Abstract base class for defining a runtime environment.
 *
 * This class enforces a singleton pattern, ensuring that only one instance of a
 * runtime can exist within a given environment (e.g., a browser window or a
 * Node.js process).
 *
 * @abstract
 */
export abstract class Runtime {
  protected _tree: VTree;

  /**
   * Constructor for the Runtime class.
   *
   * This constructor ensures that only one runtime instance is created per
   * environment. It checks for an existing runtime scope in the global scope
   * and throws an error if one is already present.
   *
   * @throws {Error} If a runtime instance has already been initialized in this
   * environment.
   */
  constructor() {
    if (globalScope[RUNTIME_SCOPE]) {
      throw new Error(
        "A runtime instance is already initialized. Only one runtime is allowed per environment.",
      );
    }

    this._tree = new VTree("__baquex__runtime-tree__");

    globalScope[RUNTIME_SCOPE] = {};
  }

  /**
   * Triggers an event in the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to trigger.
   */
  public abstract triggerEvent<Target, EventType extends string>(
    target: Target,
    eventType: EventType,
  ): Promise<void>;

  /**
   * Attaches an event handler to the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to attach the handler to.
   * @param handler The event handler function.
   */
  public abstract attachEvent<
    Target,
    EventType extends string,
    Handler extends EventHandler,
  >(target: Target, eventType: EventType, handler: Handler): Promise<void>;

  /**
   * Detaches an event handler from the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to detach the handler from.
   * @param handler The event handler function to detach.
   */
  public abstract detachEvent<
    Target,
    EventType extends string,
    Handler extends EventHandler,
  >(target: Target, eventType: EventType, handler: Handler): Promise<void>;
}
