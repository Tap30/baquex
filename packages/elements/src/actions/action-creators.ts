import { ActionTypes } from "./action-types.ts";
import type { ElementActionCreator, TriggerEventAction } from "./types.ts";

export const createTriggerEventAction: ElementActionCreator<
  { eventType: string },
  TriggerEventAction
> = config => {
  const { eventType } = config;

  return { type: ActionTypes.TRIGGER_EVENT, eventType };
};
