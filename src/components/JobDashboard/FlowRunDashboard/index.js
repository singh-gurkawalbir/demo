import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import PanelLoader from '../../PanelLoader';

export default function FlowRunDashboard({ flowId, integrationId }) {
  const dispatch = useDispatch();
  const latestJobs = useSelector(state => selectors.flowDashboardDetails(state));
  const flowJobs = useSelector(state => selectors.flowJobs(state));
  const areFlowJobsLoading = useSelector(state => selectors.areFlowJobsLoading(state, { integrationId, flowId }));

  useEffect(() => {
    if (flowJobs.length === 0 && flowId) {
      dispatch(
        actions.job.requestLatestJobs({
          integrationId,
          flowId,
        })
      );
    }
  }, [dispatch, integrationId, flowId, flowJobs.length]);

  useEffect(() =>
    () => dispatch(actions.job.clear()),
  [dispatch]);

  if (areFlowJobsLoading) {
    return <PanelLoader />;
  }

  return (
    <>
      <CeligoTable data={latestJobs} {...metadata} />
    </>
  );
}
