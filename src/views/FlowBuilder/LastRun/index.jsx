import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import { JOB_STATUS } from '../../../utils/constants';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import Spinner from '../../../components/Spinner';

const useStyles = makeStyles(theme => ({
  divider: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 1, 0, 1),
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

const FLOW_RUNNING_STATUS = 'In progress';
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

    return jobs.find(job => !!job.lastExecutedAt);
  }, shallowEqual);

  useEffect(() => {
    if (flowJobStatus) {
      setLastRunStatus(flowJobStatus);
    } else if (lastExecutedJob?.lastExecutedAt && lastExecutedJob.lastExecutedAt !== lastRunStatus) {
      setLastRunStatus(lastExecutedJob.lastExecutedAt);
    }
  }, [flowJobStatus, lastExecutedJob, lastRunStatus]);

  const lastRunStatusLabel = useMemo(() => {
    if ([FLOW_RUNNING_STATUS, FLOW_IN_QUEUE_STATUS].includes(lastRunStatus)) {
      return (
        <>
          <Spinner size={16} className={classes.icon} />
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
      <div className={classes.divider} />
      <span className={classes.flexContainer}>
        {lastRunStatusLabel}
      </span>
    </>
  );
}
