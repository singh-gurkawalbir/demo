import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import metadata from './metadata';
import CeligoTable from '../../../../../../components/CeligoTable';
import LatestJobActions from './actions/LatestJobActions';
import { JOB_STATUS } from '../../../../../../utils/constants';
// TODO: should we move this to JobsDashboard component?
export default function FlowRunDashboard({ flow }) {
  const { _id: flowId, _integrationId: integrationId = 'none'} = flow;
  const dispatch = useDispatch();
  const latestJobs = useSelectorMemo(selectors.makeLatestFlowJobs);
  const childJobs = useMemo(() => {
    const childJobDetails = [];

    latestJobs.forEach(job => {
      if (job.status === JOB_STATUS.QUEUED) {
        childJobDetails.push(job);
      } else if (job?.children?.length) {
        job.children.forEach(childJob => childJob && childJobDetails.push(childJob));
      }
    });

    return childJobDetails;
  }, [latestJobs]);

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

  if (!childJobs.length) {
    return null;
  }

  return (
    <>
      <LatestJobActions flowId={flowId} jobId={childJobs?.[0]._id} />
      <CeligoTable
        data={childJobs}
        {...metadata} />
    </>
  );
}
