import { globalScope } from "./constants/global.ts";

/**
 * Symbol used as a key to store the runtime's scope within the global scope.
 * This ensures that only one runtime instance can exist per environment.
 */
export const RUNTIME_SCOPE = Symbol("baquex.scope:runtime");

/**
 * Abstract base class for defining a runtime environment.
 *
 * This class enforces a singleton pattern, ensuring that only one instance of a
 * runtime can exist within a given environment (e.g., a browser window or a
 * Node.js process).
 *
 * @abstract
 */
export abstract class Runtime {
  /**
   * Constructor for the Runtime class.
   *
   * This constructor ensures that only one runtime instance is created per
   * environment. It checks for an existing runtime scope in the global scope
   * and throws an error if one is already present.
   *
   * @throws {Error} If a runtime instance has already been initialized in this
   * environment.
   */
  constructor() {
    if (globalScope[RUNTIME_SCOPE]) {
      throw new Error(
        "A runtime instance is already initialized. Only one runtime is allowed per environment.",
      );
    }

    globalScope[RUNTIME_SCOPE] = {};
  }
}
