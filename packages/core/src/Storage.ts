export abstract class Storage<T> {
  protected key: string;

  constructor(key: string) {
    this.key = key;
  }

  public abstract clear(): void;
  public abstract setValue(value: T): void;
  public abstract getValue(): T;
}
