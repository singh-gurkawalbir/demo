import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import { JOB_UI_STATUS } from '../../../../JobDashboard/util';
import CeligoTimeAgo from '../../../../CeligoTimeAgo';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    wordWrap: 'break-word',
  },
});

export default function StatusCell({
  flowId,
  date,
  integrationId,
  actionProps,
}) {
  const classes = useStyles();
  const history = useHistory();
  const job = useSelector(state => {
    const latestFlowJobs = selectors.latestJobMap(state, integrationId)?.data;

    if (Array.isArray(latestFlowJobs)) {
      return latestFlowJobs.find(job => job._flowId === flowId);
    }
  });
  const {isUserInErrMgtTwoDotZero} = actionProps;

  if (!job || !isUserInErrMgtTwoDotZero) {
    return <CeligoTimeAgo date={date} />;
  }
  if (['completed', 'canceled', 'failed'].includes(job.status)) {
    return <CeligoTimeAgo date={job.lastExecutedAt} />;
  }

  const isJobInQueuedStatus =
    (job.status === 'queued' ||
      (job.status === 'running' && !job.doneExporting));

  return (
    <div className={classes.root}>
      {isJobInQueuedStatus
        ? <Link to={`${history.location.pathname}/${flowId}/queuedJobs`}>{JOB_UI_STATUS[job.status]}</Link>
        : <>{JOB_UI_STATUS[job.status]}</>}
    </div>
  );
}
