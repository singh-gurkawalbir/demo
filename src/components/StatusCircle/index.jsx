import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '5px',
  },
  large: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  small: {
    width: 12,
    height: 12,
  },
  mini: {
    width: 9,
    height: 9,
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

export default function StatusCircle({ variant, size = 'large', className }) {
  const classes = useStyles();

  return (
    <span
      className={clsx(classes[size], classes[variant], classes.root, className)}
    />
  );
}

StatusCircle.propTypes = {
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  size: PropTypes.oneOf(['mini', 'small', 'large']),
};
