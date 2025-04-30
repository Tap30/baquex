import { VNode } from "./VNode.ts";
import type { VTree } from "./VTree.ts";

export class RootNode<N extends VNode = VNode> extends VNode {
  private _tree: VTree<N>;

  constructor(tree: VTree<N>) {
    super(null);

    this._tree = tree;
  }

  public get tree(): VTree<N> {
    return this._tree;
  }

  public set tree(tree: VTree<N>) {
    this._tree = tree;
  }
}
