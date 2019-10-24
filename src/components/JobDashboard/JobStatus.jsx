import { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';
import { JOB_UI_STATUS } from './util';
import Spinner from '../Spinner';

export default function JobStatus({ job }) {
  if (job.type === JOB_TYPES.FLOW) {
    if (
      job.uiStatus === JOB_STATUS.QUEUED ||
      (job.uiStatus === JOB_STATUS.RUNNING && !job.doneExporting)
    ) {
      return (
        <Fragment>
          <IconButton>
            <Spinner size={24} />
          </IconButton>
          {JOB_UI_STATUS[job.uiStatus]}
        </Fragment>
      );
    }

    if (
      job.uiStatus !== JOB_STATUS.RUNNING ||
      !job.doneExporting ||
      !job.percentComplete
    ) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }

  if (job.type === JOB_TYPES.EXPORT) {
    return JOB_UI_STATUS[job.uiStatus];
  }

  if (job.type === JOB_TYPES.IMPORT) {
    if (job.uiStatus !== JOB_STATUS.RUNNING || !job.percentComplete) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }
}
