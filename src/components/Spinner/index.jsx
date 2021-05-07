import React from 'react';
import clsx from 'clsx';
import { makeStyles, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
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
      width: props => props.centerAll ? '48px !important' : '',
      height: props => props.centerAll ? '48px !important' : '',
    },
  },
  spinnerChildren: {
    paddingLeft: theme.spacing(1),
  },
  extraSmall: {
    width: `${theme.spacing(1)}px !important`,
    height: `${theme.spacing(1)}px !important`,
  },
  small: {
    width: `${theme.spacing(2)}px !important`,
    height: `${theme.spacing(2)}px !important`,
  },
  medium: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
  },
  large: {
    width: `${theme.spacing(6)}px !important`,
    height: `${theme.spacing(6)}px !important`,
  },
  spinnerWithChildren: {
    alignItems: 'center',
    display: 'flex',
  },
  loadingWithChildren: {
    justifyContent: 'center',
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

  return (
    <div
      className={clsx(
        {[classes.spinnerWrapper]: centerAll},
        {[classes.spinnerWithChildren]: children},
        {[classes.loadingWithChildren]: loading},
        className)}>
      {progress} {children && <div className={classes.spinnerChildren}>{children}</div> }
    </div>
  );
}

Spinner.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'large']),
  centerAll: PropTypes.bool,
  loading: PropTypes.bool,
};

