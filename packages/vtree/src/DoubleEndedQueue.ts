export class DoubleEndedQueue<T> {
  private _items: Map<number, T>;
  private _start: number;
  private _end: number;

  constructor() {
    this._items = new Map<number, T>();

    this._start = 0;
    this._end = 0;
  }

  public reset(): void {
    this._items = new Map<number, T>();

    this._start = 0;
    this._end = 0;
  }

  public getSize(): number {
    return this._items.size;
  }

  public pushFront(item: T): void {
    this._items.set(this._start--, item);
  }

  public pushBack(item: T): void {
    this._items.set(++this._end, item);
  }

  public getFront(): T | undefined {
    return this._items.get(this._start + 1);
  }

  public getBack(): T | undefined {
    return this._items.get(this._end);
  }

  public popFront(): T | undefined {
    const value = this.getFront();

    this._items.delete(++this._start);

    return value;
  }

  public popBack(): T | undefined {
    const value = this.getBack();

    this._items.delete(this._end--);

    return value;
  }
}
