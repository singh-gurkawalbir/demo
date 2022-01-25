import moment from 'moment';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';

export const DEFAULT_STATE = Object.freeze({
  flowJobs: [],
  bulkRetryJobs: [],
  errors: [],
  retryObjects: {},
  paging: {
    rowsPerPage: 10,
    currentPage: 0,
  },
});

export const DEFAULT_JOB_PROPS = Object.freeze({
  numError: 0,
  numResolved: 0,
  numSuccess: 0,
  numIgnore: 0,
  numPagesGenerated: 0,
  numPagesProcessed: 0,
});

export const RETRY_OBJECT_TYPES = Object.freeze({
  FILE: 'file',
  OBJECT: 'object',
  PAGE: 'page',
  PATH: 'path',
  FILE_BATCH_IMPORT: 'file_batch_import',
});

export function getFlowJobIdsThatArePartOfABulkRetryJob(
  flowJobs,
  bulkRetryJob
) {
  const flowJobIds = [];

  if (bulkRetryJob.status !== JOB_STATUS.QUEUED) {
    return flowJobIds;
  }

  flowJobs.forEach(job => {
    let flowIdMatch = true;

    if (bulkRetryJob._flowId) {
      flowIdMatch = job._flowId === bulkRetryJob._flowId;
    } else if (bulkRetryJob._flowIds) {
      flowIdMatch = bulkRetryJob._flowIds.includes(job._flowId);
    }

    if (flowIdMatch) {
      if (
        job.type === JOB_TYPES.FLOW &&
        [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
          job.status
        ) &&
        job.numError > 0
      ) {
        flowJobIds.push(job._id);
      }
    }
  });

  return flowJobIds;
}

export function getFlowJobIdsThatArePartOfBulkRetryJobs(
  flowJobs,
  bulkRetryJobs
) {
  let flowJobIds = [];

  bulkRetryJobs.forEach(job => {
    flowJobIds = flowJobIds.concat(
      getFlowJobIdsThatArePartOfABulkRetryJob(flowJobs, job)
    );
  });

  return flowJobIds;
}

export function getJobDuration(job) {
  if (job.startedAt && job.endedAt) {
    const dtDiff = moment(moment(job.endedAt) - moment(job.startedAt)).utc();
    let duration = dtDiff.format('HH:mm:ss');

    if (dtDiff.date() > 1) {
      const durationParts = duration.split(':');

      durationParts[0] =
        parseInt(durationParts[0], 10) + (dtDiff.date() - 1) * 24;
      duration = durationParts.join(':');
    }

    return duration;
  }

  return undefined;
}

export function parseJobs(jobs) {
  const flowJobs = jobs
    .filter(job => job.type === JOB_TYPES.FLOW)
    .map(job => ({
      ...DEFAULT_JOB_PROPS,
      ...job,
    }));
  const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);

  return { flowJobs, bulkRetryJobs };
}

export function parseJobFamily(job) {
  const { children, _flowId, _integrationId, ...rest } = job;
  const updatedJob = {
    ...DEFAULT_JOB_PROPS,
    _flowId,
    _integrationId,
    ...rest,
  };

  if (children && children.length > 0) {
    updatedJob.children = children
      .filter(childJob => childJob !== null)
      .map(childJob => ({
        ...DEFAULT_JOB_PROPS,
        _flowId,
        _integrationId,
        ...childJob,
      }));
  }

  return updatedJob;
}
