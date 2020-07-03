import { JOB_STATUS } from '../../../utils/constants';

export const JOB_UI_STATUS = Object.freeze({
  [JOB_STATUS.QUEUED]: 'Waiting in Queue...',
  [JOB_STATUS.RUNNING]: 'In Progress...',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.FAILED]: 'Failed',
  [JOB_STATUS.CANCELED]: 'Canceled',
});

export const UNDO_TIME = Object.freeze({
  RETRY: 4000,
  RESOLVE: 4000,
});

export function getStatus(job) {
  return JOB_UI_STATUS[job.status];
}

export function getSuccess(job) {
  return job.numSuccess;
}

export function getFlowJobStatusDetails(job) {
  if (job.status !== JOB_STATUS.RUNNING) {
    let errorPercentage = 0;
    let resolvedPercentage = 0;
    const total =
      (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

    if (
      [JOB_STATUS.CANCELED, JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].indexOf(
        job.status
      ) > -1
    ) {
      if (job.numError > 0) {
        if (job.numError < job.numResolved) {
          errorPercentage = Math.floor((job.numError * 100) / total);
        } else {
          errorPercentage = Math.ceil((job.numError * 100) / total);
        }
      }

      if (job.numResolved > 0) {
        if (job.numResolved < job.numError) {
          resolvedPercentage = Math.floor((job.numResolved * 100) / total);
        } else {
          resolvedPercentage = Math.ceil((job.numResolved * 100) / total);
        }
      }

      return {
        showStatusTag: true,
        variant:
          job.numSuccess > 0 ||
          job.numError > 0 ||
          job.numResolved > 0 ||
          [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(job.status)
            ? 'success'
            : 'warning',
        status: JOB_UI_STATUS[job.status],
        errorValue: errorPercentage,
        resolvedValue: resolvedPercentage,
      };
    }
  }

  return {
    showSpinner: true,
    status: `${JOB_UI_STATUS[job.status]}`,
  };
}

export function getJobStatusDetails(job) {
  return getFlowJobStatusDetails(job);
}
