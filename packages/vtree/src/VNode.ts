import { RootNode } from "./RootNode.ts";

/**
 * A class representing a node in a virtual tree structure.
 * VNodes form the building blocks of a hierarchical tree, used for
 * representing UI elements or document structures.
 */
export class VNode<Data = unknown> {
  protected _children: VNode[] = [];
  protected _parent: VNode | null = null;

  protected _data?: Data;

  /**
   * Constructor for VNode.
   *
   * @param parent The parent VNode of this node. If not provided,
   * this node is assumed to be a root node (though not necessarily the
   * very top-level root, which is a RootNode).
   */
  constructor(data?: Data) {
    this._data = data;
  }

  /**
   * Gets the child nodes of this VNode.
   */
  public get children(): VNode<unknown>[] {
    return this._children;
  }

  /**
   * Gets the parent node of this VNode.
   */
  public get parent(): VNode | null {
    return this._parent;
  }

  /**
   * Gets the bound data.
   */
  public get data(): Data | undefined {
    return this._data;
  }

  /**
   * Sets the bound data.
   */
  public set data(d: Data) {
    this._data = d;
  }

  /**
   * Gets the first child node of this VNode.
   */
  public get firstChild(): VNode | null {
    return this._children[0] ?? null;
  }

  /**
   * Gets the last child node of this VNode.
   */
  public get lastChild(): VNode | null {
    return this._children[this._children.length - 1] ?? null;
  }

  /**
   * Gets the siblings of this VNode (nodes that share the same parent).
   *
   * @throws {Error} If this node does not have a parent.
   */
  public get siblings(): VNode[] {
    const parent = this._parent;

    if (!parent) {
      throw new Error("Cannot get siblings of a node without a parent.");
    }

    return parent._children.filter(ch => ch !== this);
  }

  /**
   * Gets the siblings of this VNode that precede it.
   *
   * @throws {Error} If this node does not have a parent, or if the tree
   * structure is inconsistent
   */
  public get prevSiblings(): VNode[] {
    const parent = this._parent;

    if (!parent) {
      throw new Error(
        "Cannot get previous siblings of a node without a parent.",
      );
    }

    const idx = parent._children.indexOf(this);

    if (idx === -1) {
      throw new Error(
        "Node not found in parent's children. Tree structure is inconsistent.",
      );
    }

    return parent._children.slice(0, idx);
  }

  /**
   * Gets the siblings of this VNode that follow it.
   *
   * @throws {Error} If this node does not have a parent, or if the tree
   * structure is inconsistent
   */
  public get nextSiblings(): VNode[] {
    const parent = this._parent;

    if (!parent) {
      throw new Error("Cannot get next siblings of a node without a parent.");
    }

    const idx = parent._children.indexOf(this);

    if (idx === -1) {
      throw new Error(
        "Node not found in parent's children. Tree structure is inconsistent.",
      );
    }

    return parent._children.slice(idx + 1);
  }

  /**
   * Gets the VNode immediately preceding this node in its parent's children.
   *
   * @throws {Error} If this node does not have a parent, or if the tree
   * structure is inconsistent
   */
  public get prevSibling(): VNode | null {
    const parent = this._parent;

    if (!parent) {
      throw new Error(
        "Cannot get previous sibling of a node without a parent.",
      );
    }

    const idx = parent._children.indexOf(this);

    if (idx === -1) {
      throw new Error(
        "Node not found in parent's children. Tree structure is inconsistent.",
      );
    }

    if (idx - 1 < 0) return null;

    return parent._children[idx - 1] ?? null;
  }

  /**
   * Gets the VNode immediately following this node in its parent's children.
   *
   * @throws {Error} If this node does not have a parent, or if the tree
   * structure is inconsistent
   */
  public get nextSibling(): VNode | null {
    const parent = this._parent;

    if (!parent) {
      throw new Error("Cannot get next sibling of a node without a parent.");
    }

    const idx = parent._children.indexOf(this);

    if (idx === -1) {
      throw new Error(
        "Node not found in parent's children. Tree structure is inconsistent.",
      );
    }

    if (idx + 1 >= parent._children.length) return null;

    return parent._children[idx + 1] ?? null;
  }

  /**
   * Returns a unique ID for a node based purely on its position within the
   * tree. The ID represents the path from the node to the root, using sibling
   * indices at each level.
   *
   * Format examples:
   * - Root: "R"
   * - First child of the root: "0-R"
   * - Second child of the root: "1-R"
   * - First child of the second child of the root: "0-1-R"
   *
   * @throws {Error} if the tree structure is inconsistent (e.g., a node not
   * found in its parent's children).
   */
  protected get _id(): string {
    if (this._parent === null) return "R";

    const pathSegments: string[] = [];

    let currentNode: VNode | null = this as VNode;

    // Traverse upwards from  the node to the root
    while (currentNode && currentNode._parent) {
      const parent = this._parent;
      const idx = parent._children.indexOf(this);

      if (idx === -1) {
        throw new Error(
          [
            "Node not found in its parent's children.",
            "Tree structure is inconsistent.",
          ].join(" "),
        );
      }

      pathSegments.push(String(idx));
      currentNode = parent;
    }

    if (!(currentNode instanceof RootNode)) {
      throw new Error(
        [
          "The root node is not of type RootNode.",
          "The node is detached.",
          "Tree structure is inconsistent.",
        ].join(" "),
      );
    }

    pathSegments.push(`R-${currentNode.tree.id}`);

    return pathSegments.join("-");
  }

  /**
   * Appends a child node to the end of this node's children.
   *
   * @param node The child node to append.
   */
  public appendChild(node: VNode): void {
    if (!node) {
      throw new Error("Child node cannot be null or undefined");
    }

    node._parent = this;
    this._children.push(node);
  }

  /**
   * Prepends a child node to the beginning of this node's children.
   *
   * @param node The child node to prepend.
   */
  public prependChild(node: VNode): void {
    if (!node) {
      throw new Error("Child node cannot be null or undefined");
    }

    node._parent = this;
    this._children.splice(0, 0, node);
  }

  /**
   * Inserts a node after this node in the virtual tree.
   *
   * @throws {Error}
   *
   * @param node The node to insert.
   */
  public insertAfter(node: VNode): void {
    if (!node) {
      throw new Error("Node to insert cannot be null or undefined.");
    }

    if (!this._parent) {
      throw new Error("Node does not have a parent.");
    }

    const idx = this._parent.children.indexOf(this);

    if (idx === -1) {
      throw new Error("Node not found in parent's children.");
    }

    node._parent = this;
    this._parent.children.splice(idx + 1, 0, node);
  }

  /**
   * Inserts a node before this node in the virtual tree.
   *
   * @throws {Error}
   *
   * @param node The node to insert.
   */
  public insertBefore(node: VNode): void {
    if (!node) {
      throw new Error("Node to insert cannot be null or undefined.");
    }

    const prev = this.prevSibling;

    if (!prev) {
      // Node is the first child of its parent.
      if (!this._parent) {
        throw new Error("Node does not have a parent.");
      }

      this.prependChild(node);

      return;
    }

    this.insertAfter(node);
  }

  /**
   * Deletes a child node from this node's children.
   *
   * @throws {Error}
   *
   * @param node The node to delete.
   */
  public deleteChild(node: VNode): void {
    if (!node) {
      throw new Error("Node to delete cannot be null or undefined.");
    }

    const idx = this._children.indexOf(node);

    if (idx === -1) {
      throw new Error("Node not found in parent's children.");
    }

    this._children.splice(idx, 1);
  }

  /**
   * Removes the node from its parent.
   */
  public remove(): void {
    this._parent?.deleteChild(this);
  }
}
