import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import { Box, Spinner } from '@celigo/fuse-ui';
import DashboardTag from '../tags/DashboardTag';
import { getJobStatusDetails } from '../../utils/jobdashboard';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
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
    history.push(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V1.INTEGRATION_LEVEL_QUEUED_JOBS,
      baseUrl: match.url,
      params: { flowId: job._flowId },
    }));
  }, [history, job._flowId, match.url]);

  if (!jobStatusDetails) return '';
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
        <Box display="flex" alignItems="center" whiteSpace="nowrap">
          <Spinner size="small">
            {jobStatusDetails.status}
          </Spinner>
        </Box>
        )}
        {isJobInQueuedStatus && (
        <Box display="flex" alignItems="center" whiteSpace="nowrap">
          <Spinner size="small">
            <Button
              variant="text"
              color="secondary"
              className={classes.link}
              onClick={handleQueuedJobsClick}>
              {jobStatusDetails.status}
            </Button>
          </Spinner>
        </Box>
        )}
      </>
    );
  }

  return jobStatusDetails.status;
}
