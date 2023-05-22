import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
import IntegrationDashboard from '../../../../Dashboard';
import JobDashboard from '../../../../../components/JobDashboard';
import LoadResources from '../../../../../components/LoadResources';
import { selectors } from '../../../../../reducers';
import PanelHeader from '../../../../../components/PanelHeader';
import infoText from '../infoText';
import { message } from '../../../../../utils/messageStore';

export default function DashboardPanel({ integrationId, childId }) {
  const match = useRouteMatch();
  const history = useHistory();

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  let infoTextDashboard = infoText.Dashboard;

  if (isUserInErrMgtTwoDotZero) {
    infoTextDashboard = message.ERROR_MANAGEMENT_2.ERROR_MANAGEMENT_DASHBOARD_INFO;
  }
  if (isUserInErrMgtTwoDotZero && !(match.url?.includes('/runningFlows') || match.url?.includes('/completedFlows'))) {
    history.replace(`${match.url}/runningFlows`);
  }

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        overflow: 'auto',
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
      }}>
      <LoadResources required integrationId={integrationId} resources="flows">
        {!isUserInErrMgtTwoDotZero ? <PanelHeader title="Dashboard" infoText={infoTextDashboard} /> : ''}
        {isUserInErrMgtTwoDotZero
          ? <IntegrationDashboard integrationId={childId || integrationId} />
          : <JobDashboard integrationId={childId || integrationId} />}
      </LoadResources>
    </Box>
  );
}
