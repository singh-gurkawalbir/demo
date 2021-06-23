import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StatusCircle from '../../StatusCircle';

const useStyles = makeStyles(theme => ({
  textRoot: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
  },
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
  const {children, className, error, size, type, variant, onClick, ...rest} = props;

  if (type === 'text') {
    return (
      <div className={clsx(classes.textRoot, className)}>
        <StatusCircle variant={variant} size={size} />
        {children}
      </div>
    );
  }

  return (
    <Button
      variant="text"
      color="primary"
      className={clsx(classes.root, {[classes.error]: error}, className)}
      disableElevation
      onClick={onClick}
      startIcon={<StatusCircle variant={variant} size={size} />}
      {...rest}>
      {children}
    </Button>
  );
}

StatusButton.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['mini', 'small', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

StatusButton.defaultProps = {
  color: 'primary',
  size: 'small',
};
