export type MouseEventMap = {
  click: MouseEvent;
  dblclick: MouseEvent;
  mousedown: MouseEvent;
  mouseup: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  mouseover: MouseEvent;
  mousemove: MouseEvent;
  mouseout: MouseEvent;
};

export type KeyboardEventMap = {
  keyup: KeyboardEvent;
  keydown: KeyboardEvent;
  keypress: KeyboardEvent;
};

export type GlobalEventMap = MouseEventMap & KeyboardEventMap & {};

export type EventHandler<T = unknown> = (event: T) => void;
