export const SCOPE = Symbol("baquex.scope");

/**
 * Determines the global scope object.
 *
 * This function attempts to identify the global scope object (e.g., `window` in a browser,
 * `global` in Node.js) in a cross-environment compatible way.
 *
 * @param o - The object to check.
 * @returns boolean indicating if the object is the global scope.
 */
const check = (o: unknown): boolean => {
  // Math is known to exist as a global in every environment.
  return (
    typeof o === "object" && o !== null && (o as { Math: object }).Math === Math
  );
};

export type GlobalScope = typeof globalThis & {
  [SCOPE]: Record<PropertyKey, unknown>;
};

/**
 * This constant holds a reference to the global scope object, which is
 * determined at runtime. It will be one of `window`, `self`, `global`,
 * or the result of a function that returns `this` (in that order).
 */
const __global__ = (
  check(window)
    ? window
    : check(self)
      ? self
      : check(global)
        ? global
        : ((function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return this as typeof globalThis;
            // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
          })() ?? Function("return this")())
) as GlobalScope;

/**
 * The global scope object.
 */
export const globalScope = __global__[SCOPE];
