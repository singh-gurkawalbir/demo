import React from 'react';
import { makeStyles, Snackbar, LinearProgress, Paper, Typography } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  paper: {
    width: 150,
    padding: theme.spacing(1.5, 0.75),
    borderRadius: 6,
  },
  progressBar: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  text: {
    margin: theme.spacing(0, 0.75),
  },
}));

export default function NetworkSnackbar() {
  const classes = useStyles();
  const {isLoading, isRetrying} = useSelector(
    state => selectors.commsSummary(state),
    shallowEqual
  );

  if (!isLoading && !isRetrying) {
    return null;
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open>
      <Paper elevation={2} className={classes.paper}>
        <Typography className={classes.text} variant="body2">
          {isRetrying ? 'Retrying' : 'Loading'}...
        </Typography>
        <LinearProgress color="primary" className={classes.progressBar} />
      </Paper>
    </Snackbar>
  );
}
