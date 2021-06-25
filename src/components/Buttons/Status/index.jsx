import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StatusCircle from '../../StatusCircle';

const useStyles = makeStyles(theme => ({
  statusTextContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
  },
  statusButtonContainer: {
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

export default function Status(props) {
  const classes = useStyles(props);
  const {children, className, error, size, variant, onClick, ...rest} = props;

  if (onClick) {
    return (
      <Button
        variant="text"
        color="primary"
        className={clsx(classes.statusButtonContainer, {[classes.error]: error}, className)}
        disableElevation
        onClick={onClick}
        startIcon={<StatusCircle variant={variant} size={size} />}
        {...rest}>
        {children}
      </Button>
    );
  }

  return (
    <div className={clsx(classes.statusTextContainer, className)}>
      <StatusCircle variant={variant} size={size} />
      {children}
    </div>
  );
}

Status.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['mini', 'small', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

Status.defaultProps = {
  color: 'primary',
  size: 'small',
};
