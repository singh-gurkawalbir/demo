import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  error: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.common.white,
      borderColor: theme.palette.error.dark,
      color: theme.palette.error.dark,
    },
  },
}));

export default function OutlinedButton(props) {
  const classes = useStyles();
  const {children, className, error, ...rest} = props;

  return (
    <Button
      variant="outlined"
      className={clsx({[classes.error]: error}, className)}
      color="primary"
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}

OutlinedButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

OutlinedButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
