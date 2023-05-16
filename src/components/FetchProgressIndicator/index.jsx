import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Typography} from '@mui/material';
import { Spinner, TextButton } from '@celigo/fuse-ui';

const useStyles = makeStyles(theme => ({
  fetchLogTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'unset',
    color: theme.palette.secondary.light,
    paddingBottom: 2,
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
  className,
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
    <div className={clsx(classes.fetchLogTextWrapper, className)}>
      <Typography variant="body2" component="div" className={classes.fetchLogTextWrapper} >
        {fetchInProgress
          ? (
            <> <Spinner
              size="small"
              sx={{
                mr: 0.5,
                display: 'flex',
                alignItems: 'center'}} /> Fetching logs... {percentDone}% completed
            </>
          )
          : <>Fetching paused... {percentDone}% completed</>}
      </Typography>
      {fetchInProgress ? (
        <TextButton
          data-test="pauseFetch"
          bold
          onClick={pauseHandler}
          >
          Pause
        </TextButton>
      ) : (
        <TextButton
          data-test="resumeFetch"
          bold
          onClick={resumeHandler}
         >
          Resume
        </TextButton>
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
