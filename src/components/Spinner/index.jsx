import React from 'react';
import clsx from 'clsx';
import { makeStyles, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  center: {
    textAlign: 'center',
  },
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
  },
  spinnerChildren: {
    paddingLeft: theme.spacing(1),
  },
  small: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  medium: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

/**
 * Render an indeterminate spinning indicator.
 */
export default function Spinner(props) {
  const classes = useStyles();
  const { loading, color = 'primary', children, centerAll, className, size = 'medium' } = props;

  const progress = (
    <CircularProgress
      color={color || 'inherit'}
      className={clsx(classes[size], className)}
      size={size}
    />
  );

  if (loading) {
    return <div className={clsx(classes.center, className)}>{progress}</div>;
  }

  return (
    centerAll ? (
      <div className={clsx(classes.spinnerWrapper, className)}>
        {progress} <div className={classes.spinnerChildren}>{children}</div>
      </div>
    ) : progress
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

