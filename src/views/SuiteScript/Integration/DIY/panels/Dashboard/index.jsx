import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import JobDashboard from '../../../../../../components/SuiteScript/JobDashboard';
import PanelHeader from '../../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel({
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyles();
  const infoTextDashboard =
    'You can view the flows that have run or are currently running for each flow in your integration, as well as how long it took and when each job completed. If there are errors, click the number of errors in the Error column to resolve errors. You can edit jobs, and resolve errors directly from this view.';

  return (
    <div className={classes.root}>
      <PanelHeader title="Dashboard" infoText={infoTextDashboard} />

      <JobDashboard
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
      />
    </div>
  );
}
