import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  small: {
    padding: theme.spacing(1),
  },
  medium: {
    padding: theme.spacing(2),
  },
  large: {
    padding: theme.spacing(3),
  },
  noPadding: {
    padding: 0,
  },
}));

export default function NoResultTypography({children, size = 'medium', isBackground = false, noPadding = false, className}) {
  const classes = useStyles();

  return (
    <div className={clsx({[classes.root]: isBackground}, classes[size], {[classes.noPadding]: noPadding}, className)}>
      <Typography>{children}</Typography>
    </div>
  );
}

NoResultTypography.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isBackground: PropTypes.bool,
  noPadding: PropTypes.bool,
};
NoResultTypography.defaultProps = {
  size: 'medium',
  noPadding: false,
  isBackground: false,
};
