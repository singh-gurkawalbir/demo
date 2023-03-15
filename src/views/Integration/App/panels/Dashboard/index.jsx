import React, { useEffect } from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import JobDashboard from '../../../../../components/JobDashboard';
import IntegrationDashboard from '../../../../Dashboard';
import PanelHeader from '../../../../../components/PanelHeader';
import LoadResources from '../../../../../components/LoadResources';
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
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const filterChildId = useSelector(
    state => selectors.filter(state, 'jobs').childId
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  let infoTextDashboard;

  if (isUserInErrMgtTwoDotZero) {
    infoTextDashboard = message.ERROR_MANAGEMENT_2.ERROR_MANAGEMENT_DASHBOARD_INFO;
  }

  // We may not have an IA that supports children, but those who do,
  // we want to reset the jobs filter any time the child changes.
  useEffect(() => {
    if (childId !== filterChildId) {
      dispatch(
        actions.patchFilter('jobs', {
          childId,
          flowId: '',
          currentPage: 0,
        })
      );
    }
  }, [dispatch, filterChildId, childId]);
  if (isUserInErrMgtTwoDotZero && !(match.url?.includes('/runningFlows') || match.url?.includes('/completedFlows'))) {
    history.replace(`${match.url}/runningFlows`);
  }

  return (
    <div className={classes.root}>
      <LoadResources required integrationId={integrationId} resources="flows">
        {!isUserInErrMgtTwoDotZero ? <PanelHeader title="Dashboard" infoText={infoTextDashboard} /> : ''}
        {isUserInErrMgtTwoDotZero
          ? <IntegrationDashboard integrationId={integrationId} childId={childId} />
          : <JobDashboard integrationId={integrationId} />}
      </LoadResources>
    </div>
  );
}
