import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import metadata from './metadata';
import CeligoTable from '../../../../../../components/CeligoTable';
import PanelLoader from '../../../../../../components/PanelLoader';

// TODO: should we move this to JobsDashboard component?
export default function FlowRunDashboard({ flow }) {
  const { _id: flowId, _integrationId: integrationId = 'none'} = flow;
  const dispatch = useDispatch();
  const latestJobs = useSelector(state => selectors.flowDashboardDetails(state));
  const areFlowJobsLoading = useSelector(state => selectors.areFlowJobsLoading(state, { integrationId, flowId }));

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch]
  );
  useEffect(() => {
    if (latestJobs.length === 0) {
      dispatch(
        actions.job.requestLatestJobs({
          integrationId,
          flowId,
        })
      );
    }
  }, [dispatch, integrationId, flowId, latestJobs.length]);

  if (areFlowJobsLoading) {
    return <PanelLoader />;
  }

  return (
    <>
      <CeligoTable data={latestJobs} {...metadata} />
    </>
  );
}
