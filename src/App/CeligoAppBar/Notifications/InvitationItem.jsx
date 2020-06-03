import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Grid } from '@material-ui/core';
import DismissIcon from '../../../components/icons/ErrorIcon';
import AcceptIcon from '../../../components/icons/SuccessIcon';

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
  name,
  email,
  message,
  onActionClick,
}) {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" className={classes.root}>
      <Grid item>
        <Typography variant="h4">{name}</Typography>
        <Typography className={classes.email}>{email}</Typography>
        <Typography variant="body2">{message}</Typography>
        <Typography>Please accept or decline this invitation.</Typography>
      </Grid>
      <Grid item className={classes.actions}>
        <IconButton
          size="small"
          className={classes.acceptButton}
          data-test={`accept ${type} share`}
          aria-label="Accept"
          onClick={onActionClick(type, 'accept', id)}>
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
