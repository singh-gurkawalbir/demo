import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.secondary.light,
    fontSize: 'inherit',
  },
  buttonWrapper: {
    color: theme.palette.primary.main,
    fontFamily: 'source sans pro semibold',
  },
  spinner: {
    marginRight: theme.spacing(1),
  },
}));

export default function FetchProgressIndicator({
  // we could also have a local state and action
  // which stores all below values and thus this component can read them
  // via useSelector. We can enhance this based on the demand of the component
  fetchStatus,
  pauseHandler,
  resumeHandler,
  startTime,
  endTime,
  currTime,
}) {
  const end = endTime || Date.now();
  const classes = useStyles();
  const fetchInProgress = fetchStatus === 'inProgress';
  const fetchPaused = fetchStatus === 'paused';

  if ((!fetchInProgress && !fetchPaused) || !startTime) {
    return null;
  }
  const percentDone = Math.round(((end - currTime) / (end - startTime)) * 100) || 0;

  // ideally this should not happen
  // but adding a safety check to not render these values in UI
  if (percentDone < 0 || percentDone > 100) {
    return null;
  }

  return (
    <div>
      <Typography variant="body2" component="span" className={classes.title} >
        {fetchInProgress
          ? (<> <Spinner size="small" className={classes.spinner} /> Fetching logs... {percentDone}% completed </>)
          : <>Fetching paused... {percentDone}% completed</>}
      </Typography>
      {fetchInProgress ? (
        <Button
          data-test="pauseFetch"
          variant="text"
          color="primary"
          onClick={pauseHandler}
          className={classes.buttonWrapper} >
          Pause
        </Button>
      ) : (
        <Button
          data-test="resumeFetch"
          variant="text"
          color="primary"
          onClick={resumeHandler}
          className={classes.buttonWrapper}>
          Resume
        </Button>
      )}
    </div>
  );
}

FetchProgressIndicator.propTypes = {
  fetchStatus: PropTypes.oneOf(['inProgress', 'paused', 'completed']),
  pauseHandler: PropTypes.func.isRequired,
  resumeHandler: PropTypes.func.isRequired,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  currTime: PropTypes.number,
};
