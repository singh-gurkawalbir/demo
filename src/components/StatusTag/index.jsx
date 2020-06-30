import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5, 1),
    fontSize: 12,
    borderRadius: 4,
    display: 'inline-block',
    color: theme.palette.background.paper,
  },
  default: {
    background: theme.palette.secondary.lightest,
    color: theme.palette.secondary.light,
  },
  realtime: {
    backgroundColor: theme.palette.secondary.light,
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
      background: theme.palette.error.main,
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
      left: props => `calc(100% - ${props.errorValue}%)`,
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
    top: 0,
  },
}));

function StatusTag(props) {
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

StatusTag.propTypes = {
  variant: PropTypes.oneOf([
    'default',
    'info',
    'warning',
    'error',
    'success',
    'realtime',
  ]),
};

StatusTag.defaultProps = {
  variant: 'default',
};

export default StatusTag;
