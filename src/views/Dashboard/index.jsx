import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import actions from '../../actions';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
// import CeligoPageBar from '../../components/CeligoPageBar';
import PanelHeader from '../../components/PanelHeader';
import getRoutePath from '../../utils/routePaths';
import {HOME_PAGE_PATH} from '../../utils/constants';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import {FILTER_KEYS_AD, DEFAULT_RANGE} from '../../utils/accountDashboard';
import { hashCode } from '../../utils/string';

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  let filters = useSelector(state => selectors.filter(state, FILTER_KEYS_AD.COMPLETED));
  const {integrationId} = filters;

  filters = useSelector(state => selectors.filter(state, `${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`));

  const { paging, sort, ...nonPagingFilters } = filters || {};
  const filterHash = hashCode(nonPagingFilters);
  let infoTextDashboard =
    'You can view the flows that have run or are currently running for each flow in your integration, as well as how many pages of data were sent, how long it took and when each job completed. If there are child jobs within a parent job, you can expand the parent to view the children. If there are errors, click the number of errors in the Error column to retry and resolve errors. You can cancel jobs that are in progress, edit jobs, and resolve errors directly from this view.';

  if (isUserInErrMgtTwoDotZero) {
    infoTextDashboard = 'Use this dashboard to visualize the stats of an integration flow – for example, how many successes vs. errors did my integration experience over the last 30 days? The dashboard shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. Integration flow stats are available for up to one year.';
  }

  useEffect(() => {
    dispatch(
      actions.job.dashboard.completed.requestCollection()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterHash]);

  useEffect(
    () => () => {
      // Filter should not be cleared if any drawer gets opened inside account dashboard like errors list, flow link and integration link
      // To DO: Ashok to research on this and try to get better logic than below one.
      if (!(window.location.href.includes('/integrations') || window.location.href.includes('/integrationapps')) || window.location.href.includes('/new-')) {
        dispatch(
          actions.patchFilter(`${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`, {
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
    <LoadResources required resources="flows,integrations">
      <PanelHeader title="Dashboard" infoText={infoTextDashboard} />

      {/* <CeligoPageBar title="Dashboard" /> */}
      <Tabs />
      <QueuedJobsDrawer />
    </LoadResources>
  );
}
