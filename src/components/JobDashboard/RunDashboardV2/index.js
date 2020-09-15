import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import PanelLoader from '../../PanelLoader';

export default function RunDashboardV2({ flowId, integrationId }) {
  const dispatch = useDispatch();
  const latestFlowJobs = useSelector(state => selectors.flowDashboardJobs(state, flowId));

  useEffect(() => {
    dispatch(actions.errorManager.latestFlowJobs.request({ flowId }));
  }, [dispatch, integrationId, flowId]);

  useEffect(() =>
    () => dispatch(actions.job.clear()),
  [dispatch]);

  if (latestFlowJobs?.status === 'requested') {
    return <PanelLoader />;
  }

  return (
    <CeligoTable data={latestFlowJobs.data} {...metadata} />
  );
}
