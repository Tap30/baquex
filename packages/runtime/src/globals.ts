import { createRuntime, type BaquexRuntime } from "./create-runtime.ts";

/**
 * Symbol used as a key to store the runtime's scope within the global scope.
 * This ensures that only one runtime instance can exist per environment.
 */
export const RUNTIME_SCOPE = Symbol("baquex.scope:runtime");

/**
 * Symbol used as a key for the main Baquex global scope object.
 */
export const GLOBAL_SCOPE = Symbol("baquex.scope");

/**
 * Represents the augmented global scope with Baquex-specific properties.
 */
export type BaquexGlobalScope = typeof globalThis & {
  [GLOBAL_SCOPE]: {
    [RUNTIME_SCOPE]: BaquexRuntime;
  };
};

/**
 * Determines if the given object is the global scope object.
 * This function attempts to identify the global scope object (e.g., `window` in a browser,
 * `global` in Node.js) in a cross-environment compatible way.
 *
 * @param o The object to check.
 */
const check = (o: unknown): boolean => {
  // Math is known to exist as a global in every environment.
  return (
    typeof o === "object" && o !== null && (o as { Math: object }).Math === Math
  );
};

/**
 * This constant holds a reference to the actual global scope object,
 * determined at runtime. It checks for `window`, `self`, `global`,
 * and then falls back to a function that returns `this`.
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
) as BaquexGlobalScope;

/**
 * The Baquex-specific global scope object.
 * This object will contain the Baquex runtime instance.
 */
export const baquexGlobal: BaquexGlobalScope[typeof GLOBAL_SCOPE] =
  __global__[GLOBAL_SCOPE];

// Initialize the Baquex runtime if it doesn't already exist in the global scope.
if (!baquexGlobal[RUNTIME_SCOPE]) {
  baquexGlobal[RUNTIME_SCOPE] = createRuntime();
}

/**
 * The singleton instance of the Baquex Runtime, retrieved from the global scope.
 */
export const baquexRuntime: BaquexRuntime = baquexGlobal[RUNTIME_SCOPE];
