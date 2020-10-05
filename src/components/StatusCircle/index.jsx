import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    margin: [[0, 5]],
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '5px',
  },
  large: {
    width: 24,
    height: 24,
  },
  small: {
    width: 12,
    height: 12,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
}));

function StatusCircle({ variant, size = 'large', className }) {
  const classes = useStyles();

  return (
    <span
      className={clsx(classes[size], classes[variant], classes.root, className)}
    />
  );
}

StatusCircle.propTypes = {
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  size: PropTypes.oneOf(['small', 'large']),
};

export default StatusCircle;
