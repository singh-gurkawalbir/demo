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
    '& >.MuiCircularProgress-root': {
      width: props => props.centerAll && !props.size ? '48px' : '',
      height: props => props.centerAll && !props.size ? '48px' : '',
    },
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
  spinnerWithChildren: {
    alignItems: 'center',
    display: 'flex',
  },
}));

/**
 * Render an indeterminate spinning indicator.
 */
export default function Spinner(props) {
  const classes = useStyles(props);
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
    <div className={clsx({[classes.spinnerWrapper]: centerAll}, {[classes.spinnerWithChildren]: children}, className)}>
      {progress} {children && <div className={classes.spinnerChildren}>{children}</div> }
    </div>
  );
}

Spinner.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  centerAll: PropTypes.bool,
};

