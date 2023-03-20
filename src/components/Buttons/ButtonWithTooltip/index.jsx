import React from 'react';
import { Tooltip } from '@mui/material';

export default function ButtonWithTooltip({
  tooltipProps = {},
  children,
  className,
}) {
  return (
    tooltipProps?.title
      ? (
        <Tooltip key={tooltipProps.title} {...tooltipProps} className={className}>
          <span>
            {children}
          </span>
        </Tooltip>
      ) : <span>{children}</span>
  );
}
