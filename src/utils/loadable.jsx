import React from 'react';
import Loadable from 'react-loadable';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Loader from '../components/Loader';

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
        <Typography data-public variant="h4">Loading</Typography>
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

function Loading({ error, timedOut, pastDelay }) {
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

export default loader =>
  Loadable({
    loader,
    loading: Loading,
  });
