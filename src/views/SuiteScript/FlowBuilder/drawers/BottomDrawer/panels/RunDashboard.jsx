import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import JobDashboard from '../../../../../../components/SuiteScript/JobDashboard';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function RunDashboardPanel({ ssLinkedConnectionId, flowId }) {
  const classes = useStyles();
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)._integrationId);

  return (
    <div className={classes.root}>
      <JobDashboard
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flowId}
        isFlowBuilderView
      />
    </div>
  );
}
