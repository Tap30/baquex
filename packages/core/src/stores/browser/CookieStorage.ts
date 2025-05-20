import { Storage } from "../Storage.ts";

export class CookieStorage<T> extends Storage<T> {
  public override clear(): void {
    throw new Error("Method not implemented.");
  }

  public override setValue(value: T): void {
    // eslint-disable-next-line no-console
    console.log({ value });
    throw new Error("Method not implemented.");
  }

  public override getValue(): T {
    throw new Error("Method not implemented.");
  }
}
