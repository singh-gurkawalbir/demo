import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '17px',
  },
  fill: {
    borderColor: theme.palette.primary.main,
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
      background: theme.palette.primary.light,
    },
  },
}));

export default function PillButton({fill, ...rest}) {
  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      className={clsx(classes.root, {[classes.fill]: fill})}
      {...rest} />
  );
}

PillButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

PillButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
};
