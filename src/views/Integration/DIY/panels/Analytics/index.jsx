import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import PanelHeader from '../../../../../components/PanelHeader';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';

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

  const infoTextDashboard = 'Use this dashboard to visualize the stats of an integration flow – for example, how many successes vs. errors did my integration experience over the last 30 days? The dashboard shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. Integration flow stats are available for up to one year.';

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">
        <PanelHeader title="Analytics" infoText={infoTextDashboard} />
        <ChartsDrawer integrationId={childId || integrationId} />
      </LoadResources>
    </div>
  );
}
