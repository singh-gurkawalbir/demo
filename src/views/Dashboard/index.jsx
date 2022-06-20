import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import actions from '../../actions';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
import CeligoPageBar from '../../components/CeligoPageBar';
import PanelHeader from '../../components/PanelHeader';
import getRoutePath from '../../utils/routePaths';
import {HOME_PAGE_PATH} from '../../utils/constants';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import {FILTER_KEYS_AD, DEFAULT_RANGE, getDashboardIntegrationId} from '../../utils/accountDashboard';
import { hashCode } from '../../utils/string';

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { integrationId } = match.params;
  const { childId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  const dashboardIntegrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const filters = useSelector(state => selectors.filter(state, `${dashboardIntegrationId || ''}${FILTER_KEYS_AD.COMPLETED}`));

  const { paging, sort, ...nonPagingFilters } = filters || {};
  const filterHash = hashCode(nonPagingFilters);
  const infoTextDashboard = integrationId ? 'This dashboard offers a comprehensive view of all running and completed flows in each integration.'
    : 'This dashboard offers a comprehensive view of all running and completed flows in your account.';

  useEffect(() => {
    dispatch(
      actions.job.dashboard.completed.requestCollection({ integrationId: dashboardIntegrationId})
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterHash, dashboardIntegrationId]);

  useEffect(
    () => () => {
      // Filter should not be cleared if any drawer gets opened inside account dashboard like errors list, flow link and integration link
      // To DO: Ashok to research on this and try to get better logic than below one.
      if (!(window.location.href.includes('/integrations') || window.location.href.includes('/integrationapps')) || window.location.href.includes('/new-')) {
        dispatch(
          actions.patchFilter(`${dashboardIntegrationId || ''}${FILTER_KEYS_AD.COMPLETED}`, {
            range: DEFAULT_RANGE,
          })
        );
        dispatch(actions.job.dashboard.completed.clear());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );
  if (!isUserInErrMgtTwoDotZero) {
    history.push(getRoutePath(HOME_PAGE_PATH));

    return null;
  }

  return (
    <LoadResources integrationId={integrationId} required resources="flows,integrations,tiles">
      {integrationId ? <PanelHeader title="Dashboard" infoText={infoTextDashboard} /> : <CeligoPageBar title="Dashboard" infoText={infoTextDashboard} />}
      <Tabs />
      <QueuedJobsDrawer integrationId={integrationId} />
    </LoadResources>
  );
}
