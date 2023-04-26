import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
import IntegrationDashboard from '../../../../Dashboard';
import JobDashboard from '../../../../../components/JobDashboard';
import LoadResources from '../../../../../components/LoadResources';
import { selectors } from '../../../../../reducers';
import PanelHeader from '../../../../../components/PanelHeader';
import infoText from '../infoText';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel({ integrationId, childId }) {
  const classes = useStyles();
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
    <div className={classes.root}>
      <LoadResources required integrationId={integrationId} resources="flows">
        {!isUserInErrMgtTwoDotZero ? <PanelHeader title="Dashboard" infoText={infoTextDashboard} /> : ''}
        {isUserInErrMgtTwoDotZero
          ? <IntegrationDashboard integrationId={childId || integrationId} />
          : <JobDashboard integrationId={childId || integrationId} />}
      </LoadResources>
    </div>
  );
}
