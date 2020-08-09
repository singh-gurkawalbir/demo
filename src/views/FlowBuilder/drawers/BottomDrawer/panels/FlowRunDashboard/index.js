import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import metadata from './metadata';
import CeligoTable from '../../../../../../components/CeligoTable';
import LatestJobActions from './actions/LatestJobActions';

// TODO: should we move this to JobsDashboard component?
export default function FlowRunDashboard({ flow }) {
  const { _id: flowId, _integrationId: integrationId = 'none'} = flow;
  const dispatch = useDispatch();
  const jobs = useSelectorMemo(selectors.makeFlowJobs);

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch]
  );
  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(
        actions.job.requestLatestJob({
          integrationId,
          flowId,
        })
      );
    }
  }, [dispatch, integrationId, flowId, jobs.length]);

  const latestJobs = jobs?.[0]?.children || [];

  if (!latestJobs.length) {
    // TODO : Find out what to show while waiting / loading
    return null;
  }

  return (
    <>
      <LatestJobActions flowId={flowId} jobs={latestJobs} />
      <CeligoTable
        data={latestJobs}
        {...metadata} />
    </>
  );
}
