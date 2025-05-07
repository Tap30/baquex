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

export type GlobalEventMap = MouseEventMap & {};

export type TriggerEventAction = {};

export type AttachEventAction = {};

export type DetachEventAction = {};

export const createTriggerEventAction = (
  config: unknown,
): TriggerEventAction => {
  // TODO: create appropriate action based on the configs
  return {};
};

export const createAttachEventAction = (config: unknown): AttachEventAction => {
  // TODO: create appropriate action based on the configs
  return {};
};

export const createDetachEventAction = (config: unknown): DetachEventAction => {
  // TODO: create appropriate action based on the configs
  return {};
};
