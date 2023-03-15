import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })._integrationId
  );

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
