import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

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
  const {children, variant = 'medium', className} = props;

  return (
    <div className={clsx(classes.root, classes[variant], className)}>
      {children}
    </div>
  );
}

MessageWrapper.defaultProps = {
  variant: 'medium',
};
MessageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
};
