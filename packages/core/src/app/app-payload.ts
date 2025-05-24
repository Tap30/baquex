import appPayload from "./app-payload.json" with { type: "json" };

type AppPayload = {
  mainEntry: string;
};

export const APP_PAYLOAD: AppPayload = appPayload;
