import actionTypes from '../../../actions/types';
import {
  JOB_TYPES,
  JOB_STATUS,
  STANDALONE_INTEGRATION,
} from '../../../utils/constants';
import {
  getFlowJobIdsThatArePartOfBulkRetryJobs,
  getJobDuration,
} from './util';

function parseJobs(jobs) {
  const flowJobs = jobs.filter(job => job.type === JOB_TYPES.FLOW);
  const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);

  return { flowJobs, bulkRetryJobs };
}

const defaultState = {
  flowJobs: [],
  bulkRetryJobs: [],
  errors: {},
  retryObjects: {},
};

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
      ...state,
      flowJobs,
      bulkRetryJobs,
    };
  } else if (type === actionTypes.JOB.RECEIVED_FAMILY) {
    if (job.type === JOB_TYPES.FLOW) {
      const index = state.flowJobs.findIndex(j => j._id === job._id);

      if (index > -1) {
        const existingJob = state.flowJobs[index];
        const propsToOverwrite = {};

        if (existingJob.__original && existingJob.__original.numError) {
          propsToOverwrite.numError = existingJob.numError;
          propsToOverwrite.numResolved = existingJob.numResolved;
        }

        const newCollection = [
          ...state.flowJobs.slice(0, index),
          {
            ...existingJob,
            ...job,
            ...propsToOverwrite,
          },
          ...state.flowJobs.slice(index + 1),
        ];

        return { ...state, flowJobs: newCollection };
      } else if (job.status === JOB_STATUS.QUEUED) {
        return { ...state, flowJobs: [job, ...state.flowJobs] };
      }
    } else if (job.type === JOB_TYPES.BULK_RETRY) {
      let index = state.bulkRetryJobs.findIndex(j => j._id === job._id);

      if (index === -1) {
        if (job.status === JOB_STATUS.QUEUED) {
          index = state.bulkRetryJobs.findIndex(j => !j._id);
        }
      }

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
  } else if (type === actionTypes.JOB.RETRY_INIT) {
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
              children: [
                ...parentJob.children.slice(0, childJobIndex),
                {
                  ...childJob,
                  retries: [
                    ...(childJob.retries || []),
                    { type: JOB_TYPES.RETRY },
                  ],
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
            if (!cJob.retriable) {
              return cJob;
            }

            return {
              ...cJob,
              retries: [...(cJob.retries || []), { type: JOB_TYPES.RETRY }],
            };
          });
        }

        parentJob = { ...parentJob, children };
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
  } else if (type === actionTypes.JOB.RETRY_UNDO) {
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

            const retryIndex = childJob.retries.findIndex(
              r => !r._id && r.type === JOB_TYPES.RETRY
            );

            parentJob = {
              ...parentJob,
              children: [
                ...parentJob.children.slice(0, childJobIndex),
                {
                  ...childJob,
                  retries:
                    retryIndex > -1
                      ? [
                          ...childJob.retries.slice(0, retryIndex),
                          ...childJob.retries.slice(retryIndex + 1),
                        ]
                      : [...childJob.retries],
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
            if (!cJob.retries || cJob.retries.length === 0) {
              return cJob;
            }

            const retryIndex = cJob.retries.findIndex(
              r => !r._id && r.type === JOB_TYPES.RETRY
            );

            if (retryIndex === -1) {
              return cJob;
            }

            return {
              ...cJob,
              retries: [
                ...cJob.retries.slice(0, retryIndex),
                ...cJob.retries.slice(retryIndex + 1),
              ],
            };
          });
        }

        parentJob = { ...parentJob, children };
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
  } else if (type === actionTypes.JOB.RETRY_ALL_INIT) {
    const { bulkRetryJobs } = state;

    return {
      ...state,
      bulkRetryJobs: [
        ...bulkRetryJobs,
        { type: 'bulk_retry', status: JOB_STATUS.QUEUED },
      ],
    };
  } else if (type === actionTypes.JOB.RETRY_ALL_UNDO) {
    const bulkRetryJobIndex = state.bulkRetryJobs.findIndex(j => !j._id);

    if (bulkRetryJobIndex > -1) {
      return {
        ...state,
        bulkRetryJobs: [
          ...state.bulkRetryJobs.slice(0, bulkRetryJobIndex),
          ...state.bulkRetryJobs.slice(bulkRetryJobIndex + 1),
        ],
      };
    }
  } else if (type === actionTypes.JOB.ERROR.RECEIVED_COLLECTION) {
    let _id = 0;
    const errors = collection.map(je => {
      _id += 1;

      return {
        _id: _id.toString(),
        ...je,
      };
    });

    return { ...state, errors: { [jobId]: errors } };
  } else if (type === actionTypes.JOB.RECEIVED_RETRY_OBJECT_COLLECTION) {
    const retryObjectsMap = {};

    collection.forEach(rt => {
      retryObjectsMap[rt._id] = rt;
    });

    return { ...state, retryObjects: { [jobId]: retryObjectsMap } };
  } else if (type === actionTypes.JOB.ERROR.RESOLVE_SELECTED_INIT) {
    if (!state || !state.errors || !state.errors[jobId]) {
      return [];
    }

    const errors = state.errors[jobId];
    const { selectedErrorIds } = action;

    return {
      ...state,
      errors: {
        [jobId]: errors.map(je => {
          if (selectedErrorIds.includes(je._id)) {
            return { ...je, resolved: true };
          }

          return { ...je };
        }),
      },
    };
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

          if (
            cJob.retries &&
            cJob.retries.filter(
              r =>
                !r.status ||
                [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(r.status)
            ).length > 0
          ) {
            additionalChildProps.uiStatus = JOB_STATUS.RETRYING;
            additionalProps.uiStatus = JOB_STATUS.RETRYING;
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
  const jobIds = { flowJobs: [], bulkRetryJobs: [] };

  if (!state) {
    return jobIds;
  }

  const runningBulkRetryJobs = {};

  // eslint-disable-next-line max-len
  /** Build a map of running bulk retry jobs with _integrationId & _flowId as the key and _id as value */
  state.bulkRetryJobs.forEach(job => {
    if (job._id && [JOB_STATUS.QUEUED].includes(job.status)) {
      jobIds.bulkRetryJobs.push(job._id);
    }

    if (job.status === JOB_STATUS.RUNNING) {
      runningBulkRetryJobs[
        [
          job._integrationId || STANDALONE_INTEGRATION.id,
          job._flowId || '',
        ].join('')
      ] = job._id;
    }
  });

  let hasJobsInRetryingState = false;

  state.flowJobs.forEach(job => {
    if (
      [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING, JOB_STATUS.RETRYING].includes(
        job.status
      )
    ) {
      jobIds.flowJobs.push(job._id);

      if (job.status === JOB_STATUS.RETRYING) {
        hasJobsInRetryingState = true;
      }
    } else if (job.children) {
      const inProgressChildren = job.children.filter(cJob =>
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING, JOB_STATUS.RETRYING].includes(
          cJob.status
        )
      );

      if (inProgressChildren.length > 0) {
        jobIds.flowJobs.push(job._id);
      }
    }
  });

  // eslint-disable-next-line max-len
  /** Find jobs that are part of a running bulk retry but the status is not 'retrying' */
  if (Object.keys(runningBulkRetryJobs).length > 0 && !hasJobsInRetryingState) {
    state.flowJobs.forEach(job => {
      if (
        [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
          job.status
        )
      ) {
        if (!job.children || job.children.length === 0) {
          if (
            runningBulkRetryJobs[
              job._integrationId || STANDALONE_INTEGRATION.id
            ] ||
            runningBulkRetryJobs[
              [
                job._integrationId || STANDALONE_INTEGRATION.id,
                job._flowId,
              ].join('')
            ]
          ) {
            jobIds.flowJobs.push(job._id);
          }
        } else {
          const hasJobsOfBulkRetry = job.children.filter(
            cJob =>
              cJob.retries &&
              cJob.retries.filter(r => !!runningBulkRetryJobs[r._bulkJobId])
                .length > 0
          );

          if (!hasJobsOfBulkRetry) {
            jobIds.flowJobs.push(job._id);
          }
        }
      }
    });
  }

  return jobIds;
}

export function job(state, { type, jobId, parentJobId }) {
  if (!state) {
    return undefined;
  }

  const jobs =
    state[type === JOB_TYPES.BULK_RETRY ? 'bulkRetryJobs' : 'flowJobs'];

  if (!jobs) {
    return undefined;
  }

  if (!parentJobId) {
    return jobs.find(j => j._id === jobId);
  }

  const parentJob = jobs.find(j => j._id === parentJobId);

  if (!parentJob || !parentJob.children || parentJob.children.length === 0) {
    return undefined;
  }

  return parentJob.children.find(j => j._id === jobId);
}

export function isBulkRetryInProgress(state) {
  if (!state) {
    return false;
  }

  return (
    state.bulkRetryJobs.filter(job =>
      [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(job.status)
    ).length > 0
  );
}

export function jobErrors(state, jobId) {
  if (!state || !state.errors || !state.errors[jobId]) {
    return [];
  }

  const errors = state.errors[jobId];
  const retryObjects = state.retryObjects[jobId] || {};

  return errors.map(e => {
    const retryObject = (e._retryId && retryObjects[e._retryId]) || {};

    return {
      ...e,
      retryObject: {
        ...retryObject,
        isDataEditable: ['object', 'page'].includes(retryObject.type),
        isRetriable: ['file', 'object', 'page'].includes(retryObject.type),
      },
    };
  });
}

// #endregion
