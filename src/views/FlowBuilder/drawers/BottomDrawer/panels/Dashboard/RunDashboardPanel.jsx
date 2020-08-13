import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import JobDashboard from '../../../../../../components/JobDashboard';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
  },
}));

export default function RunDashboardPanel({ flow }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <JobDashboard
        integrationId={flow._integrationId || 'none'}
        flowId={flow._id}
        isFlowBuilderView
      />
    </div>
  );
}
