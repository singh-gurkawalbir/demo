import React from 'react';
import { makeStyles, Snackbar, LinearProgress, Paper, Typography } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';

const useStyles = makeStyles(theme => ({
  snackbar: {
    zIndex: 1401,
  },
  paper: {
    width: 150,
    padding: theme.spacing(1.5),
    borderRadius: 6,
  },
  progressBar: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default function LoadingNotification() {
  const classes = useStyles();
  const {isLoading, isRetrying} = useSelector(
    state => selectors.commsSummary(state),
    shallowEqual
  );

  if (!isLoading && !isRetrying) {
    return null;
  }

  return (
    <Snackbar open classes={{root: classes.snackbar}} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Paper elevation={2} className={classes.paper}>
        <Typography data-public variant="body2">
          {isRetrying ? 'Retrying' : 'Loading'}...
        </Typography>
        <LinearProgress color="primary" className={classes.progressBar} />
      </Paper>
    </Snackbar>
  );
}
