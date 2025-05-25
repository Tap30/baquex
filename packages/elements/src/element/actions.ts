export type TriggerEventAction = {
  type: typeof TRIGGER_EVENT_ACTION_TYPE;
  eventType: string;
};

export type ElementAction = TriggerEventAction;
export type ElementActionCreator<Config, Action> = (config: Config) => Action;
export type ElementActionPerformer = (action: ElementAction) => void;

const TRIGGER_EVENT_ACTION_TYPE = Symbol("baquex.action.event.trigger");

export const ActionTypes = {
  TRIGGER_EVENT: TRIGGER_EVENT_ACTION_TYPE,
} as const;

export const createTriggerEventAction: ElementActionCreator<
  { eventType: string },
  TriggerEventAction
> = config => {
  const { eventType } = config;

  return { type: ActionTypes.TRIGGER_EVENT, eventType };
};
