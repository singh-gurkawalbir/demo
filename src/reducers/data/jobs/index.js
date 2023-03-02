import produce from 'immer';
import { groupBy } from 'lodash';
import { createSelector } from 'reselect';
import { generateId } from '../../../utils/string';
import actionTypes from '../../../actions/types';
import {
  JOB_TYPES,
  JOB_STATUS,
  STANDALONE_INTEGRATION,
} from '../../../constants';
import {
  DEFAULT_STATE,
  parseJobs,
  parseJobFamily,
  getFlowJobIdsThatArePartOfBulkRetryJobs,
  getJobDuration,
  RETRY_OBJECT_TYPES,
} from './util';
import customCloneDeep from '../../../utils/customCloneDeep';

function getParentJobIndex(jobs, jobId) {
  return jobs.findIndex(j => j._id === jobId);
}

function getChildJobIndexDetails(jobs, parentJobId, jobId) {
  const parentJobIndex = getParentJobIndex(jobs, parentJobId);
  let childJobIndex = -1;

  if (parentJobIndex > -1 && jobId) {
    childJobIndex = jobs[parentJobIndex]?.children?.findIndex(
      cj => cj._id === jobId
    );
  }

  return {
    parentJobIndex,
    childJobIndex,
  };
}

function parseJobErrors(collection) {
  const errors = (collection || []).map(je => ({
    _id: generateId(),
    ...je,
  }));
  const errorsGroupedByRetryId = groupBy(errors, je => je._retryId || je._id);

  return Object.keys(errorsGroupedByRetryId).map(retryId => {
    const [first, ...rest] = errorsGroupedByRetryId[retryId];

    return { ...first, similarErrors: rest };
  });
}

export default (state = DEFAULT_STATE, action) => {
  const { type, collection = [], job } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.JOB.PAGING.SET_ROWS_PER_PAGE:
      {
        let { rowsPerPage } = action;

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(rowsPerPage) || parseInt(rowsPerPage, 10) <= 0) {
          ({ rowsPerPage } = DEFAULT_STATE.paging);
        }

        if (!draft.paging) {
          draft.paging = {rowsPerPage: parseInt(rowsPerPage, 10)};
        } else {
          draft.paging.rowsPerPage = parseInt(rowsPerPage, 10);
        }

        break;
      }

      case actionTypes.JOB.PAGING.SET_CURRENT_PAGE:
      {
        let { currentPage } = action;

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(currentPage) || parseInt(currentPage, 10) < 0) {
          ({ currentPage } = DEFAULT_STATE.paging);
        }

        if (!draft.paging) {
          draft.paging = {currentPage: parseInt(currentPage, 10)};
        } else {
          draft.paging.currentPage = parseInt(currentPage, 10);
        }

        break;
      }
      case actionTypes.JOB.CLEAR:
        return DEFAULT_STATE;
      case actionTypes.JOB.ERROR.CLEAR:
        draft.errors = [];
        draft.retryObjects = {};
        break;

      case actionTypes.JOB.REQUEST_COLLECTION:
        draft.status = 'loading';
        break;

      case actionTypes.JOB.RECEIVED_COLLECTION:
      {
        const { flowJobs, bulkRetryJobs } = parseJobs(collection || []);

        draft.flowJobs = flowJobs;
        draft.bulkRetryJobs = bulkRetryJobs;
        draft.status = undefined;
        break;
      }

      case actionTypes.JOB.RECEIVED_FAMILY:
      {
        if (job?.type === JOB_TYPES.FLOW) {
          const jobWithDefaultProps = parseJobFamily(job);
          const index = getParentJobIndex(draft.flowJobs, job._id);

          if (index > -1) {
            const existingJob = { ...draft.flowJobs[index] };
            const propsToOverwrite = {};

            if (existingJob.__original && existingJob.__original.numError) {
              propsToOverwrite.numError = existingJob.numError;
              propsToOverwrite.numResolved = existingJob.numResolved;
            }

            draft.flowJobs.splice(index, 1, {
              ...existingJob,
              ...jobWithDefaultProps,
              ...propsToOverwrite,
            });

            break;
          }

          if (job.status === JOB_STATUS.QUEUED) {
            draft.flowJobs = [jobWithDefaultProps, ...draft.flowJobs];
            break;
          }
        } else if (job?.type === JOB_TYPES.BULK_RETRY) {
          let index = draft.bulkRetryJobs.findIndex(j => j._id === job._id);

          if (index === -1) {
            if (job.status === JOB_STATUS.QUEUED) {
              index = draft.bulkRetryJobs.findIndex(j => !j._id);
            }
          }

          if (index > -1) {
            draft.bulkRetryJobs.splice(index, 1, {
              ...job,
            });

            break;
          }
        }
        break;
      }

      case actionTypes.JOB.RESOLVE_ALL_INIT:
      {
        const newCollection = draft.flowJobs.map(job => {
          if (job.status === JOB_STATUS.RUNNING || job.numError === 0) {
            return job;
          }

          const updatedJob = {
            ...job,
            numError: 0,
            numResolved: job.numResolved + job.numError,
            __original: {
              numError: job.numError,
              numResolved: job.numResolved,
            },
          };

          if (job.children && job.children.length > 0) {
            updatedJob.children = job.children.map(cJob => {
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

          return updatedJob;
        });

        draft.flowJobs = newCollection;
        break;
      }

      case actionTypes.JOB.RESOLVE_ALL_UNDO:
      {
        const newCollection = draft.flowJobs.map(job => {
          if (!job.__original || !job.__original.numError) {
            return job;
          }

          const { __original, ...restOfParentJob } = job;

          restOfParentJob.numError = __original.numError;
          restOfParentJob.numResolved -= __original.numError;

          if (job.children && job.children.length > 0) {
            restOfParentJob.children = job.children.map(cJob => {
              if (!cJob.__original || !cJob.__original.numError) {
                return cJob;
              }

              const { __original, ...rest } = cJob;

              return {
                ...rest,
                numError: __original.numError,
                numResolved: rest.numResolved - __original.numError,
              };
            });
          }

          return restOfParentJob;
        });

        draft.flowJobs = newCollection;
        break;
      }

      case actionTypes.JOB.RESOLVE_INIT:
      {
        const { parentJobId, childJobId } = action;
        const { parentJobIndex, childJobIndex } = getChildJobIndexDetails(
          draft.flowJobs,
          parentJobId,
          childJobId
        );

        if (parentJobIndex === -1) {
          break;
        }

        if (parentJobId && childJobId && childJobIndex === -1) {
          break;
        }

        let parentJob = { ...draft.flowJobs[parentJobIndex] };

        if (childJobIndex > -1) {
          const childJob = parentJob.children[childJobIndex];

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
        } else {
          parentJob = {
            ...parentJob,
            numError: 0,
            numResolved: parentJob.numResolved + parentJob.numError,
            __original: {
              numError: parentJob.numError,
              numResolved: parentJob.numResolved,
            },
          };

          if (parentJob.children && parentJob.children.length) {
            parentJob.children = parentJob.children.map(cJob => {
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
        }

        draft.flowJobs.splice(parentJobIndex, 1, parentJob);

        break;
      }

      case actionTypes.JOB.RESOLVE_UNDO:
      {
        const { parentJobId, childJobId } = action;
        const { parentJobIndex, childJobIndex } = getChildJobIndexDetails(
          draft.flowJobs,
          parentJobId,
          childJobId
        );

        if (parentJobIndex === -1) {
          break;
        }

        if (parentJobId && childJobId && childJobIndex === -1) {
          break;
        }

        let parentJob = { ...draft.flowJobs[parentJobIndex] };
        const { __original, ...restOfParentJob } = parentJob;

        if (childJobIndex > -1) {
          const { __original, ...restOfChildJob } = parentJob.children[
            childJobIndex
          ];
          const childJob = {
            ...restOfChildJob,
            numError: __original.numError,
            numResolved: __original.numResolved,
          };

          parentJob = {
            ...restOfParentJob,
            numError: parentJob.numError + childJob.numError,
            numResolved: parentJob.numResolved - childJob.numError,
            children: [
              ...parentJob.children.slice(0, childJobIndex),
              childJob,
              ...parentJob.children.slice(childJobIndex + 1),
            ],
          };
        } else {
          parentJob = {
            ...restOfParentJob,
            numError: __original.numError,
            numResolved: __original.numResolved,
          };

          if (parentJob.children && parentJob.children.length > 0) {
            parentJob.children = parentJob.children.map(cJob => {
              if (!cJob.__original || !cJob.__original.numError) {
                return cJob;
              }

              const { __original, ...rest } = cJob;

              return {
                ...rest,
                numError: __original.numError,
                numResolved: __original.numResolved,
              };
            });
          }
        }

        draft.flowJobs.splice(parentJobIndex, 1, parentJob);
        break;
      }

      case actionTypes.JOB.RETRY_INIT:
      {
        const { parentJobId, childJobId } = action;
        const { parentJobIndex, childJobIndex } = getChildJobIndexDetails(
          draft.flowJobs,
          parentJobId,
          childJobId
        );

        if (parentJobIndex === -1) {
          break;
        }

        if (parentJobId && childJobId && childJobIndex === -1) {
          break;
        }

        let parentJob = { ...draft.flowJobs[parentJobIndex] };

        if (childJobIndex > -1) {
          const childJob = parentJob.children[childJobIndex];

          parentJob = {
            ...parentJob,
            children: [
              ...parentJob.children.slice(0, childJobIndex),
              {
                ...childJob,
                retries: [...(childJob.retries || []), { type: JOB_TYPES.RETRY }],
              },
              ...parentJob.children.slice(childJobIndex + 1),
            ],
          };
        } else if (parentJob.children && parentJob.children.length > 0) {
          parentJob.children = parentJob.children.map(cJob => {
            if (!cJob.retriable) {
              return cJob;
            }

            return {
              ...cJob,
              retries: [...(cJob.retries || []), { type: JOB_TYPES.RETRY }],
            };
          });
        }

        draft.flowJobs.splice(parentJobIndex, 1, parentJob);
        break;
      }

      case actionTypes.JOB.RETRY_UNDO:
      {
        let childJob;
        const { parentJobId, childJobId } = action;
        const { parentJobIndex, childJobIndex } = getChildJobIndexDetails(
          draft.flowJobs,
          parentJobId,
          childJobId
        );

        if (parentJobIndex === -1) {
          break;
        }

        if (parentJobId && childJobId && childJobIndex === -1) {
          break;
        }

        let parentJob = { ...draft.flowJobs[parentJobIndex] };

        if (childJobIndex > -1) {
          childJob = parentJob.children[childJobIndex];
          const retryIndex = childJob.retries.findIndex(
            r => !r._id && r.type === JOB_TYPES.RETRY
          );

          if (retryIndex > -1) {
            childJob = {
              ...childJob,
              retries: [
                ...childJob.retries.slice(0, retryIndex),
                ...childJob.retries.slice(retryIndex + 1),
              ],
            };
          }

          if (childJob.retries.length === 0) {
            delete childJob.retries;
          }

          parentJob = {
            ...parentJob,
            children: [
              ...parentJob.children.slice(0, childJobIndex),
              childJob,
              ...parentJob.children.slice(childJobIndex + 1),
            ],
          };
        } else if (parentJob.children && parentJob.children.length > 0) {
          parentJob.children = parentJob.children.map(cJob => {
            if (!cJob.retries || cJob.retries.length === 0) {
              return cJob;
            }

            const retryIndex = cJob.retries.findIndex(
              r => !r._id && r.type === JOB_TYPES.RETRY
            );

            if (retryIndex === -1) {
              return cJob;
            }

            if (cJob.retries.length === 1) {
              const { retries, ...restOfChildJob } = cJob;

              return restOfChildJob;
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

        draft.flowJobs.splice(parentJobIndex, 1, parentJob);
        break;
      }

      case actionTypes.JOB.RETRY_ALL_INIT:
      {
        const { flowIds } = action;

        draft.bulkRetryJobs = [
          { type: 'bulk_retry', status: JOB_STATUS.QUEUED, _flowIds: flowIds },
          ...draft.bulkRetryJobs,
        ];

        break;
      }

      case actionTypes.JOB.RETRY_ALL_UNDO:
      {
        const bulkRetryJobIndex = draft.bulkRetryJobs.findIndex(j => !j._id);

        if (bulkRetryJobIndex > -1) {
          draft.bulkRetryJobs.splice(bulkRetryJobIndex, 1);
        }
        break;
      }

      case actionTypes.JOB.ERROR.RECEIVED_COLLECTION:
        draft.errors = parseJobErrors(collection);
        break;

      case actionTypes.JOB.RECEIVED_RETRY_OBJECT_COLLECTION:
      {
        const retryObjects = {};

        collection.forEach(rt => {
          retryObjects[rt._id] = rt;
        });
        draft.retryObjects = retryObjects;
        break;
      }

      case actionTypes.JOB.ERROR.RESOLVE_SELECTED_INIT:
      {
        if (!draft || !draft.errors) {
          break;
        }

        const { errors } = draft;
        const { selectedErrorIds } = action;

        draft.errors = errors.map(je => {
          if (selectedErrorIds.includes(je._id)) {
            if (je.similarErrors && je.similarErrors.length > 0) {
              return {
                ...je,
                resolved: true,
                similarErrors: je.similarErrors.map(sje => ({
                  ...sje,
                  resolved: true,
                })),
              };
            }

            return { ...je, resolved: true };
          }

          return { ...je };
        });

        break;
      }

      case actionTypes.JOB.ERROR.RECEIVED_RETRY_DATA:
      {
        const { retryData, retryId } = action;

        if (!draft || !draft.retryObjects || !draft.retryObjects[retryId]) {
          break;
        }

        const { retryObjects } = draft;

        draft.retryObjects = {
          ...retryObjects,
          [retryId]: { ...retryObjects[retryId], retryData },
        };

        break;
      }

      case actionTypes.JOB.PURGE.SUCCESS:
        draft.purgeFilesStatus = 'success';
        break;
      case actionTypes.JOB.PURGE.CLEAR:
        delete draft.purgeFilesStatus;
        break;

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.flowJobsPagingDetails = createSelector(
  state => state && state.paging,
  state => state && state.flowJobs,
  (paging = DEFAULT_STATE.paging, flowJobs = DEFAULT_STATE.flowJobs) => ({
    paging,
    totalJobs: flowJobs ? flowJobs.length : 0,
  })
);

selectors.flowJobs = createSelector(
  state => state && state.paging,
  state => state && state.flowJobs,
  state => state && state.bulkRetryJobs,
  (_1, options) => options,
  (paging, flowJobs, bulkRetryJobs, options) => {
    if (!paging && !flowJobs && !bulkRetryJobs) {
      return DEFAULT_STATE.flowJobs;
    }
    const flowJobIdsThatArePartOfBulkRetryJobs = getFlowJobIdsThatArePartOfBulkRetryJobs(
      flowJobs,
      bulkRetryJobs
    );

    let allflowJobs = flowJobs;

    if (!options?.includeAll) {
      allflowJobs = flowJobs
        .slice(
          paging.currentPage * paging.rowsPerPage,
          (paging.currentPage + 1) * paging.rowsPerPage
        );
    }

    return allflowJobs.map(job => {
      const additionalProps = {
        uiStatus: job.status,
        duration: getJobDuration(job),
        doneExporting: !!job.doneExporting,
        numPagesProcessed: 0,
      };

      if (!additionalProps.doneExporting) {
        if (
          [
            JOB_STATUS.COMPLETED,
            JOB_STATUS.CANCELED,
            JOB_STATUS.FAILED,
          ].includes(job.status)
        ) {
          additionalProps.doneExporting = true;
        }
      }

      if (flowJobIdsThatArePartOfBulkRetryJobs.includes(job._id)) {
        additionalProps.uiStatus = JOB_STATUS.RETRYING;
      }

      let jobChildren = job.children;

      if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
        jobChildren = job.children.filter(cJob => !!cJob).map(childJob => {
          const cJob = customCloneDeep(childJob);
          const additionalChildProps = {
            uiStatus: cJob.status,
            duration: getJobDuration(cJob),
          };

          if (cJob.type === 'import') {
            if (additionalProps.doneExporting && job.numPagesGenerated > 0) {
              additionalChildProps.percentComplete = Math.floor(
                (cJob.numPagesProcessed * 100) / job.numPagesGenerated
              );
            } else {
              additionalChildProps.percentComplete = 0;
            }

            additionalProps.numPagesProcessed += parseInt(
              cJob.numPagesProcessed,
              10
            );

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

            if (cJob.retriable) {
              additionalProps.retriable = true;

              if (additionalProps.uiStatus === JOB_STATUS.RETRYING) {
                additionalChildProps.uiStatus = JOB_STATUS.RETRYING;
              }
            }
          }

          if (cJob.retries && cJob.retries.length > 0) {
          // eslint-disable-next-line no-param-reassign
            cJob.retries = cJob.retries.map(r => ({
              ...r,
              duration: getJobDuration(r),
            }));
          }

          return { ...cJob, ...additionalChildProps };
        });
      }

      return { ...job, children: jobChildren, ...additionalProps };
    });
  }
);

selectors.allJobs = (state, { type }) => {
  if (!state) {
    return undefined;
  }

  return state[type === JOB_TYPES.BULK_RETRY ? 'bulkRetryJobs' : 'flowJobs'];
};

selectors.inProgressJobIds = createSelector(
  state => state && state.paging,
  state => state && state.flowJobs,
  state => state && state.bulkRetryJobs,
  (paging, origFlowJobs, bulkRetryJobs) => {
    const jobIds = { flowJobs: [], bulkRetryJobs: [] };

    if (!paging && !origFlowJobs && !bulkRetryJobs) {
      return jobIds;
    }

    const flowJobs = origFlowJobs.slice(
      paging.currentPage * paging.rowsPerPage,
      (paging.currentPage + 1) * paging.rowsPerPage
    );
    const runningBulkRetryJobs = {};

    // eslint-disable-next-line max-len
    /** Build a map of running bulk retry jobs with _integrationId & _flowId as the key and _id as value */
    bulkRetryJobs.forEach(job => {
      if (
        job._id &&
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(job.status)
      ) {
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

    flowJobs.forEach(job => {
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
    if (
      Object.keys(runningBulkRetryJobs).length > 0 &&
      !hasJobsInRetryingState
    ) {
      flowJobs.forEach(job => {
        if (
          [
            JOB_STATUS.COMPLETED,
            JOB_STATUS.FAILED,
            JOB_STATUS.CANCELED,
          ].includes(job.status)
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
);

selectors.job = (state, { type, jobId, parentJobId }) => {
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
};

selectors.isBulkRetryInProgress = createSelector(
  state => state && state.bulkRetryJobs,
  bulkRetryJobs => {
    if (!bulkRetryJobs) {
      return false;
    }

    return (
      bulkRetryJobs.filter(job =>
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(job.status)
      ).length > 0
    );
  }
);

selectors.jobErrors = (state, jobId) => {
  if (!state || !state.errors) {
    return [];
  }

  const { errors, retryObjects } = state;

  return errors
    .filter(e => e._jobId === jobId)
    .map(e => {
      const retryObject = (e._retryId && retryObjects[e._retryId]) || {};

      return {
        ...e,
        retryObject: {
          ...retryObject,
          isDataEditable: [
            RETRY_OBJECT_TYPES.OBJECT,
            RETRY_OBJECT_TYPES.PAGE,
          ].includes(retryObject.type),
          isRetriable: [
            RETRY_OBJECT_TYPES.FILE,
            RETRY_OBJECT_TYPES.OBJECT,
            RETRY_OBJECT_TYPES.PAGE,
            RETRY_OBJECT_TYPES.FILE_BATCH_IMPORT,
          ].includes(retryObject.type),
          isDownloadable: retryObject.type === RETRY_OBJECT_TYPES.FILE,
        },
      };
    });
};

selectors.jobErrorRetryObject = (state, retryId) => {
  if (!state || !state.retryObjects || !state.retryObjects[retryId]) {
    return undefined;
  }

  return state.retryObjects[retryId];
};

selectors.isFlowJobsCollectionLoading = state => state?.status === 'loading';

selectors.isPurgeFilesSuccess = state => state?.purgeFilesStatus === 'success';

// #endregion
