import React from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Close from '../../../icons/CloseIcon';
import { useFormOnCancel } from '../../../FormOnCancelContext';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
}));

export default function CloseButton({formKey}) {
  const classes = useStyles();
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <IconButton
      data-test="closeDrawer"
      className={classes.closeButton}
      disabled={disabled}
      onClick={setCancelTriggered}
      size="large">
      <Close />
    </IconButton>
  );
}
