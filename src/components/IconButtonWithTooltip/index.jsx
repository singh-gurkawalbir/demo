import { IconButton, Tooltip } from '@material-ui/core';

export default function IconButtonWithTooltip({
  tooltipProps = {},
  children,
  ...buttonProps
}) {
  return (
    <Tooltip key={tooltipProps.title} {...tooltipProps}>
      <IconButton {...buttonProps}>{children}</IconButton>
    </Tooltip>
  );
}
