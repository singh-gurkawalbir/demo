import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
      width: props => `${props.resolvedCount}%`,
    },
    '&:before': {
      width: props => `${props.errorCount}%`,
      left: props => `calc(100% - ${(props.errorCount + props.resolvedCount)}%)`,
    },
  },
  errorCountOnly: {
    '&:before': {
      width: props => `${props.errorCount}%`,
      left: props => `calc(100% - ${props.errorCount}%)`,
    },
  },
  resolvedCountOnly: {
    '&:after': {
      width: props => `${props.resolvedCount}%`,
      left: props => `calc(100% - ${props.resolvedCount}%)`,
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

export default function DashboardTag(props) {
  const {
    color,
    errorCount,
    resolvedCount,
    label,
  } = props;
  const classes = useStyles(props);

  return (
    <div
      className={clsx(
        classes.root,
        classes[color],
        errorCount && !resolvedCount && classes.errorCountOnly,
        resolvedCount && !errorCount && classes.resolvedCountOnly,
        errorCount && resolvedCount && classes.bothValues,
        (errorCount || resolvedCount) && classes.values,
      )}
      >
      {errorCount || resolvedCount ? (
        <span className={classes.customLabel}>{label}</span>
      ) : (
        label
      )}
    </div>
  );
}

DashboardTag.propTypes = {
  errorCount: PropTypes.number,
  resolvedCount: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.oneOf([
    'info',
    'warning',
    'error',
    'success',
  ]),
};

DashboardTag.defaultProps = {
  color: 'info',
  errorCount: 0,
  resolvedCount: 0,
};
