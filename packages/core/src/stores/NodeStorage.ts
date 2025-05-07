import { Storage } from "@tapsioss/baquex-storage";

export class NodeStorage<T> extends Storage<T> {
  public override clear(): void {
    throw new Error("Method not implemented.");
  }

  public override setValue(value: T): void {
    throw new Error("Method not implemented.");
  }

  public override getValue(): T {
    throw new Error("Method not implemented.");
  }
}
