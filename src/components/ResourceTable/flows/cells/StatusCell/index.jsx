import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import CeligoTimeAgo from '../../../../CeligoTimeAgo';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    wordWrap: 'break-word',
  },
});

export default function StatusCell({
  _id: flowId,
  lastExecutedAtSort,
  lastExecutedAtSortType,
  isJobInQueuedStatus,
  lastExecutedAtSortJobStatus,
}) {
  const classes = useStyles();
  const history = useHistory();

  if (lastExecutedAtSortType === 'date') {
    return <CeligoTimeAgo date={lastExecutedAtSort} />;
  }

  return (
    <div className={classes.root}>
      {isJobInQueuedStatus
        ? (
          <Link to={`${history.location.pathname}/${flowId}/queuedJobs`}>
            {lastExecutedAtSortJobStatus}
          </Link>
        )
        : <>{lastExecutedAtSortJobStatus}</>}
    </div>
  );
}
