import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: props => props.bold ? 'Roboto500' : 'Roboto400',
    '&:focus': {
      color: props => props.color === 'secondary' ? theme.palette.text.secondary : theme.palette.primary.main,
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
}));
export default function TextButton(props) {
  const classes = useStyles(props);
  const {children, error, bold, underline, className, ...rest} = props;

  return (
    <Button
      variant="text"
      color="secondary"
      className={clsx(classes.root, {[classes.error]: error}, {[classes.underline]: underline, className})}
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
};

TextButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
};
