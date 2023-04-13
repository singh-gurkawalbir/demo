import React from 'react';
import clsx from 'clsx';
import { IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  editorButton: {
    marginLeft: theme.spacing(1),
    display: 'inline-block',
    padding: 0,
    borderRadius: 2,
    color: theme.palette.secondary.light,
    cursor: 'pointer',
    '&:hover': {
      background: 'transparent',
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
    '&:first-child': {
      marginRight: 0,
    },
  },
}));

export default function ActionButton({ className, children, placement, tooltip = '', ...props }) {
  const classes = useStyles();

  return (
  // The strange looking open property expression disables the tooltip for any action button
  // which does not have a tooltip. If anyone has a more elegant way to do this, plmk. (Dave Riedl)

    // TODO:(Dave) Tooltip title is a default required prop, undefined throwing a warning
    <Tooltip
      open={tooltip ? undefined : false} placement={placement} title={tooltip}
      aria-label={tooltip}>
      <IconButton
        role="button"
        className={clsx(classes.editorButton, className)}
        {...props}
        aria-label={tooltip}
        size="large">
        <span>{children}</span>
      </IconButton>
    </Tooltip>
  );
}

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

ActionButton.defaultProps = {
  placement: 'top',
};

