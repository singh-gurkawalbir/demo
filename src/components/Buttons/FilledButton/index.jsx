import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
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
      borderColor: theme.palette.error.main,
    },
    '&:focus': {
      background: theme.palette.error.dark,
      borderColor: theme.palette.error.main,
    },
  },
}));

export default function FilledButton({error, className, ...rest}) {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      className={clsx({[classes.error]: error}, className)}
      {...rest} />
  );
}

FilledButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

FilledButton.defaultProps = {
  color: 'primary',
  size: 'medium',
  disabled: false,
  error: false,
};
