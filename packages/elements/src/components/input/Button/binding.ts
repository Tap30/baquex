import { createElementBinding } from "../../../element/create-element-binding.ts";
import { ButtonComponent } from "./Component.tsx";
import { ButtonElement } from "./element.ts";

export const buttonBinding = createElementBinding(
  ButtonElement,
  ButtonComponent,
);
