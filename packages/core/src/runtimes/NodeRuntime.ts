import { Runtime, type EventHandler } from "@tapsioss/baquex-runtime";

export class NodeRuntime extends Runtime {
  public override triggerEvent(
    target: unknown,
    eventType: string,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public override attachEvent(
    target: unknown,
    eventType: string,
    handler: EventHandler,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public override detachEvent(
    target: unknown,
    eventType: string,
    handler: EventHandler,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
