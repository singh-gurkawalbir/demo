import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StatusCircle from '../../StatusCircle';

const useStyles = makeStyles(theme => ({
  root: {
    '& > * .MuiButton-startIcon': {
      marginRight: 0,
    },
  },
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

export default function StatusButton(props) {
  const classes = useStyles();
  const {children, error, variant, onClick, ...rest} = props;

  return (
    <Button
      variant="text"
      color="primary"
      className={clsx(classes.root, {[classes.error]: error})}
      disableElevation
      onClick={onClick}
      startIcon={<StatusCircle variant={variant} />}
      {...rest}>
      {children}
    </Button>
  );
}

StatusButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

StatusButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
