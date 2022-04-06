import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function AnalyticsPanel({ integrationId, childId }) {
  const classes = useStyles();

  const infoTextDashboard = 'The Analytics tab shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. You can visualize, for example, how many successes vs. errors did my integration experience over the last 30 days? Integration flow stats are available for up to one year.';

  return (
    <div className={classes.root}>
      <LoadResources integrationId={integrationId} required resources="flows">
        <PanelHeader title="Analytics" infoText={infoTextDashboard} />
        <ChartsDrawer integrationId={childId || integrationId} />
      </LoadResources>
    </div>
  );
}
