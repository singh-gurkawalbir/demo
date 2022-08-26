import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import infoText from '../infoText';

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

  return (
    <div className={classes.root}>
      <LoadResources required integrationId={integrationId} resources="flows">
        <PanelHeader title="Analytics" infoText={infoText.Analytics} />
        <ChartsDrawer integrationId={childId || integrationId} />
      </LoadResources>
    </div>
  );
}
