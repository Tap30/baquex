import { DoubleEndedQueue } from "./DoubleEndedQueue.ts";
import { RootNode } from "./RootNode.ts";
import { type VNode } from "./VNode.ts";

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

  /**
   * Traverses the virtual tree using either depth-first search (DFS) or
   * breadth-first search (BFS). The traversal starts from the specified node
   * (or the root node if no start node is provided) and executes a
   * user-provided function for each visited node.
   *
   * @throws {Error} - If the provided `mode` is not "dfs" or "bfs".
   *
   * @param visit - A callback function that is called for each visited node.
   * The function receives the current node as an argument. It can
   * return a control value to modify the traversal:
   * - "continue":  Continue to the next node.
   * - "skip":    Skip the children of the current node.
   * - "terminate": Stop the traversal.
   * @param config - Configuration object to control the traversal.
   */
  public walk(
    visit: (node: VNode) => "skip" | "terminate" | "continue",
    config: {
      /**
       * The node to start the traversal from.
       */
      startNode?: VNode;
      /**
       * The traversal mode: `"dfs"` for depth-first search,
       * or `"bfs"` for breadth-first search.
       */
      mode: "dfs" | "bfs";
    },
  ): void {
    const { mode, startNode = this._root } = config;

    const dq = new DoubleEndedQueue<VNode>();
    const visited = new Set<VNode>();

    // Select the appropriate push and pop methods based on the traversal mode.
    const fns: Record<
      typeof mode,
      {
        push: (item: VNode) => void;
        pop: () => VNode | undefined;
      }
    > = {
      // DFS: Use stack (FILO) behavior.
      dfs: { push: dq.pushFront, pop: dq.popFront },
      // BFS: Use queue (FIFO) behavior.
      bfs: { push: dq.pushFront, pop: dq.popBack },
    };

    if (!fns[mode]) {
      throw new Error(
        `Invalid traversal mode: ${mode}. Must be "dfs" or "bfs".`,
      );
    }

    // Start the traversal.
    fns[mode].push(startNode);

    while (dq.getSize() > 0) {
      // Because DQ has elements, this always yields a value.
      const node = fns[mode].pop()!;

      if (!visited.has(node)) {
        visited.add(node);

        const result = visit(node);

        if (result === "skip") continue;
        else if (result === "terminate") break;

        for (const child of node.children) {
          // Push children onto the queue/stack for further traversal.
          fns[mode].push(child);
        }
      }
    }
  }

  /**
   * Appends a child node to the end of the specified parent node's children.
   *
   * @param parent - The parent node to append the child to.
   * @param node - The child node to append.
   */
  public appendChild(parent: VNode, node: VNode): void {
    if (!parent) {
      throw new Error("Parent node cannot be null or undefined");
    }

    if (!node) {
      throw new Error("Child node cannot be null or undefined");
    }

    parent.children.push(node);
  }

  /**
   * Prepends a child node to the beginning of the specified parent node's children.
   *
   * @param parent - The parent node to prepend the child to.
   * @param node - The child node to prepend.
   */
  public prependChild(parent: VNode, node: VNode): void {
    if (!parent) {
      throw new Error("Parent node cannot be null or undefined");
    }

    if (!node) {
      throw new Error("Child node cannot be null or undefined");
    }

    parent.children.splice(0, 0, node);
  }

  /**
   * Inserts a node after a specified target node in the virtual tree.
   *
   * @throws {Error} - If the target node does not have a parent, or if the
   * target node is not found in its parent's children.
   *
   * @param target - The node after which the new node should be inserted.
   * @param node - The node to insert.
   */
  public insertAfter(target: VNode, node: VNode): void {
    if (!target) {
      throw new Error("Target node cannot be null or undefined.");
    }

    if (!node) {
      throw new Error("Node to insert cannot be null or undefined.");
    }

    if (!target.parent) {
      throw new Error("Target node does not have a parent.");
    }

    const index = target.parent.children.indexOf(target);

    if (index === -1) {
      throw new Error("Target node not found in parent's children.");
    }

    target.parent.children.splice(index + 1, 0, node);
  }

  /**
   * Inserts a node before a specified target node in the virtual tree.
   *
   * @throws {Error} - If the target node does not have a parent.
   *
   * @param target - The node before which the new node should be inserted.
   * @param node - The node to insert.
   */
  public insertBefore(target: VNode, node: VNode): void {
    if (!target) {
      throw new Error("Target node cannot be null or undefined.");
    }

    if (!node) {
      throw new Error("Node to insert cannot be null or undefined.");
    }

    const prev = target.prevSibling;

    if (!prev) {
      // Target is the first child of its parent.
      if (!target.parent) {
        throw new Error("Target node does not have a parent.");
      }

      this.prependChild(target.parent, node);

      return;
    }

    this.insertAfter(prev, node);
  }
}
