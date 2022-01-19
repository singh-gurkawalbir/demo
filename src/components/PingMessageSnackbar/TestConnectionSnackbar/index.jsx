import React from 'react';
import {makeStyles, Typography, Snackbar, LinearProgress} from '@material-ui/core';
import { TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  container: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderRadius: 4,
    boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    width: 350,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(-0.5),
  },
}));

export default function TestConnectionSnackbar({onCancel}) {
  const classes = useStyles();

  return (
    <Snackbar
      open
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
  >
      <div className={classes.container}>
        <div className={classes.content}>
          <Typography>Testing your connection...</Typography>
          <TextButton
            bold
            className={classes.button}
            data-test="cancelTestCall"
            onClick={onCancel}>
            Cancel
          </TextButton>
        </div>
        <LinearProgress />
      </div>
    </Snackbar>
  );
}
