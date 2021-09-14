import { JOB_STATUS } from '../constants';
import { getJobDuration } from '../../reducers/data/jobs/util';

export const FLOW_STEP_STATUS = {
  WAITING: 'WAITING',
  CANCELLING: 'CANCELLING',
};

export const getFlowStepsYetToBeCreated = (flow, createdSteps = []) => {
  const { pageProcessors: pps = []} = flow || {};

  return pps.filter(pp => {
    if (!createdSteps.length) return true;
    if (pp.type === 'export') {
      return !createdSteps.some(c => c._exportId === pp._exportId);
    }
    if (pp.type === 'import') {
      return !createdSteps.some(c => c._importId === pp._importId);
    }

    return false;
  });
};

export const generatePendingFlowSteps = (pageProcessors = [], resourceMap = {}) =>
  pageProcessors.reduce((flowSteps, pp) => {
    const { type, _exportId, _importId } = pp;

    if (type === 'export') {
      flowSteps.push({
        type,
        name: resourceMap?.exports[_exportId]?.name,
        uiStatus: FLOW_STEP_STATUS.WAITING,
      });
    } else {
      flowSteps.push({
        type,
        name: resourceMap?.imports[_importId]?.name,
        uiStatus: FLOW_STEP_STATUS.WAITING,
      });
    }

    return flowSteps;
  }, []);

export const getRunConsoleJobSteps = (parentJob = {}, childJobs = [], resourceMap = {}) => {
  const dashboardSteps = [];
  const additionalProps = {
    doneExporting: !!parentJob.doneExporting,
  };

  if (!additionalProps.doneExporting) {
    if (
      [
        JOB_STATUS.COMPLETED,
        JOB_STATUS.CANCELED,
        JOB_STATUS.FAILED,
      ].includes(parentJob.status)
    ) {
      additionalProps.doneExporting = true;
    }
  }
  childJobs.forEach(cJob => {
    const additionalChildProps = {
      uiStatus: cJob.status,
      duration: getJobDuration(cJob),
      name: cJob._exportId
        ? resourceMap.exports && resourceMap.exports[cJob._exportId]?.name
        : resourceMap.imports && resourceMap.imports[cJob._importId]?.name,
    };

    // If parent job is cancelled, show child in progress jobs as cancelling
    if (parentJob.status === JOB_STATUS.CANCELED && cJob.status === JOB_STATUS.RUNNING) {
      additionalChildProps.uiStatus = FLOW_STEP_STATUS.CANCELLING;
    }

    if (cJob.type === 'import') {
      if (additionalProps.doneExporting && parentJob.numPagesGenerated > 0) {
        additionalChildProps.percentComplete = Math.floor(
          (cJob.numPagesProcessed * 100) / parentJob.numPagesGenerated
        );
      } else {
        additionalChildProps.percentComplete = 0;
      }
    }

    dashboardSteps.push({ ...cJob, ...additionalChildProps });
  });

  return dashboardSteps;
};

export const getParentJobSteps = parentJob => {
  const parentJobSteps = [];

  // when the job is queued / when the parent job is in progress with no children created yet
  if (parentJob?.status === JOB_STATUS.QUEUED ||
    (parentJob?.status === JOB_STATUS.RUNNING && !parentJob?.children?.length)) {
    parentJobSteps.push({...parentJob, uiStatus: parentJob.status});
  }
  if (parentJob?.status === JOB_STATUS.CANCELED && parentJob?.children?.length === 0) {
    // In cases when job is cancelled while it is in queue, children are not yet created
    // So show this job as the export step cancelled
    parentJobSteps.push({...parentJob, uiStatus: parentJob.status});
  }

  return parentJobSteps;
};

