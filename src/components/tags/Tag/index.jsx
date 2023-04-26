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
}));

export default function Tag({color, className, label}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.root,
        classes[color],
        className
      )}>
      {label}
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'info',
    'warning',
    'error',
    'success',
  ]),
};

Tag.defaultProps = {
  color: 'default',
};
