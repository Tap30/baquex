import { RootNode } from "./nodes/RootNode.ts";

export class VTree {
  private _root: RootNode;

  private _id: string;

  constructor(id: string) {
    this._root = new RootNode(this);
    this._id = id;
  }

  public get root() {
    return this._root;
  }

  public get id() {
    return this._id;
  }
}
