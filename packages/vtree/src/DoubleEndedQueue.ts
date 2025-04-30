/**
 * Represents a double-ended queue (deque) data structure.
 * A deque allows adding and removing elements from both the front and the back
 * of the queue.
 */
export class DoubleEndedQueue<T> {
  private _items: Map<number, T>;
  private _start: number;
  private _end: number;

  constructor() {
    this._items = new Map<number, T>();

    this._start = 0;
    this._end = 0;
  }

  /**
   * Resets the double-ended queue, clearing all elements and resetting the
   * start and end pointers.
   */
  public reset(): void {
    this._items = new Map<number, T>();

    this._start = 0;
    this._end = 0;
  }

  /**
   * Returns the current number of elements in the double-ended queue.
   */
  public getSize(): number {
    return this._items.size;
  }

  /**
   * Adds an element to the front of the double-ended queue.
   *
   * @param item The element to add to the front.
   */
  public pushFront(item: T): void {
    this._items.set(this._start--, item);
  }

  /**
   * Adds an element to the back of the double-ended queue.
   *
   * @param item The element to add to the back.
   */
  public pushBack(item: T): void {
    this._items.set(++this._end, item);
  }

  /**
   * Retrieves the element at the front of the double-ended queue without
   * removing it.
   * Returns `undefined` if the queue is empty.
   */
  public getFront(): T | undefined {
    return this._items.get(this._start + 1);
  }

  /**
   * Retrieves the element at the back of the double-ended queue without
   * removing it.
   * Returns `undefined` if the queue is empty.
   */
  public getBack(): T | undefined {
    return this._items.get(this._end);
  }

  /**
   * Removes and returns the element at the front of the double-ended queue.
   * Returns `undefined` if the queue is empty.
   */
  public popFront(): T | undefined {
    const value = this.getFront();

    this._items.delete(++this._start);

    return value;
  }

  /**
   * Removes and returns the element at the back of the double-ended queue.
   * Returns `undefined` if the queue is empty.
   */
  public popBack(): T | undefined {
    const value = this.getBack();

    this._items.delete(this._end--);

    return value;
  }
}
