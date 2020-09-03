import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import DateCell from '../DateCell';
import { JOB_UI_STATUS } from '../../../../JobDashboard/util';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300,
    wordWrap: 'break-word',
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '14px',
  },
}));

export default function StatusCell({
  flowId,
  date,
  integrationId,
}) {
  const classes = useStyles();
  const history = useHistory();
  const job = useSelector(state => {
    const latestFlowJobs = selectors.latestJobMap(state, integrationId)?.data;

    if (Array.isArray(latestFlowJobs)) {
      return latestFlowJobs.find(job => job._flowId === flowId);
    }
  });

  if (!job || job.status === 'completed') {
    return <DateCell date={date} />;
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
