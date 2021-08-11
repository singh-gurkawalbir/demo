import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import JobDashboard from '../../../../../../components/JobDashboard';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    overflow: 'auto',
  },
}));

export default function RunDashboardPanel({ flowId }) {
  const classes = useStyles();
  const integrationId = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    return flow?._integrationId || 'none';
  });

  return (
    <div data-public className={classes.root}>
      <JobDashboard
        integrationId={integrationId}
        flowId={flowId}
        isFlowBuilderView
      />
    </div>
  );
}
