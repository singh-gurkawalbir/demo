import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import metadata from './metadata';
import CeligoTable from '../../../../../../components/CeligoTable';
import LatestJobActions from './actions/LatestJobActions';
// TODO: should we move this to JobsDashboard component?
export default function FlowRunDashboard({ flow }) {
  const { _id: flowId, _integrationId: integrationId = 'none'} = flow;
  const dispatch = useDispatch();
  const latestJobs = useSelector(state => selectors.flowDashboardDetails(state));

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch]
  );
  useEffect(() => {
    if (latestJobs.length === 0) {
      dispatch(
        actions.job.requestLatestJob({
          integrationId,
          flowId,
        })
      );
    }
  }, [dispatch, integrationId, flowId, latestJobs.length]);

  if (!latestJobs.length) {
    return null;
  }

  return (
    <>
      <LatestJobActions flowId={flowId} jobId={latestJobs?.[0]._flowJobId} />
      <CeligoTable
        data={latestJobs}
        {...metadata} />
    </>
  );
}
