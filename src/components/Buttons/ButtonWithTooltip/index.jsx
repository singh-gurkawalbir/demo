import React from 'react';
import { Tooltip } from '@material-ui/core';

export default function ButtonWithTooltip({
  tooltipProps = {},
  children,
}) {
  return (
    <Tooltip data-public key={tooltipProps.title} {...tooltipProps}>
      {/* Icon button also accepts disabled property. Tooltip expects its children to be in active state and listen to events.
      Hence wrapping it with div */}
      <span>
        {children}
      </span>
    </Tooltip>
  );
}
