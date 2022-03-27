import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import DashboardTag from '../tags/DashboardTag';
import Spinner from '../Spinner';
import { getJobStatusDetails } from '../../utils/jobdashboard';
import { DRAWER_URL_PREFIX } from '../../utils/drawerURLs';

const useStyles = makeStyles(theme => ({
  state: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
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
    history.push(`${match.url}/${DRAWER_URL_PREFIX}/flows/${job._flowId}/queuedJobs`);
  }, [history, job._flowId, match.url]);

  if (jobStatusDetails.showStatusTag) {
    return (
      <DashboardTag
        color={jobStatusDetails.variant}
        label={jobStatusDetails.status}
        errorCount={jobStatusDetails.errorValue}
        resolvedCount={jobStatusDetails.resolvedValue}
      />
    );
  }

  if (jobStatusDetails.showSpinner) {
    return (
      <>
        {!isJobInQueuedStatus && (
          <div className={classes.state}>
            <Spinner size="small">
              {jobStatusDetails.status}
            </Spinner>
          </div>
        )}
        {isJobInQueuedStatus && (
          <div className={classes.state}>
            <Spinner size="small">
              <Button
                variant="text"
                color="secondary"
                className={classes.link}
                onClick={handleQueuedJobsClick}>
                {jobStatusDetails.status}
              </Button>
            </Spinner>
          </div>
        )}
      </>
    );
  }

  return jobStatusDetails.status;
}
