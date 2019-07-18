import { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Assessment from '@material-ui/icons/Assessment';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';
import { JOB_UI_STATUS } from './util';

export default function JobStatus({ job }) {
  if (job.type === JOB_TYPES.FLOW) {
    if (
      job.uiStatus === JOB_STATUS.QUEUED ||
      (job.uiStatus === JOB_STATUS.RUNNING && !job.doneExporting)
    ) {
      return (
        <Fragment>
          {JOB_UI_STATUS[job.uiStatus]}
          <IconButton>
            <Assessment />
          </IconButton>
        </Fragment>
      );
    }

    if (
      job.uiStatus !== JOB_STATUS.RUNNING ||
      !job.doneExporting ||
      !job.__percentComplete
    ) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.__percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.__percentComplete} %`;
  }

  if (job.type === JOB_TYPES.EXPORT) {
    return JOB_UI_STATUS[job.uiStatus];
  }

  if (job.type === JOB_TYPES.IMPORT) {
    if (job.uiStatus !== JOB_STATUS.RUNNING || !job.__percentComplete) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.__percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.__percentComplete} %`;
  }
}
