import { Runtime, type EventHandler } from "@tapsioss/baquex-runtime";

export class NodeRuntime extends Runtime {
  public override triggerEvent(
    target: unknown,
    eventType: string,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log({ target, eventType });
    throw new Error("Method not implemented.");
  }

  public override attachEvent(
    target: unknown,
    eventType: string,
    handler: EventHandler,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log({ target, eventType, handler });
    throw new Error("Method not implemented.");
  }

  public override detachEvent(
    target: unknown,
    eventType: string,
    handler: EventHandler,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log({ target, eventType, handler });
    throw new Error("Method not implemented.");
  }
}
