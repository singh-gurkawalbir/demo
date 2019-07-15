import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';

export function getFlowJobIdsThatArePartOfABulkRetryJob(bulkRetryJob, jobs) {
  const flowJobIds = [];

  if (bulkRetryJob.status !== JOB_STATUS.QUEUED) {
    return flowJobIds;
  }

  jobs.forEach(job => {
    let flowIdMatch = true;

    if (bulkRetryJob._flowId) {
      flowIdMatch = job._flowId === bulkRetryJob._flowId;
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

export function getFlowJobIdsThatArePartOfBulkRetryJobs(jobs) {
  const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);
  let flowJobIds = [];

  bulkRetryJobs.forEach(job => {
    flowJobIds = flowJobIds.concat(
      getFlowJobIdsThatArePartOfABulkRetryJob(job, jobs)
    );
  });

  return flowJobIds;
}
