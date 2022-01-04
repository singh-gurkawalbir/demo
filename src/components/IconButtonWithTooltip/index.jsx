import React from 'react';
import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  actionButtonWithTooltip: {
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },

}));

export default function IconButtonWithTooltip({
  tooltipProps = {},
  children,
  buttonSize,
  className,
  ...buttonProps
}) {
  const classes = useStyles();

  return (
    <Tooltip key={tooltipProps.title} {...tooltipProps}>
      {/* Icon button also accepts disabled property. Tooltip expects its children to be in active state and listen to events.
      Hence wrapping it with div */}

      <span>
        <IconButton
          className={clsx(classes.actionButtonWithTooltip, className)}
          {...buttonProps}
          size={buttonSize?.size || 'medium'}>
          {children}
        </IconButton>
      </span>

    </Tooltip>
  );
}
