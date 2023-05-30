import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  actionButtonWithTooltip: {
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },
  noPadding: {
    padding: 0,
  },

}));

export default function IconButtonWithTooltip({
  tooltipProps = {},
  children,
  buttonSize,
  className,
  noPadding,
  ...buttonProps
}) {
  const classes = useStyles();

  return (
    <Tooltip key={tooltipProps.title} {...tooltipProps}>
      {/* Icon button also accepts disabled property. Tooltip expects its children to be in active state and listen to events.
      Hence wrapping it with div */}

      <IconButton
        className={clsx(classes.actionButtonWithTooltip, {[classes.noPadding]: noPadding}, className)}
        {...buttonProps}
        size={buttonSize?.size || 'medium'}
        sx={{padding: buttonSize?.size === 'small' ? '3px' : 1.5}}>
        {children}
      </IconButton>

    </Tooltip>
  );
}

IconButtonWithTooltip.defaultProps = {
  buttonSize: 'medium',
  noPadding: false,
};

IconButtonWithTooltip.propTypes = {
  noPadding: PropTypes.bool,
  children: PropTypes.element.isRequired,
  tooltipProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  buttonSize: PropTypes.string.oneOf(['small', 'medium', 'large']),
};
