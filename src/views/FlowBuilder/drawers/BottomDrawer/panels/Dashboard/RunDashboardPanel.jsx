import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import JobDashboard from '../../../../../../components/JobDashboard';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
  },
}));

export default function RunDashboardPanel({ flowId }) {
  const classes = useStyles();
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)._integrationId || 'none');

  return (
    <div className={classes.root}>
      <JobDashboard
        integrationId={integrationId}
        flowId={flowId}
        isFlowBuilderView
      />
    </div>
  );
}
