import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography} from '@material-ui/core';
import Spinner from '../Spinner';
import TertiaryButton from '../CeligoButtons/TertiaryButton';

const useStyles = makeStyles(theme => ({
  fetchLogTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'unset',
    color: theme.palette.secondary.light,
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
    <div className={classes.fetchLogTextWrapper}>
      <Typography variant="body2" component="span" className={classes.fetchLogTextWrapper} >
        {fetchInProgress
          ? (<> <Spinner size="small" className={classes.spinner} /> Fetching logs... {percentDone}% completed </>)
          : <>Fetching paused... {percentDone}% completed</>}
      </Typography>
      {fetchInProgress ? (
        <TertiaryButton
          data-test="pauseFetch"
          fontWeight="bold"
          onClick={pauseHandler}
          >
          Pause
        </TertiaryButton>
      ) : (
        <TertiaryButton
          data-test="resumeFetch"
          fontWeight="bold"
          onClick={resumeHandler}
         >
          Resume
        </TertiaryButton>
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
