import { DoubleEndedQueue } from "@repo/utils";
import type { Runtime } from "@tapsioss/baquex-runtime";
import {
  createAttachEventAction,
  createDetachEventAction,
  createTriggerEventAction,
  type AttachEventAction,
  type DetachEventAction,
  type TriggerEventAction,
} from "./events.ts";

/**
 * Represents an action that can be performed on the Baquex Runtime.
 * Each action type corresponds to a specific operation on the runtime.
 */
export type RuntimeAction =
  | TriggerEventAction
  | AttachEventAction
  | DetachEventAction;

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

  private _hasActiveRuntime(): boolean {
    return Boolean(this._runtime);
  }

  private _queueAction(action: RuntimeAction): void {
    this._actionsQueue.pushFront(action);
  }

  private _performAction(action: RuntimeAction): Promise<void> {
    if (!this._hasActiveRuntime()) {
      throw new Error(
        "Expected an active runtime to perform actions. Ensure a runtime is configured using `runtimeManager.setup()`.",
      );
    }

    // TODO: use action and runtime to perform the action
    // This is where the actual logic to interact with the runtime based on the action would go.
    return Promise.resolve();
  }

  /**
   * Executes all the actions currently in the queue sequentially.
   */
  public async runActions(): Promise<void> {
    // If the queue is empty, there's nothing to do.
    if (this._actionsQueue.getSize() <= 0) return Promise.resolve();

    const promises: Promise<void>[] = [];

    // Process actions from the back of the queue (FIFO order).
    while (this._actionsQueue.getSize() > 0) {
      const action = this._actionsQueue.popBack()!;

      promises.push(this._performAction(action));
    }

    // Wait for all actions to complete.
    await Promise.all(promises);
  }

  /**
   * Creates and queues an action to trigger an event on the runtime.
   *
   * @param config The configuration object for the event to be triggered.
   */
  public triggerEvent(config: unknown): void {
    const action = createTriggerEventAction(config);

    this._queueAction(action);
  }

  /**
   * Creates and queues an action to attach an event handler to the runtime.
   *
   * @param config The configuration object for attaching the event handler.
   */
  public attachEvent(config: unknown): void {
    const action = createAttachEventAction(config);

    this._queueAction(action);
  }

  /**
   * Creates and queues an action to detach an event handler from the runtime.
   *
   * @param config The configuration object for detaching the event handler.
   */
  public detachEvent(config: unknown): void {
    const action = createDetachEventAction(config);

    this._queueAction(action);
  }
}

/**
 * A singleton instance of the `RuntimeManager`.
 * Use this instance to manage the global Baquex Runtime.
 */
export const runtimeManager = new RuntimeManager();
