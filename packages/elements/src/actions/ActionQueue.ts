import { DoubleEndedQueue } from "@repo/utils";
import type { ElementAction, ElementActionPerformer } from "./types.ts";

export class ActionQueue {
  private _actions: DoubleEndedQueue<ElementAction>;

  constructor() {
    this._actions = new DoubleEndedQueue<ElementAction>();
  }

  public enqueue(action: ElementAction): void {
    this._actions.pushFront(action);
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
    if (this._actions.getSize() <= 0) return Promise.resolve();

    // Process actions from the back of the queue (FIFO order).
    while (this._actions.getSize() > 0) {
      const action = this._actions.popBack()!;

      performAction(action);
    }
  }
}
