import type { BaquexComponent } from "../../../element/types.ts";
import { BaseButton } from "../../internals/BaseButton.tsx";
import type { IconButtonProps } from "./types.ts";

export const IconButtonComponent: BaquexComponent<
  IconButtonProps,
  HTMLAnchorElement | HTMLButtonElement
> = props => {
  const { ref, icon, screenReaderLabel, ...otherProps } = props;

  return (
    <BaseButton
      {...otherProps}
      ref={ref}
      aria-label={screenReaderLabel}
    >
      <div aria-hidden>{icon}</div>
    </BaseButton>
  );
};
