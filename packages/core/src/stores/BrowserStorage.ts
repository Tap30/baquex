import { Storage } from "@tapsioss/baquex-storage";

export class BrowserStorage<T> extends Storage<T> {
  public override clear(): void {
    throw new Error("Method not implemented.");
  }

  public override setValue(value: T): void {
    console.log({ value });
    throw new Error("Method not implemented.");
  }

  public override getValue(): T {
    throw new Error("Method not implemented.");
  }
}
