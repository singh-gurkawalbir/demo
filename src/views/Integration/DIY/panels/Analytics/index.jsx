import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Box } from '@mui/material';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import infoText from '../infoText';

export default function AnalyticsPanel({ integrationId, childId }) {
  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        overflow: 'auto',
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
      }}>
      <LoadResources required integrationId={integrationId} resources="flows">
        <PanelHeader title="Analytics" infoText={infoText.Analytics} contentId="analytics" />
        <ChartsDrawer integrationId={childId || integrationId} />
      </LoadResources>
    </Box>
  );
}
