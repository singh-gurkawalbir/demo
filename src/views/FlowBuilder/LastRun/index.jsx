import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Divider } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { JOB_STATUS } from '../../../constants';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';
import RefreshIcon from '../../../components/icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
  lastRun: {
    marginRight: theme.spacing(0.5),
  },
}));

const FLOW_RUNNING_STATUS = 'Run in progress';
const FLOW_IN_QUEUE_STATUS = 'Waiting in queue';

export default function LastRun({ flowId }) {
  const classes = useStyles();
  const [lastRunStatus, setLastRunStatus] = useState();

  const flowJobStatus = useSelector(state => {
    const latestJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    const isInProgress = latestJobs.some(job => job.status === JOB_STATUS.RUNNING);

    if (isInProgress) return FLOW_RUNNING_STATUS;

    const isWaitingInQueue = latestJobs.some(job => job.status === JOB_STATUS.QUEUED);

    if (isWaitingInQueue) return FLOW_IN_QUEUE_STATUS;
  });

  const lastExecutedJob = useSelector(state => {
    const jobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return jobs.find(job => !!(job.lastExecutedAt || job.endedAt));
  }, shallowEqual);

  useEffect(() => {
    if (flowJobStatus) {
      setLastRunStatus(flowJobStatus);
    } else if (lastExecutedJob?.lastExecutedAt && lastExecutedJob.lastExecutedAt !== lastRunStatus) {
      setLastRunStatus(lastExecutedJob.lastExecutedAt || lastExecutedJob.endedAt);
    }
  }, [flowJobStatus, lastExecutedJob, lastRunStatus]);

  const lastRunStatusLabel = useMemo(() => {
    if ([FLOW_RUNNING_STATUS, FLOW_IN_QUEUE_STATUS].includes(lastRunStatus)) {
      return (
        <>
          <Spinner size="small" sx={{ width: 16, height: 16, mr: 0.5}} />
          <span>{lastRunStatus}</span>
        </>
      );
    }

    return (
      <>
        <RefreshIcon className={classes.icon} />
        <span className={classes.lastRun}>Last run:</span> <CeligoTimeAgo date={lastRunStatus} />
      </>
    );
  }, [lastRunStatus, classes.icon, classes.lastRun]);

  if (!lastRunStatus) return null;

  return (
    <>
      <Divider orientation="vertical" className={classes.divider} />
      <span className={classes.flexContainer}>
        {lastRunStatusLabel}
      </span>
    </>
  );
}
