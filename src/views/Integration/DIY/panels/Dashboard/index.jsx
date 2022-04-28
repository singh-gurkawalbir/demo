import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
import IntegrationDashboard from '../../../../Dashboard';
import JobDashboard from '../../../../../components/JobDashboard';
import LoadResources from '../../../../../components/LoadResources';
import { selectors } from '../../../../../reducers';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
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
  let infoTextDashboard =
  'You can view the flows that have run or are currently running for each flow in your integration, as well as how many pages of data were sent, how long it took and when each job completed. If there are child jobs within a parent job, you can expand the parent to view the children. If there are errors, click the number of errors in the Error column to retry and resolve errors. You can cancel jobs that are in progress, edit jobs, and resolve errors directly from this view.';

  if (isUserInErrMgtTwoDotZero) {
    infoTextDashboard = 'Use this dashboard to visualize the stats of an integration flow – for example, how many successes vs. errors did my integration experience over the last 30 days? The dashboard shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. Integration flow stats are available for up to one year.';
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
