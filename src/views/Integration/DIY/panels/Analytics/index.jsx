import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import infoText from '../infoText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function AnalyticsPanel({ integrationId, childId }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LoadResources required integrationId={integrationId} resources="flows">
        <PanelHeader title="Analytics" infoText={infoText.Analytics} contentId="analytics" />
        <ChartsDrawer integrationId={childId || integrationId} />
      </LoadResources>
    </div>
  );
}
