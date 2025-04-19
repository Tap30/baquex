import { VNode } from "./VNode.ts";
import type { VTree } from "./VTree.ts";

export class RootNode extends VNode {
  private _tree: VTree;

  constructor(tree: VTree) {
    super(null);

    this._tree = tree;
  }

  public get tree() {
    return this._tree;
  }

  public set tree(tree: VTree) {
    this._tree = tree;
  }
}
