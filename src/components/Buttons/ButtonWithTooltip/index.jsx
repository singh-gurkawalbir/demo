import React from 'react';
import { Tooltip } from '@material-ui/core';

export default function ButtonWithTooltip({
  tooltipProps = {},
  children,
  className,
}) {
  return (
    <Tooltip key={tooltipProps.title} {...tooltipProps} className={className}>
      <span>
        {children}
      </span>
    </Tooltip>
  );
}
