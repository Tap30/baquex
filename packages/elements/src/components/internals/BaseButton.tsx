import type { BaquexComponentProps } from "../../element/types.ts";

export type BaseButtonProps = {
  /**
   * The content of the component.
   */
  children: React.ReactNode;

  /**
   * The visual style variant of the button.
   * Defaults to `"filled"`.
   *
   * @default "filled"
   */
  variant?: "filled" | "outlined" | "ghost";

  /**
   * The color scheme of the button.
   * Defaults to `"primary"`.
   *
   * @default "primary"
   */
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";

  /**
   * The size of the button.
   * Defaults to `"medium"`.
   *
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * If true, the button will be disabled and non-interactive.
   * Defaults to `false`.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, a loading indicator will be displayed inside the button.
   * Defaults to `false`.
   *
   * @default false
   */
  pending?: boolean;

  /**
   * The URL to navigate to when the button is clicked.
   * If provided, the button will behave like a link.
   */
  href?: string;

  /**
   * The filename to use when downloading the linked resource.
   * If not specified, the browser will determine a filename.
   * This is only applicable when the button is used as a link (`href` is set).
   */
  download?: string;

  /**
   * Where to display the linked `href` URL for a link button. Common options include
   * `_blank` to open in a new tab. When the `target` is set to `_blank`, the `rel` attribute
   * of the anchor tag will automatically be set to `"noopener noreferrer"` to enhance
   * security and prevent potential tab exploitation.
   */
  target?: "_blank" | "_parent" | "_self" | "_top";

  "aria-label"?: string;
};

export const BaseButton = (
  props: BaquexComponentProps<
    BaseButtonProps,
    HTMLAnchorElement | HTMLButtonElement
  >,
): React.ReactNode => {
  const {
    ref,
    href,
    download,
    target,
    children,
    color = "primary",
    disabled = false,
    pending = false,
    size = "medium",
    variant = "filled",
    ...otherProps
  } = props;

  const isLink = typeof href === "string";
  const Root = isLink ? "a" : "button";
  const rel = isLink && target === "_blank" ? "noopener noreferrer" : undefined;

  return (
    <Root
      {...otherProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as React.Ref<any>}
      disabled={isLink ? undefined : disabled}
      download={isLink ? download : undefined}
      target={isLink ? target : undefined}
      rel={rel}
    >
      {children}
    </Root>
  );
};
