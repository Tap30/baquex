import { RootNode } from "./RootNode.ts";

/**
 * Represents a virtual tree structure.
 * A VTree manages a hierarchy of nodes, with a single root node.
 */
export class VTree {
  private _root: RootNode;

  private _id: string;

  /**
   * Constructor for VTree.
   *
   * @param id - The unique identifier for the virtual tree.
   */
  constructor(id: string) {
    this._root = new RootNode(this);
    this._id = id;
  }

  /**
   * Gets the root node of the virtual tree.
   */
  public get root() {
    return this._root;
  }

  /**
   * Gets the unique identifier of the virtual tree.
   */
  public get id() {
    return this._id;
  }
}
