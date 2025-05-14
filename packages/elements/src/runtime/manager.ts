import { DoubleEndedQueue } from "@repo/utils";
import type { Runtime } from "@tapsioss/baquex-runtime";
import type { VNode } from "@tapsioss/baquex-vtree";
import type { RuntimeAction } from "./action.ts";
import {
  EventActionTypes,
  createAttachEventAction,
  createDetachEventAction,
  createTriggerEventAction,
  type AttachEventAction,
  type DetachEventAction,
  type TriggerEventAction,
} from "./events.ts";

/**
 * Manages the Baquex Runtime instance and element operations.
 */
class RuntimeManager {
  private _runtime: Runtime | null = null;

  private _actionsQueue = new DoubleEndedQueue<RuntimeAction>();

  /**
   * Sets up the Baquex Runtime instance for the manager.
   * This method must be called before any actions can be performed.
   *
   * @param runtime The Baquex Runtime instance to be managed.
   */
  public setup(runtime: Runtime): void {
    this._runtime = runtime;
  }

  private _assertActiveRuntime(): void {
    const hasActiveRuntime = Boolean(this._runtime);

    if (hasActiveRuntime) return;

    throw new Error(
      [
        "Expected an active runtime to perform element actions.",
        "Ensure a runtime is configured using `runtimeManager.setup()`.",
      ].join(" "),
    );
  }

  private _queueAction(action: RuntimeAction): void {
    this._actionsQueue.pushFront(action);
  }

  private _performAction(action: RuntimeAction): Promise<void> {
    this._assertActiveRuntime();

    switch (action.type) {
      case EventActionTypes.TRIGGER: {
        return this._runtime!.triggerEvent(action.target, action.eventType);
      }

      case EventActionTypes.ATTACH: {
        return this._runtime!.attachEvent(
          action.target,
          action.eventType,
          action.handler,
        );
      }

      case EventActionTypes.DETACH: {
        return this._runtime!.detachEvent(
          action.target,
          action.eventType,
          action.handler,
        );
      }

      default: {
        throw new Error(
          [
            "Expected a valid element operation/action.",
            `Received \`${JSON.stringify(action)}\`.`,
          ].join(" "),
        );
      }
    }
  }

  /**
   * Executes all the actions currently in the queue sequentially.
   */
  public async runActions(): Promise<void> {
    if (this._actionsQueue.getSize() <= 0) return Promise.resolve();

    const promises: Promise<void>[] = [];

    // Process actions from the back of the queue (FIFO order).
    while (this._actionsQueue.getSize() > 0) {
      const action = this._actionsQueue.popBack()!;

      promises.push(this._performAction(action));
    }

    await Promise.all(promises);
  }

  /**
   * Creates and queues an action to trigger an event on the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to trigger.
   */
  public triggerEvent(
    target: TriggerEventAction["target"],
    eventType: TriggerEventAction["eventType"],
  ): void {
    const action = createTriggerEventAction({ eventType, target });

    this._queueAction(action);
  }

  /**
   * Creates and queues an action to attach an event handler to the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to attach the handler to.
   * @param handler The event handler function.
   */
  public attachEvent(
    target: AttachEventAction["target"],
    eventType: AttachEventAction["eventType"],
    handler: AttachEventAction["handler"],
  ): void {
    const action = createAttachEventAction({ target, eventType, handler });

    this._queueAction(action);
  }

  /**
   * Creates and queues an action to detach an event handler from the runtime.
   *
   * @param target target element.
   * @param eventType The type of event to detach the handler from.
   * @param handler The event handler function to detach.
   */
  public detachEvent(
    target: DetachEventAction["target"],
    eventType: DetachEventAction["eventType"],
    handler: DetachEventAction["handler"],
  ): void {
    const action = createDetachEventAction({ target, eventType, handler });

    this._queueAction(action);
  }

  public click(target: VNode): void {
    this.triggerEvent(target, "click");
  }

  public focus(target: VNode): void {
    this.triggerEvent(target, "focus");
  }

  public unfocus(target: VNode): void {
    this.triggerEvent(target, "unfocus");
  }
}

/**
 * A singleton instance of the `RuntimeManager`.
 * Use this instance to manage the global Baquex Runtime.
 */
export const runtimeManager = new RuntimeManager();
