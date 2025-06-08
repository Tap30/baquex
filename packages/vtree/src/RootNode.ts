import { VNode } from "./VNode.ts";
import type { VTree } from "./VTree.ts";

export class RootNode<Data = unknown> extends VNode<Data> {
  private _tree: VTree;

  constructor(tree: VTree, data?: Data) {
    super(data);

    this._tree = tree;
  }

  public get tree(): VTree {
    return this._tree;
  }

  public set tree(tree: VTree) {
    this._tree = tree;
  }
}
