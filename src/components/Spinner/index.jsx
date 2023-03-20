import React from 'react';
import clsx from 'clsx';
import { CircularProgress, alpha } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: withDrawerHeader => withDrawerHeader ? 63 : 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
    zIndex: theme.zIndex.appBar + 1,
    '& >.MuiCircularProgress-root': {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
  },
  spinnerChildren: {
    paddingLeft: theme.spacing(1),
  },
  extraSmall: {
    width: theme.spacing(1),
    height: theme.spacing(1),
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
    margin: theme.spacing(1),
  },
  spinnerWithChildren: {
    alignItems: 'center',
    display: 'flex',
  },
  loadingWithChildren: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinnerCenterSmall: {
    '& >.MuiCircularProgress-root': {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
  },
  overlayPanel: {
    background: alpha(theme.palette.background.paper, 0.7),
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    margin: 'auto',
  },
}));

/**
 * Render an indeterminate spinning indicator.
 */
export default function Spinner({loading, withDrawerHeader, isOverlay = false, color = 'primary', children, centerAll, size = 'medium', className}) {
  const classes = useStyles(withDrawerHeader);

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
        {[classes.withDrawerHeader]: withDrawerHeader},
        {[classes.spinnerCenterSmall]: centerAll && size === 'small'},
        {[classes.spinnerWithChildren]: children},
        {[classes.loadingWithChildren]: loading},
        {[classes.overlayPanel]: isOverlay},
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
  overlay: PropTypes.bool,
};
