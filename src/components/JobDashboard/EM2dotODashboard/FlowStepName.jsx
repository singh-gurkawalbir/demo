import { useSelector } from 'react-redux';
import { JOB_STATUS } from '../../../utils/constants';
import { selectors } from '../../../reducers';

export default function FlowStepName({ job }) {
  const exportName = useSelector(state => {
    const { merged: exportObj } = selectors.resourceData(state, 'exports', job._exportId);

    return exportObj?.name;
  });

  if (job?.status === JOB_STATUS.QUEUED) {
    return exportName;
  }

  return job.name;
}
