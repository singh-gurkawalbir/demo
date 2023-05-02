import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { TimeAgo } from '@celigo/fuse-ui';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

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
    return <TimeAgo date={lastExecutedAtSort} />;
  }

  return (
    <div className={classes.root}>
      {isJobInQueuedStatus
        ? (
          <Link
            to={buildDrawerUrl({
              path: drawerPaths.ERROR_MANAGEMENT.V1.FLOW_LEVEL_QUEUED_JOBS,
              baseUrl: history.location.pathname,
              params: { flowId },
            })}>
            {lastExecutedAtSortJobStatus}
          </Link>
        )
        : <>{lastExecutedAtSortJobStatus}</>}
    </div>
  );
}
