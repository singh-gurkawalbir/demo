import { JOB_STATUS, JOB_TYPES } from '../constants';

export const JOB_UI_STATUS = Object.freeze({
  [JOB_STATUS.QUEUED]: 'Waiting in queue...',
  [JOB_STATUS.RUNNING]: 'In progress...',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.FAILED]: 'Failed',
  [JOB_STATUS.CANCELED]: 'Canceled',
  [JOB_STATUS.RETRYING]: 'Retrying...',
  [JOB_STATUS.CANCELING]: 'Canceling...',
  COMPLETING: 'Completing...',
  CANCELLING: 'Cancelling...',
  WAITING: 'Waiting...',
});

export const RETRY_JOB_UI_STATUS = Object.freeze({
  [JOB_STATUS.QUEUED]: 'Waiting in queue...',
  [JOB_STATUS.RUNNING]: 'Retrying errors...',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.FAILED]: 'Failed',
  [JOB_STATUS.CANCELED]: 'Canceled',
  [JOB_STATUS.CANCELING]: 'Cancelling retry...',
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

function getFlowJobStatusDetails(job) {
  if (job.uiStatus === JOB_STATUS.RETRYING) {
    return {
      showSpinner: true,
      status: JOB_UI_STATUS[job.uiStatus],
    };
  }
  if (
    job.uiStatus !== JOB_STATUS.RUNNING ||
    !job.doneExporting ||
    !job.percentComplete
  ) {
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
        status: JOB_UI_STATUS[job.uiStatus],
        errorValue: errorPercentage,
        resolvedValue: resolvedPercentage,
      };
    }
  }

  if (job.percentComplete === 100) {
    return { status: JOB_UI_STATUS.COMPLETING };
  }

  return {
    showSpinner: true,
    status: `${JOB_UI_STATUS[job.uiStatus]} ${
      job.percentComplete > 0 ? `${job.percentComplete}%` : ''
    }`,
  };
}

function getExportJobStatusDetails(job) {
  if (job.uiStatus === JOB_STATUS.RETRYING) {
    return {
      showSpinner: true,
      status: JOB_UI_STATUS[job.uiStatus],
    };
  }
  if (job.uiStatus !== JOB_STATUS.RUNNING) {
    if (job.status === JOB_STATUS.CANCELED) {
      return {
        showStatusTag: true,
        variant: 'warning',
        status: JOB_UI_STATUS[job.uiStatus],
        canceledBy: job.canceledBy,
      };
    }

    let errorPercentage = 0;
    let resolvedPercentage = 0;
    const total =
      (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

    if (
      [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(
        job.status
      )
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
        status: JOB_UI_STATUS[job.uiStatus],
        errorValue: errorPercentage,
        resolvedValue: resolvedPercentage,
      };
    }
  }

  return {
    showSpinner: true,
    status: JOB_UI_STATUS[job.uiStatus],
  };
}

function getImportJobStatusDetails(job) {
  if (job.uiStatus === JOB_STATUS.RETRYING) {
    return {
      showSpinner: true,
      status: JOB_UI_STATUS[job.uiStatus],
    };
  }
  if (job.uiStatus !== JOB_STATUS.RUNNING || !job.percentComplete) {
    if (job.status === JOB_STATUS.CANCELED) {
      return {
        showStatusTag: true,
        variant: 'warning',
        status: JOB_UI_STATUS[job.uiStatus],
        canceledBy: job.canceledBy,
      };
    }

    let errorPercentage = 0;
    let resolvedPercentage = 0;
    const total =
      (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

    if (
      [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].indexOf(
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
        status: JOB_UI_STATUS[job.uiStatus],
        errorValue: errorPercentage,
        resolvedValue: resolvedPercentage,
      };
    }
  }

  if (job.percentComplete === 100) {
    return { status: JOB_UI_STATUS.COMPLETING };
  }

  return {
    showSpinner: true,
    status: `${JOB_UI_STATUS[job.uiStatus]}${
      job.percentComplete > 0 ? `${job.percentComplete}%` : ''
    }`,
  };
}

function getRetryJobStatusDetails(job) {
  if (job.uiStatus === JOB_STATUS.RETRYING) {
    return {
      showSpinner: true,
      status: RETRY_JOB_UI_STATUS[job.uiStatus],
    };
  }
  if (job.uiStatus !== JOB_STATUS.RUNNING) {
    let errorPercentage = 0;
    let resolvedPercentage = 0;
    const total =
      (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

    if (
      [JOB_STATUS.CANCELED, JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(
        job.status
      )
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
        variant: [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(job.status) ? 'success' : 'warning',
        status: RETRY_JOB_UI_STATUS[job.uiStatus],
        errorValue: job.uiStatus === JOB_STATUS.CANCELED ? 0 : errorPercentage,
        resolvedValue: job.uiStatus === JOB_STATUS.CANCELED ? 0 : resolvedPercentage,
      };
    }
  }

  return {
    showSpinner: true,
    status: RETRY_JOB_UI_STATUS[job.uiStatus],
  };
}

export function getJobStatusDetails(job) {
  if (job.type === JOB_TYPES.FLOW) {
    return getFlowJobStatusDetails(job);
  }

  if (job.type === JOB_TYPES.EXPORT) {
    return getExportJobStatusDetails(job);
  }

  if (job.type === JOB_TYPES.IMPORT) {
    return getImportJobStatusDetails(job);
  }

  if (job.type === JOB_TYPES.RETRY) {
    return getRetryJobStatusDetails(job);
  }
}
