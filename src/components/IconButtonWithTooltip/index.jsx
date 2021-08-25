import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

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
  ...buttonProps
}) {
  const classes = useStyles();

  return (
    <Tooltip data-public key={tooltipProps.title} {...tooltipProps}>
      {/* Icon button also accepts disabled property. Tooltip expects its children to be in active state and listen to events.
      Hence wrapping it with div */}

      <span>
        <IconButton
          className={classes.actionButtonWithTooltip}
          {...buttonProps}
          size={buttonSize?.size || 'medium'}>
          {children}
        </IconButton>
      </span>

    </Tooltip>
  );
}
