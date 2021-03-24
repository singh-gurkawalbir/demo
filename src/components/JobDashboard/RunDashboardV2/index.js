import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import Spinner from '../../Spinner';

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
    return <Spinner loading size="large" />;
  }

  return (
    <ResourceTable resources={latestFlowJobs.data} resourceType="latestJobs" />
  );
}
