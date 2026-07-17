export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;

  constructor(createFn: () => T, initialSize: number = 0) {
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  public get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  public release(item: T): void {
    this.pool.push(item);
  }

  public clear(): void {
    this.pool = [];
  }
}
