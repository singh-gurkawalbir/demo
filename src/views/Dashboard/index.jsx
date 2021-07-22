import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
import CeligoPageBar from '../../components/CeligoPageBar';
import getRoutePath from '../../utils/routePaths';
import {HOME_PAGE_PATH} from '../../utils/constants';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';

export default function Dashboard() {
  const history = useHistory();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
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
