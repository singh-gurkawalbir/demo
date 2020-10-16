import { useSelector } from 'react-redux';
import { JOB_STATUS } from '../../../../../utils/constants';
import { selectors } from '../../../../../reducers';

export default function FlowStepName({ job }) {
  const exportName = useSelector(state => {
    const exportObj = selectors.resource(state, 'exports', job._exportId);

    return exportObj?.name || 'Export';
  });

  // In cases when parent job is cancelled while it is in queue, children are not yet created
  // In that case, we show that parent job with PG's name similar to Queued job
  // flowJobId exists on job if it is a child job
  const isCancelledParentJob = job.status === JOB_STATUS.CANCELED && job._exportId && !job._flowJobId;
  const isInProgressParentJob = job.status === JOB_STATUS.RUNNING && job._exportId && !job._flowJobId;

  if (job.status === JOB_STATUS.QUEUED || isCancelledParentJob || isInProgressParentJob) {
    return exportName;
  }

  // Incase of Old flows , we show Export/Import instead of names as they don't exist for old resources
  // Referred to EM 1.0 Jobs for this behaviour
  return job.name || (job._exportId ? 'Export' : 'Import');
}
