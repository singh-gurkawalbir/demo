import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import { JOB_UI_STATUS } from '../../../../JobDashboard/util';
import CeligoTimeAgo from '../../../../CeligoTimeAgo';

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
  integrationId,
  actionProps,
}) {
  const classes = useStyles();
  const history = useHistory();
  const {isUserInErrMgtTwoDotZero} = actionProps;

  const {type, date, status, isJobInQueuedStatus } = useSelector(state => selectors.getFlowLastRunStatusValue(state, integrationId, flowId, isUserInErrMgtTwoDotZero));

  if (type === 'date') {
    return <CeligoTimeAgo date={date} />;
  }

  return (
    <div className={classes.root}>
      {isJobInQueuedStatus
        ? <Link to={`${history.location.pathname}/${flowId}/queuedJobs`}>{status}</Link>
        : <>{status}</>}
    </div>
  );
}
