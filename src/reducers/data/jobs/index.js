import actionTypes from '../../../actions/types';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import {
  getFlowJobIdsThatArePartOfBulkRetryJobs,
  getJobDuration,
} from './util';

function parseJobs(jobs) {
  const flowJobs = jobs.filter(job => job.type === JOB_TYPES.FLOW);
  const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);

  return { flowJobs, bulkRetryJobs };
}

const defaultState = { flowJobs: [], bulkRetryJobs: [] };

export default (state = defaultState, action) => {
  const { type, collection, job, jobId, parentJobId } = action;

  if (!type) {
    return state;
  }

  if (type === actionTypes.JOB.CLEAR) {
    return defaultState;
  }

  if (type === actionTypes.JOB.RECEIVED_COLLECTION) {
    const { flowJobs, bulkRetryJobs } = parseJobs(collection || []);

    return {
      flowJobs,
      bulkRetryJobs,
    };
  } else if (type === actionTypes.JOB.RECEIVED_FAMILY) {
    if (job.type === JOB_TYPES.FLOW) {
      const index = state.flowJobs.findIndex(j => j._id === job._id);

      if (index > -1) {
        const newCollection = [
          ...state.flowJobs.slice(0, index),
          {
            ...state.flowJobs[index],
            ...job,
          },
          ...state.flowJobs.slice(index + 1),
        ];

        return { ...state, flowJobs: newCollection };
      } else if (job.status === JOB_STATUS.QUEUED) {
        return { ...state, flowJobs: [job, ...state.flowJobs] };
      }
    } else if (job.type === JOB_TYPES.BULK_RETRY) {
      const index = state.bulkRetryJobs.findIndex(j => j._id === job._id);

      if (index > -1) {
        const newCollection = [
          ...state.bulkRetryJobs.slice(0, index),
          {
            ...job,
          },
          ...state.bulkRetryJobs.slice(index + 1),
        ];

        return { ...state, bulkRetryJobs: newCollection };
      }
    }
  } else if (type === actionTypes.JOB.RESOLVE_ALL_INIT) {
    const newCollection = state.flowJobs.map(job => {
      if (!job.numError) {
        return job;
      }

      let children = [];

      if (job.children && job.children.length) {
        children = job.children.map(cJob => {
          if (!cJob.numError) {
            return cJob;
          }

          return {
            ...cJob,
            __original: {
              numError: cJob.numError,
              numResolved: cJob.numResolved,
            },
            numError: 0,
            numResolved: cJob.numResolved + cJob.numError,
          };
        });
      }

      return {
        ...job,
        numError: 0,
        numResolved: (job.numResolved || 0) + (job.numError || 0),
        __original: {
          numError: job.numError,
          numResolved: job.numResolved,
        },
        children,
      };
    });

    return { ...state, flowJobs: newCollection };
  } else if (type === actionTypes.JOB.RESOLVE_ALL_UNDO) {
    const newCollection = state.flowJobs.map(job => {
      if (!job.__original || !job.__original.numError) {
        return job;
      }

      let children = [];

      if (job.children && job.children.length) {
        children = job.children.map(cJob => {
          if (!cJob.__original || !cJob.__original.numError) {
            return cJob;
          }

          return {
            ...cJob,
            numError: cJob.__original.numError,
            numResolved: cJob.numResolved - cJob.__original.numError,
            __original: {},
          };
        });
      }

      return {
        ...job,
        numError: job.__original.numError,
        numResolved: job.numResolved - job.__original.numError,
        __original: {},
        children,
      };
    });

    return { ...state, flowJobs: newCollection };
  } else if (type === actionTypes.JOB.RESOLVE_INIT) {
    let childJobIndex;
    let childJob;
    let parentJobIndex;
    let parentJob;

    if (parentJobId) {
      parentJobIndex = state.flowJobs.findIndex(j => j._id === parentJobId);

      if (parentJobIndex > -1) {
        parentJob = state.flowJobs[parentJobIndex];

        if (parentJob.children.length > 0) {
          childJobIndex = parentJob.children.findIndex(j => j._id === jobId);

          if (childJobIndex > -1) {
            childJob = parentJob.children[childJobIndex];

            parentJob = {
              ...parentJob,
              numError: parentJob.numError - childJob.numError,
              numResolved: parentJob.numResolved + childJob.numError,
              __original: {
                numError: parentJob.numError,
                numResolved: parentJob.numResolved,
              },
              children: [
                ...parentJob.children.slice(0, childJobIndex),
                {
                  ...childJob,
                  numError: 0,
                  numResolved: childJob.numResolved + childJob.numError,
                  __original: {
                    numError: childJob.numError,
                    numResolved: childJob.numResolved,
                  },
                },
                ...parentJob.children.slice(childJobIndex + 1),
              ],
            };
          }
        }
      }
    } else {
      parentJobIndex = state.flowJobs.findIndex(j => j._id === jobId);

      if (parentJobIndex > -1) {
        parentJob = state.flowJobs[parentJobIndex];
        let children = [];

        if (parentJob.children && parentJob.children.length) {
          children = parentJob.children.map(cJob => {
            if (!cJob.numError) {
              return cJob;
            }

            return {
              ...cJob,
              __original: {
                numError: cJob.numError,
                numResolved: cJob.numResolved,
              },
              numError: 0,
              numResolved: cJob.numResolved + cJob.numError,
            };
          });
        }

        parentJob = {
          ...parentJob,
          numError: 0,
          numResolved: (parentJob.numResolved || 0) + (parentJob.numError || 0),
          __original: {
            numError: parentJob.numError,
            numResolved: parentJob.numResolved,
          },
          children,
        };
      }
    }

    if (parentJobIndex > -1) {
      const newCollection = [
        ...state.flowJobs.slice(0, parentJobIndex),
        parentJob,
        ...state.flowJobs.slice(parentJobIndex + 1),
      ];

      return { ...state, flowJobs: newCollection };
    }
  } else if (type === actionTypes.JOB.RESOLVE_UNDO) {
    let childJobIndex;
    let childJob;
    let parentJobIndex;
    let parentJob;

    if (parentJobId) {
      parentJobIndex = state.flowJobs.findIndex(j => j._id === parentJobId);

      if (parentJobIndex > -1) {
        parentJob = state.flowJobs[parentJobIndex];
        childJobIndex = parentJob.children.findIndex(j => j._id === jobId);

        if (childJobIndex > -1) {
          childJob = parentJob.children[childJobIndex];
          childJob = {
            ...childJob,
            numError: childJob.__original.numError,
            numResolved: childJob.__original.numResolved,
            __original: {},
          };

          parentJob = {
            ...parentJob,
            numError: parentJob.numError + childJob.numError,
            numResolved: parentJob.numResolved - childJob.numError,
            children: [
              ...parentJob.children.slice(0, childJobIndex),
              childJob,
              ...parentJob.children.slice(childJobIndex + 1),
            ],
          };
        }
      }
    } else {
      parentJobIndex = state.flowJobs.findIndex(j => j._id === jobId);

      if (parentJobIndex > -1) {
        parentJob = state.flowJobs[parentJobIndex];
        const children = parentJob.children.map(cJob => {
          if (!cJob.__original || !cJob.__original.numError) {
            return cJob;
          }

          return {
            ...cJob,
            numError: cJob.__original.numError,
            numResolved: cJob.__original.numResolved,
            __original: {},
          };
        });

        parentJob = {
          ...parentJob,
          ...{
            numError: parentJob.__original.numError,
            numResolved: parentJob.__original.numResolved,
          },
          __original: {},
          children,
        };
      }
    }

    if (parentJobIndex > -1) {
      const newCollection = [
        ...state.flowJobs.slice(0, parentJobIndex),
        parentJob,
        ...state.flowJobs.slice(parentJobIndex + 1),
      ];

      return { ...state, flowJobs: newCollection };
    }
  }

  return state;
};

// #region PUBLIC SELECTORS
export function jobList(state) {
  if (!state) {
    return defaultState;
  }

  return state;
}

export function flowJobList(state) {
  if (!state) {
    return defaultState.flowJobs;
  }

  const { flowJobs, bulkRetryJobs } = state;
  const flowJobIds = getFlowJobIdsThatArePartOfBulkRetryJobs(
    flowJobs,
    bulkRetryJobs
  );

  return flowJobs.map(job => {
    const additionalProps = {
      uiStatus: job.status,
      duration: getJobDuration(job),
      numSuccess: job.numSuccess || 0,
      numIgnore: job.numIgnore || 0,
      numError: job.numError || 0,
      numResolved: job.numResolved || 0,
      numPagesGenerated: job.numPagesGenerated || 0,
      numPagesProcessed: 0,
      doneExporting: job.doneExporting,
    };

    if (!additionalProps.doneExporting) {
      if (
        [JOB_STATUS.COMPLETED, JOB_STATUS.CANCELED, JOB_STATUS.FAILED].includes(
          job.status
        )
      ) {
        additionalProps.doneExporting = true;
      }
    }

    if (flowJobIds.includes(job._id)) {
      additionalProps.uiStatus = JOB_STATUS.RETRYING;
    }

    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          uiStatus: cJob.status,
          duration: getJobDuration(cJob),
          numError: cJob.numError || 0,
          numResolved: cJob.numResolved || 0,
        };

        if (cJob.type === 'import') {
          if (
            additionalProps.doneExporting &&
            additionalProps.numPagesGenerated > 0
          ) {
            additionalChildProps.__percentComplete = Math.floor(
              (cJob.numPagesProcessed * 100) / additionalProps.numPagesGenerated
            );
          } else {
            additionalChildProps.__percentComplete = 0;
          }

          additionalProps.numPagesProcessed += parseInt(
            cJob.numPagesProcessed,
            10
          );

          if (cJob.retriable) {
            additionalProps.retriable = true;
          }
        }

        return { ...cJob, ...additionalChildProps };
      });
    } else {
      additionalProps.children = [];
    }

    return { ...job, ...additionalProps };
  });
}

export function inProgressJobIds(state) {
  const jobIds = [];

  if (!state) {
    return jobIds;
  }

  state.flowJobs.forEach(job => {
    if ([JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(job.status)) {
      jobIds.push(job._id);
    } else if (job.children) {
      const inProgressChildren = job.children.filter(cJob =>
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(cJob.status)
      );

      if (inProgressChildren.length > 0) {
        jobIds.push(job._id);
      }
    }
  });

  return jobIds;
}

// #endregion
