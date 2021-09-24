import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: 12,
    borderRadius: 2,
    display: 'flex',
    fontFamily: 'source sans pro',
    color: theme.palette.background.paper,
    justifyContent: 'center',
    width: '80px !important',
    height: '20px !important',
    alignItems: 'center',
    lineHeight: 1,
  },
  default: {
    background: theme.palette.secondary.lightest,
    color: theme.palette.secondary.light,
  },
  realtime: {
    backgroundColor: theme.palette.secondary.light,
  },
  success: {
    backgroundColor: theme.palette.success.dark,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  values: {
    position: 'relative',
    width: 70,
    height: 22,
    boxSizing: 'border-box',
    overflow: 'hidden',
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 2,
      right: 0,
      background: theme.palette.primary.main,
      bottom: 0,
      top: 0,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      zIndex: 2,
      background: theme.palette.error.dark,
      bottom: 0,
      top: 0,
    },
  },
  bothValues: {
    '&:after': {
      width: props => `${props.resolvedValue}%`,
    },
    '&:before': {
      width: props => `${props.errorValue}%`,
      left: props => `calc(100% - ${(props.errorValue + props.resolvedValue)}%)`,
    },
  },
  errorValueOnly: {
    '&:before': {
      width: props => `${props.errorValue}%`,
      left: props => `calc(100% - ${props.errorValue}%)`,
    },
  },
  resolvedValueOnly: {
    '&:after': {
      width: props => `${props.resolvedValue}%`,
      left: props => `calc(100% - ${props.resolvedValue}%)`,
    },
  },
  customLabel: {
    position: 'absolute',
    zIndex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    left: 0,
  },
}));

export default function Tag(props) {
  const {
    variant = 'default',
    errorValue,
    resolvedValue,
    className,
    label,
    ...other
  } = props;
  const classes = useStyles(props);

  return (
    <div
      className={clsx(
        classes.root,
        classes[variant],
        errorValue && !resolvedValue && classes.errorValueOnly,
        resolvedValue && !errorValue && classes.resolvedValueOnly,
        errorValue && resolvedValue && classes.bothValues,
        (errorValue || resolvedValue) && classes.values,

        className
      )}
      {...other}>
      {errorValue || resolvedValue ? (
        <span className={classes.customLabel}>{label}</span>
      ) : (
        label
      )}
    </div>
  );
}

Tag.propTypes = {
  variant: PropTypes.oneOf([
    'default',
    'info',
    'warning',
    'error',
    'success',
    'realtime',
  ]),
};

Tag.defaultProps = {
  variant: 'default',
};
/*
<Tag color="info" label="Info" />
<Tag color="warn" label="Warn" />
<Tag color="success" label="Info" />
<Tag color="error" label="Info" />
*/
