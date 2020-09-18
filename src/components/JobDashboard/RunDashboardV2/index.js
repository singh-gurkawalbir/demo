import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import PanelLoader from '../../PanelLoader';
import { isNewId } from '../../../utils/resource';

export default function RunDashboardV2({ flowId }) {
  const dispatch = useDispatch();
  const latestFlowJobs = useSelector(
    state => selectors.flowDashboardJobs(state, flowId),
    shallowEqual
  );

  useEffect(() => {
    if (flowId && !isNewId(flowId)) {
      dispatch(actions.errorManager.latestFlowJobs.request({ flowId, refresh: true }));
    }
  }, [dispatch, flowId]);

  if (latestFlowJobs?.status === 'refresh') {
    // Only when the dashboard is entirely refreshed , show loading
    // it can be updated in between to get latest job status in which case, no need to show loader
    return <PanelLoader />;
  }

  return (
    <CeligoTable data={latestFlowJobs.data} {...metadata} />
  );
}
