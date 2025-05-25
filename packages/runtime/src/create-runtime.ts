import { VTree } from "@tapsioss/baquex-vtree";

/**
 * Represents the Baquex Runtime.
 * This is a singleton class, ensuring only one instance of the Runtime exists.
 */
class Runtime {
  private static _instance: Runtime | null = null;

  private _tree: VTree;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {
    this._tree = new VTree("__baquex__runtime-tree__");
  }

  /**
   * Returns the singleton instance of the Runtime.
   */
  public static get instance(): Runtime {
    if (!this._instance) {
      this._instance = new Runtime();
    }

    return this._instance;
  }

  /**
   * Gets the virtual tree managed by this runtime instance.
   */
  public get tree(): VTree {
    return this._tree;
  }
}

/**
 * Creates and returns the singleton instance of the Baquex Runtime.
 */
export const createRuntime = (): Runtime => Runtime.instance;

export { type Runtime as BaquexRuntime };
