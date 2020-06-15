import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  systemStatusWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
    wordBreak: 'break-word',
  },
  wrapper: {
    padding: 12,
    maxWidth: 324,
    display: 'flex',

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& > p': {
      fontSize: 14,
    }
  },
  progressBar: {
    marginTop: theme.spacing(1.5),
    width: '100%',
  },
}));

function SystemStatus({ children, isLoading }) {
  const classes = useStyles();

  return (
    <div className={classes.systemStatusWrapper}>
      <Paper className={classes.wrapper}>
        {children}
        {isLoading && (
          <LinearProgress color="primary" className={classes.progressBar} />
        )}
      </Paper>
    </div>
  );
}

export default SystemStatus;
