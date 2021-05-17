import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(1, 2),
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

function PrimaryButton(props) {
  const classes = useStyles();
  const {children, color = 'primary', ...rest} = props;

  return (
    <Button
      variant="contained"
      className={clsx(classes.root, {[classes.error]: color === 'error'})}
      color={color}
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}
export default PrimaryButton;
