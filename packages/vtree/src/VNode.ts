export abstract class VNode {
  protected _children: VNode[] = [];
  protected _parent: VNode | null = null;

  constructor(parent?: VNode | null) {
    this._parent = parent ?? null;
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
   * @throws {Error} - if the tree structure is inconsistent (e.g., a node not
   * found in its parent's children).
   */
  public get id(): string {
    if (this._parent === null) return "R";

    const pathSegments: string[] = [];

    let currentNode: VNode | null = this as VNode;

    // Traverse upwards from  the node to the root
    while (currentNode && currentNode._parent) {
      const parent = this._parent;
      const idx = parent._children.indexOf(this as VNode);

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

    pathSegments.push("R");

    return pathSegments.join("-");
  }
}
