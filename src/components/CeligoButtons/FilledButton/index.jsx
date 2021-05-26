import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  error: {
    background: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.error.dark,
      borderColor: theme.palette.error.dark,
    },
  },
}));

export default function FilledButton(props) {
  const classes = useStyles();
  const {children, error, ...rest} = props;

  return (
    <Button
      variant="contained"
      className={clsx({[classes.error]: error})}
      color="primary"
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}

FilledButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
};

FilledButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
