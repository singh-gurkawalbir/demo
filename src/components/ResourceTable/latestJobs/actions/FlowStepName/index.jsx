import { useSelector } from 'react-redux';
import { JOB_STATUS } from '../../../../../utils/constants';
import { selectors } from '../../../../../reducers';

export default function FlowStepName({ job }) {
  const exportName = useSelector(state => {
    const exportObj = selectors.resource(state, 'exports', job._exportId);

    return exportObj?.name || 'Export';
  });

  if (job?.status === JOB_STATUS.QUEUED) {
    return exportName;
  }

  // Incase of Old flows , we show Export/Import instead of names as they don't exist for old resources
  // Referred to EM 1.0 Jobs for this behaviour
  return job.name || (job._exportId ? 'Export' : 'Import');
}
