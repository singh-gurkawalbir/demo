import React from 'react';
import clsx from 'clsx';
import { makeStyles, CircularProgress, Typography } from '@material-ui/core';
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
  textSpinner: {
    paddingLeft: theme.spacing(1),
  },
}));

/**
 * Render an indeterminate spinning indicator.
 */
export default function Spinner(props) {
  const classes = useStyles();
  const { loading, color = 'primary', centerAll, message, className, ...rest } = props;
  const progress = (
    <CircularProgress
      color={color || 'inherit'}
      className={className}
      {...rest}
    />
  );

  if (loading) {
    return <div className={clsx(classes.center, className)}>{progress}</div>;
  }

  return (
    centerAll ? (
      <div className={clsx(classes.spinnerWrapper, className)}>
        {progress} <Typography component="span" className={classes.textSpinner}>{message}</Typography>
      </div>
    ) : progress
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
};

