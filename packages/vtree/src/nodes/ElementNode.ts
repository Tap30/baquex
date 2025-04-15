import { VNode } from "../VNode.ts";

type BaseElementProps = Record<PropertyKey, unknown>;

export class ElementNode<Props extends BaseElementProps> extends VNode {
  protected _props: Props;

  constructor(initialProps: Props, parent?: VNode | null) {
    super(parent);

    this._props = initialProps;
  }
}
