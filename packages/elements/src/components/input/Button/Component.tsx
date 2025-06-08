import type { BaquexComponent } from "../../../element/types.ts";
import { BaseButton } from "../../internals/BaseButton.tsx";
import type { ButtonProps } from "./types.ts";

export const ButtonComponent: BaquexComponent<
  ButtonProps,
  HTMLAnchorElement | HTMLButtonElement
> = props => {
  const { ref, text, endIcon, startIcon, ...otherProps } = props;

  const renderStartIcon = () => {
    if (!startIcon) return null;

    return <div aria-hidden>{startIcon}</div>;
  };

  const renderEndIcon = () => {
    if (!endIcon) return null;

    return <div aria-hidden>{endIcon}</div>;
  };

  return (
    <BaseButton
      {...otherProps}
      ref={ref}
    >
      {renderStartIcon()}
      <span>{text}</span>
      {renderEndIcon()}
    </BaseButton>
  );
};
