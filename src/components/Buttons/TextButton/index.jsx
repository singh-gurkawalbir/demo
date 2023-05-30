import React from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: props => props.bold ? 'Roboto500' : 'Roboto400',
    '&:focus': {
      color: props => props.color === 'secondary' ? theme.palette.text.primary : theme.palette.primary.main,
    },
  },
  error: {
    color: theme.palette.error.dark,
    '&:hover': {
      color: theme.palette.error.main,
    },
    '&:focus': {
      color: `${theme.palette.error.main} !important`,
    },
  },
  underline: {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
    },
  },
  vertical: {
    '& > .MuiButton-label': {
      flexDirection: 'column',
    },
  },
}));

// Todo: Remove this file, once the changes from master are integrated
export default function TextButton(props) {
  const classes = useStyles(props);
  const {children, error, bold, vertical = false, underline, className, ...rest} = props;

  return (
    <Button
      variant="text"
      color="secondary"
      className={clsx(classes.root, {[classes.error]: error}, {[classes.underline]: underline}, {[classes.vertical]: vertical}, className)}
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}

TextButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  bold: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  error: PropTypes.bool,
  vertical: PropTypes.bool,
};

TextButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
};
