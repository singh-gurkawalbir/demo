import React from 'react';
import { Tooltip } from '@material-ui/core';

export default function ButtonWithTooltip({
  tooltipProps = {},
  children,
}) {
  return (
    <Tooltip data-public key={tooltipProps.title} {...tooltipProps}>
      <span>
        {children}
      </span>
    </Tooltip>
  );
}
