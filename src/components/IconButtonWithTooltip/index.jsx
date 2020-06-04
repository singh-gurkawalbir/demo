import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';

export default function IconButtonWithTooltip({
  tooltipProps = {},
  children,
  ...buttonProps
}) {
  return (
    <Tooltip key={tooltipProps.title} {...tooltipProps}>
      {/* Icon button also accepts disabled property. Tooltip expects its children to be in active state and listen to events.
      Hence wrapping it with div */}
      <div>
        <IconButton {...buttonProps}>{children}</IconButton>
      </div>
    </Tooltip>
  );
}
