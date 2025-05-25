// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Defined<T> = Exclude<T, undefined>;
export type AnyFunction = (...args: any[]) => any;
