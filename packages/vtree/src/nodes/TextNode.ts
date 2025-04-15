import { VNode } from "../VNode.ts";

export class TextNode extends VNode {
  public value: string;

  constructor(initialValue: string, parent?: VNode | null) {
    super(parent);

    this.value = initialValue;
  }
}
