import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import PanelLoader from '../../PanelLoader';

export default function RunDashboardV2({ flowId }) {
  const dispatch = useDispatch();
  const latestFlowJobs = useSelector(
    state => selectors.flowDashboardJobs(state, flowId),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.errorManager.latestFlowJobs.request({ flowId }));
  }, [dispatch, flowId]);

  useEffect(() =>
    () => dispatch(actions.errorManager.latestFlowJobs.clear({ flowId })),
  [dispatch, flowId]);

  if (latestFlowJobs?.status === 'requested') {
    return <PanelLoader />;
  }

  return (
    <CeligoTable data={latestFlowJobs.data} {...metadata} />
  );
}
