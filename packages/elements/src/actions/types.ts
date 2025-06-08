import type { TRIGGER_EVENT_ACTION_TYPE } from "./action-types.ts";

export type TriggerEventAction = {
  type: typeof TRIGGER_EVENT_ACTION_TYPE;
  eventType: string;
};

export type ElementAction = TriggerEventAction;
export type ElementActionCreator<Config, Action> = (config: Config) => Action;
export type ElementActionPerformer = (action: ElementAction) => void;
