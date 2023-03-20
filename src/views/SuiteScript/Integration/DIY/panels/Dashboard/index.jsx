import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import JobDashboard from '../../../../../../components/SuiteScript/JobDashboard';
import PanelHeader from '../../../../../../components/PanelHeader';
import infoText from '../../../../../../components/Help/infoText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
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

  return (
    <div className={classes.root}>
      <PanelHeader title="Dashboard" infoText={infoText.Dashboard} />

      <JobDashboard
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
      />
    </div>
  );
}
