import React from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  error: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.background.paper,
      borderColor: theme.palette.error.main,
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
