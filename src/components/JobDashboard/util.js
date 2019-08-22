import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';

export const JOB_UI_STATUS = Object.freeze({
  [JOB_STATUS.QUEUED]: 'Waiting in Queue...',
  [JOB_STATUS.RUNNING]: 'In Progress...',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.FAILED]: 'Failed',
  [JOB_STATUS.CANCELED]: 'Canceled',
  [JOB_STATUS.RETRYING]: 'Retrying...',
  COMPLETING: 'Completing...',
});

export const UNDO_TIME = Object.freeze({
  RETRY: 4000,
  RESOLVE: 4000,
});

export function getStatus(job) {
  if (job.type === JOB_TYPES.FLOW) {
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

export function getSuccess(job) {
  if (job.type === JOB_TYPES.EXPORT) {
    return job.numSuccess === 0 ? 'N/A' : job.numSuccess;
  }

  return job.numSuccess;
}

export function getPages(job, parentJob) {
  let pages;

  if (job.type === JOB_TYPES.FLOW) {
    pages = job.numPagesGenerated;

    if (!job.doneExporting) {
      if (pages > 0) {
        if (job.status === JOB_STATUS.RUNNING) {
          pages += '+';
        }
      }
    }
  }

  if (job.type === JOB_TYPES.EXPORT) {
    pages = job.numPagesGenerated || job.numPagesProcessed;

    if (parentJob && !parentJob.doneExporting) {
      if (pages > 0) {
        pages += '+';
      }
    }
  }

  if (job.type === JOB_TYPES.IMPORT) {
    pages = job.numPagesProcessed;
  }

  return pages;
}
