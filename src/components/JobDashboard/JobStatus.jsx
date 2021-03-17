import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import StatusTag from '../StatusTag';
import Spinner from '../Spinner';
import { getJobStatusDetails } from './util';

const useStyles = makeStyles(theme => ({
  state: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  spinnerWrapper: {
    marginRight: theme.spacing(1),
  },
  link: {
    fontFamily: 'Roboto400',
    color: theme.palette.primary.main,
    padding: 0,
    '&:hover': {
      color: theme.palette.primary.light,
      background: 'none',
    },
  },
}));

export default function JobStatus({ job }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const jobStatusDetails = getJobStatusDetails(job);
  const isJobInQueuedStatus =
    job.type === 'flow' &&
    (job.status === 'queued' ||
      (job.status === 'running' && !job.doneExporting));
  const handleQueuedJobsClick = useCallback(() => {
    history.push(`${match.url}/flows/${job._flowId}/queuedJobs`);
  }, [history, job._flowId, match.url]);

  if (jobStatusDetails.showStatusTag) {
    return (
      <StatusTag
        variant={jobStatusDetails.variant}
        label={jobStatusDetails.status}
        errorValue={jobStatusDetails.errorValue}
        resolvedValue={jobStatusDetails.resolvedValue}
      />
    );
  }

  if (jobStatusDetails.showSpinner) {
    return (
      <>
        {!isJobInQueuedStatus && (
          <div className={classes.state}>
            <div className={classes.spinnerWrapper}>
              <Spinner size="extraSmall" />
            </div>
            {jobStatusDetails.status}
          </div>
        )}
        {isJobInQueuedStatus && (
          <div className={classes.state}>
            <div className={classes.spinnerWrapper}>
              <Spinner size="extraSmall" />
            </div>
            <Button
              variant="text"
              color="secondary"
              className={classes.link}
              onClick={handleQueuedJobsClick}>
              {jobStatusDetails.status}
            </Button>
          </div>
        )}
      </>
    );
  }

  return jobStatusDetails.status;
}
