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
}));

export default function MessageWrapper(props) {
  const classes = useStyles();
  const {children, size = 'medium', className} = props;

  return (
    <div className={clsx(classes.root, classes[size], className)}>
      <Typography>{children}</Typography>
    </div>
  );
}

MessageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
MessageWrapper.defaultProps = {
  size: 'medium',
};
