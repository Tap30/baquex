import type { VNode } from "@tapsioss/baquex-vtree";
import type { AnyFunction } from "../utils/types.ts";
import type { RuntimeActionCreator } from "./action.ts";

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

const TRIGGER_EVENT_ACTION_TYPE = Symbol("baquex.action.event.trigger");
const ATTACH_EVENT_ACTION_TYPE = Symbol("baquex.action.event.attach");
const DETACH_EVENT_ACTION_TYPE = Symbol("baquex.action.event.detach");

export const EventActionTypes = {
  TRIGGER: TRIGGER_EVENT_ACTION_TYPE,
  ATTACH: ATTACH_EVENT_ACTION_TYPE,
  DETACH: DETACH_EVENT_ACTION_TYPE,
} as const;

export type TriggerEventAction = {
  type: typeof TRIGGER_EVENT_ACTION_TYPE;
  target: VNode;
  eventType: string;
};

export type AttachEventAction = {
  type: typeof ATTACH_EVENT_ACTION_TYPE;
  target: VNode;
  eventType: string;
  handler: AnyFunction;
};

export type DetachEventAction = {
  type: typeof DETACH_EVENT_ACTION_TYPE;
  target: VNode;
  eventType: string;
  handler: AnyFunction;
};

type BaseEventActionConfig = {
  target: VNode;
  eventType: string;
};

export type TriggerEventActionConfig = BaseEventActionConfig;

export type AttachEventActionConfig = BaseEventActionConfig & {
  handler: AnyFunction;
};

export type DetachEventActionConfig = AttachEventActionConfig;

export const createTriggerEventAction: RuntimeActionCreator<
  TriggerEventActionConfig,
  TriggerEventAction
> = config => {
  const { eventType, target } = config;

  return { type: TRIGGER_EVENT_ACTION_TYPE, target, eventType };
};

export const createAttachEventAction: RuntimeActionCreator<
  AttachEventActionConfig,
  AttachEventAction
> = config => {
  const { eventType, target, handler } = config;

  return { type: ATTACH_EVENT_ACTION_TYPE, eventType, target, handler };
};

export const createDetachEventAction: RuntimeActionCreator<
  DetachEventActionConfig,
  DetachEventAction
> = config => {
  const { eventType, target, handler } = config;

  return { type: DETACH_EVENT_ACTION_TYPE, target, eventType, handler };
};
