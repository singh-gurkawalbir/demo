import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, IconButton, Grid } from '@mui/material';
import DismissIcon from '../../../components/icons/ErrorIcon';
import AcceptIcon from '../../../components/icons/SuccessIcon';
import {message as messageStoreMessage} from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  acceptButton: {
    color: theme.palette.success.main,
  },
  dismissButton: {
    color: theme.palette.error.main,
  },
  actions: {
    marginLeft: theme.spacing(3),
  },
  email: {
    marginBottom: theme.spacing(0.5),
  },
}));

export default function InvitationItem({
  type,
  id,
  isAccountTransfer,
  name,
  email,
  onActionClick,
  message,
}) {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" justifyContent="space-between" className={classes.root}>
      <Grid item>
        <Typography variant="h4">{name}</Typography>
        <Typography className={classes.email}>{email}</Typography>
        <Typography variant="body2">{message}</Typography>
        <Typography>{messageStoreMessage.USER_SIGN_IN.INVITE}</Typography>
      </Grid>
      <Grid className={classes.actions}>
        <IconButton
          size="small"
          className={classes.acceptButton}
          data-test={`accept ${type} share`}
          aria-label="Accept"
          onClick={onActionClick(type, 'accept', id, isAccountTransfer)}>
          <AcceptIcon />
        </IconButton>
        <IconButton
          size="small"
          className={classes.dismissButton}
          data-test={`dismiss ${type} share`}
          aria-label="Dismiss"
          onClick={onActionClick(type, 'reject', id)}>
          <DismissIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
