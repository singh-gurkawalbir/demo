import { IconButton, Tooltip } from '@material-ui/core';

export default function IconButtonWithTooltip({
  tooltipProps = {},
  children,
  ...props
}) {
  const { label, placement } = tooltipProps;

  return (
    <Tooltip key={label} title={label} placement={placement}>
      <IconButton {...props}>{children}</IconButton>
    </Tooltip>
  );
}
