import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import actions from '../../actions';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
import CeligoPageBar from '../../components/CeligoPageBar';
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
  const filters = useSelector(state => selectors.filter(state, FILTER_KEYS_AD.COMPLETED));
  const { paging, sort, ...nonPagingFilters } = filters;
  const filterHash = hashCode(nonPagingFilters);

  useEffect(() => {
    dispatch(
      actions.job.dashboard.completed.requestCollection()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterHash]);

  useEffect(
    () => () => {
      dispatch(
        actions.patchFilter(FILTER_KEYS_AD.COMPLETED, {
          range: DEFAULT_RANGE,
        })
      );
      dispatch(actions.job.dashboard.completed.clear());
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
      <CeligoPageBar title="Dashboard" />
      <Tabs />
      <QueuedJobsDrawer />
    </LoadResources>
  );
}
