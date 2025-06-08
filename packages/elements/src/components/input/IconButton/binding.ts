import { createElementBinding } from "../../../element/create-element-binding.ts";
import { IconButtonComponent } from "./Component.tsx";
import { IconButtonElement } from "./element.ts";

export const iconButtonBinding = createElementBinding(
  IconButtonElement,
  IconButtonComponent,
);
