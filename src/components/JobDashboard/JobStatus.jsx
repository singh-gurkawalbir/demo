import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import DashboardTag from '../tags/DashboardTag';
import Spinner from '../Spinner';
import { getJobStatusDetails } from '../../utils/jobdashboard';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import InfoIconButton from '../InfoIconButton';
import { selectors } from '../../reducers';

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
    history.push(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V1.INTEGRATION_LEVEL_QUEUED_JOBS,
      baseUrl: match.url,
      params: { flowId: job._flowId },
    }));
  }, [history, job._flowId, match.url]);

  const _integrationId = useSelector(state => selectors.getParentIntegrationId(state, match.params.integrationId));
  const integrationsUsers = useSelector(state => selectors.availableUsersList(state, _integrationId));

  if (!jobStatusDetails) return '';

  if (jobStatusDetails.showStatusTag) {
    if (jobStatusDetails.canceledBy) {
      const user = integrationsUsers.find(user => user.sharedWithUser?._id === jobStatusDetails.canceledBy);
      const userName = jobStatusDetails.canceledBy === 'system' ? 'system' : user?.sharedWithUser?.name || user?.sharedWithUser?.email || jobStatusDetails.canceledBy;

      return (
        <Box display="flex">
          <DashboardTag color={jobStatusDetails.variant} label={jobStatusDetails.status} />
          <Box>
            <InfoIconButton info={`Canceled by ${userName}`} size="xs" placement="right" basicInfo />
          </Box>
        </Box>
      );
    }

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
