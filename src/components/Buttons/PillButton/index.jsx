import React from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '17px',
  },
  fill: {
    fontFamily: 'Roboto500',
    borderColor: theme.palette.primary.main,
    background: theme.palette.primary.main,
    color: theme.palette.background.paper,
    '&:hover': {
      color: theme.palette.background.paper,
      background: theme.palette.primary.light,
    },

  },
}));

// Todo: Remove this file, once the changes from master are integrated
export default function PillButton({fill, className, ...rest}) {
  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      className={clsx(classes.root, {[classes.fill]: fill}, className)}
      {...rest} />
  );
}

PillButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fill: PropTypes.bool,
};

PillButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
  fill: false,
};
