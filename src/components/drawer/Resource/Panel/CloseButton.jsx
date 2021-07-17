import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Close from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import useFormOnCancel from '../../../FormOnCancelContext';

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
  const disabled = useSelector(state =>
    selectors.isAsyncTaskLoading(state, formKey));
  const {setCancelTriggered} = useFormOnCancel(formKey);

  return (
    <IconButton
      data-test="closeDrawer"
      className={classes.closeButton}
      disabled={disabled}
      onClick={setCancelTriggered}>
      <Close />
    </IconButton>
  );
}
