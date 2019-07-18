import moment from 'moment';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';

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
}
