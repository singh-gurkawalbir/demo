import React from 'react';
import Loadable from 'react-loadable';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Loader from '../components/Loader';
import LoadingNotification from '../App/LoadingNotification';

const useStyles = makeStyles(theme => ({
  view: {
    textAlign: 'center',
    margin: 100,
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    overflowX: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  spinner: {
    color: theme.palette.linkHover,
  },
  errorIcon: {
    fontSize: 48,
  },
}));

const Content = ({error, timedOut, pastDelay, classes}) => {
  if (error) {
    throw error;
  } else if (timedOut || pastDelay) {
    return (
      <Loader open>
        <Typography variant="h4">Loading</Typography>
        <CircularProgress
          size={24}
          classes={{
            circleIndeterminate: classes.spinner,
          }}
        />
      </Loader>
    );
  }

  return null;
};

export function Loading({ error, timedOut, pastDelay }) {
  const classes = useStyles();

  return (

    <div className={classes.view}>
      <Content
        error={error}
        timedOut={timedOut}
        pastDelay={pastDelay}
        classes={classes}
      />

    </div>
  );
}

export function flowBuilderLoading({ error, timedOut, pastDelay }) {
  if (error) {
    throw error;
  } else if (timedOut || pastDelay) {
    return (
      <LoadingNotification message="Loading" />
    );
  }

  return null;
}

export default (loader, customLoading = Loading) =>
  Loadable({
    loader,
    loading: customLoading,
  });
