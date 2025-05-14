import type {
  AttachEventAction,
  DetachEventAction,
  TriggerEventAction,
} from "./events.ts";

export type RuntimeAction =
  | TriggerEventAction
  | AttachEventAction
  | DetachEventAction;

export type RuntimeActionCreator<Config, Action> = (config: Config) => Action;
