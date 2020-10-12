import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import LoadResources from '../LoadResources';
import { selectors } from '../../reducers';
import actions from '../../actions';
import Filters from './Filters';
import JobTable from './JobTable';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import CommStatus from '../CommStatus';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import { hashCode } from '../../utils/string';
import { isNewId } from '../../utils/resource';

const useStyles = makeStyles(({
  jobTable: {
    height: '100%',
    overflow: 'auto',
    paddingBottom: 115,
  },
}));

export default function JobDashboard({
  integrationId,
  flowId,
  rowsPerPage = 10,
  isFlowBuilderView,
}) {
  const filterKey = 'jobs';
  const classes = useStyles();

  const dispatch = useDispatch();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const userPermissionsOnIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const isBulkRetryInProgress = useSelector(state =>
    selectors.isBulkRetryInProgress(state)
  );
  const filters = useSelector(state => selectors.filter(state, filterKey));

  console.log('filters', filters);
  const jobs = useSelector(state => selectors.flowJobs(state));
  const numJobsWithErrors = jobs ? jobs.filter(j => j.numError > 0).length : 0;
  const numRetriableJobs = jobs ? jobs.filter(j => j.numError > 0 && !j.flowDisabled).length : 0;
  const [selectedJobs, setSelectedJobs] = useState({});
  const [numJobsSelected, setNumJobsSelected] = useState(0);
  const [numRetriableJobsSelected, setNumRetriableJobsSelected] = useState(0);
  const [disableResolve, setDisableResolve] = useState(true);
  const [disableRetry, setDisableRetry] = useState(true);
  const [actionsToMonitor, setActionsToMonitor] = useState({});
  const patchFilter = useCallback(
    (key, value) => {
      dispatch(actions.patchFilter(filterKey, { [key]: value }));
    },
    [dispatch]
  );

  const clearFilter = useCallback(() => {
    dispatch(actions.clearFilter(filterKey));
  }, [dispatch]);
  const { currentPage = 0, ...nonPagingFilters } = filters;
  const filterHash = hashCode(nonPagingFilters);

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch, filterHash, patchFilter]
  );

  useEffect(
    () => () => {
      clearFilter();
    },
    [clearFilter]
  );

  /** Whenever page changes, we need to update the same in state and
   * request for in-progress jobs (in current page) status */
  useEffect(() => {
    dispatch(actions.job.paging.setCurrentPage(currentPage));
    dispatch(actions.job.requestInProgressJobStatus());
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(actions.job.paging.setRowsPerPage(rowsPerPage));
  }, [dispatch, rowsPerPage]);

  useEffect(() => {
    if (!isNewId(flowId) && jobs.length === 0) {
      dispatch(
        actions.job.requestCollection({
          integrationId,
          flowId,
          filters,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, integrationId, flowId, filterHash, jobs.length]);

  useEffect(() => {
    setDisableResolve(isBulkRetryInProgress || numJobsWithErrors === 0);
  }, [isBulkRetryInProgress, numJobsWithErrors]);

  useEffect(() => {
    setDisableRetry(isBulkRetryInProgress || numRetriableJobs === 0);
  }, [isBulkRetryInProgress, numRetriableJobs]);

  useEffect(() => {
    let jobsSelected = 0;
    let retriableJobsSelected = 0;

    console.log('selectedJobs', selectedJobs);

    Object.keys(selectedJobs).forEach(jobId => {
      if (
        selectedJobs[jobId].selectedChildJobIds &&
        selectedJobs[jobId].selectedChildJobIds.length > 0
      ) {
        jobsSelected += selectedJobs[jobId].selectedChildJobIds.length;
        if (!selectedJobs[jobId].flowDisabled) {
          retriableJobsSelected += selectedJobs[jobId].selectedChildJobIds.length;
        }
      } else if (selectedJobs[jobId].selected) {
        jobsSelected += 1;
        if (!selectedJobs[jobId].flowDisabled) {
          retriableJobsSelected += 1;
        }
      }
    });

    if (jobsSelected !== numJobsSelected) {
      setNumJobsSelected(jobsSelected);
    }
    if (retriableJobsSelected !== numRetriableJobsSelected) {
      setNumRetriableJobsSelected(retriableJobsSelected);
    }
  }, [selectedJobs, numJobsSelected, numRetriableJobsSelected]);

  function handleSelectChange(selJobs) {
    setSelectedJobs(selJobs);
  }

  const resolveAllJobs = useCallback(() => {
    const selectedFlowId = flowId || filters.flowId;
    const numberOfJobsToResolve = jobs
      .filter(job => {
        if (!selectedFlowId) {
          return true;
        }

        return job._flowId === selectedFlowId;
      })
      .reduce((total, job) => {
        if (job.numError) {
          // eslint-disable-next-line no-param-reassign
          total += 1;
        }

        if (job.children && job.children.length > 0) {
          job.children.forEach(cJob => {
            if (cJob.numError) {
              // eslint-disable-next-line no-param-reassign
              total += 1;
            }
          });
        }

        return total;
      }, 0);

    setSelectedJobs({});
    closeSnackbar();
    dispatch(actions.job.resolveAll({ flowId: selectedFlowId, integrationId }));
    enqueueSnackbar({
      message: `${numberOfJobsToResolve} jobs marked as resolved.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RESOLVE,
      handleClose(event, reason) {
        if (reason === 'undo') {
          return dispatch(
            actions.job.resolveAllUndo({
              flowId: selectedFlowId,
              integrationId,
            })
          );
        }

        dispatch(
          actions.job.resolveAllCommit({
            flowId: selectedFlowId,
            integrationId,
          })
        );
        setActionsToMonitor({
          resolveAll: {
            action: flowId
              ? actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT
              : actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
            resourceId: flowId || integrationId,
          },
        });
      },
    });
  }, [
    closeSnackbar,
    dispatch,
    enqueueSnackbar,
    filters.flowId,
    flowId,
    integrationId,
    jobs,
  ]);
  const resolveSelectedJobs = useCallback(() => {
    const jobsToResolve = [];

    Object.keys(selectedJobs).forEach(jobId => {
      if (
        selectedJobs[jobId].selectedChildJobIds &&
        selectedJobs[jobId].selectedChildJobIds.length > 0
      ) {
        selectedJobs[jobId].selectedChildJobIds.forEach(cJobId => {
          jobsToResolve.push({ _flowJobId: jobId, _id: cJobId });
        });
      } else if (selectedJobs[jobId].selected) {
        jobsToResolve.push({ _id: jobId });
      }
    });

    if (jobsToResolve.length === 0) {
      return false;
    }

    setSelectedJobs({});
    closeSnackbar();
    dispatch(actions.job.resolveSelected({ jobs: jobsToResolve }));
    enqueueSnackbar({
      message: `${numJobsSelected} jobs marked as resolved.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RESOLVE,
      handleClose(event, reason) {
        if (reason === 'undo') {
          jobsToResolve.forEach(job =>
            dispatch(
              actions.job.resolveUndo({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          );

          return false;
        }

        dispatch(
          actions.job.resolveCommit({
            jobs: jobsToResolve,
          })
        );
      },
    });
  }, [closeSnackbar, dispatch, enqueueSnackbar, numJobsSelected, selectedJobs]);
  const retryAllJobs = useCallback(() => {
    const selectedFlowId = flowId || filters.flowId;
    const numberOfJobsToRetry = jobs
      .filter(job => {
        if (!selectedFlowId) {
          return !job.flowDisabled;
        }

        return job._flowId === selectedFlowId && !job.flowDisabled;
      })
      .reduce((total, job) => {
        if (job.numError > 0) {
          // eslint-disable-next-line no-param-reassign
          total += 1;
        }

        if (job.children && job.children.length > 0) {
          job.children.forEach(cJob => {
            if (cJob.retriable) {
              // eslint-disable-next-line no-param-reassign
              total += 1;
            }
          });
        }

        return total;
      }, 0);

    setSelectedJobs({});
    closeSnackbar();
    dispatch(actions.job.retryAll({ flowId: selectedFlowId, storeId: filters.storeId, integrationId }));
    enqueueSnackbar({
      message: `${numberOfJobsToRetry} jobs retried.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RETRY,
      handleClose(event, reason) {
        if (reason === 'undo') {
          return dispatch(actions.job.retryAllUndo());
        }

        dispatch(
          actions.job.retryAllCommit({
            flowId: selectedFlowId,
            integrationId,
          })
        );
        setActionsToMonitor({
          retryAll: {
            action: flowId
              ? actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT
              : actionTypes.JOB.RETRY_ALL_IN_INTEGRATION_COMMIT,
            resourceId: flowId || integrationId,
          },
        });
      },
    });
  }, [
    closeSnackbar,
    dispatch,
    enqueueSnackbar,
    filters.flowId,
    flowId,
    integrationId,
    jobs,
  ]);
  const retrySelectedJobs = useCallback(() => {
    const jobsToRetry = [];

    Object.keys(selectedJobs).forEach(jobId => {
      if (!selectedJobs[jobId].flowDisabled) {
        if (
          selectedJobs[jobId].selectedChildJobIds &&
        selectedJobs[jobId].selectedChildJobIds.length > 0
        ) {
          selectedJobs[jobId].selectedChildJobIds.forEach(cJobId => {
            jobsToRetry.push({ _flowJobId: jobId, _id: cJobId });
          });
        } else if (selectedJobs[jobId].selected) {
          jobsToRetry.push({ _id: jobId });
        }
      }
    });

    if (jobsToRetry.length === 0) {
      return false;
    }

    setSelectedJobs({});
    closeSnackbar();
    dispatch(actions.job.retrySelected({ jobs: jobsToRetry }));
    enqueueSnackbar({
      message: `${numRetriableJobsSelected} jobs retried.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RETRY,
      handleClose(event, reason) {
        if (reason === 'undo') {
          jobsToRetry.forEach(job =>
            dispatch(
              actions.job.retryUndo({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          );

          return false;
        }

        dispatch(
          actions.job.retryCommit({
            jobs: jobsToRetry,
          })
        );
      },
    });
  }, [closeSnackbar, dispatch, enqueueSnackbar, numRetriableJobsSelected, selectedJobs]);
  const handleActionClick = useCallback(
    action => {
      if (action === 'resolveAll') {
        resolveAllJobs();
      } else if (action === 'resolveSelected') {
        resolveSelectedJobs();
      } else if (action === 'retryAll') {
        retryAllJobs();
      } else if (action === 'retrySelected') {
        retrySelectedJobs();
      }
    },
    [resolveAllJobs, resolveSelectedJobs, retryAllJobs, retrySelectedJobs]
  );
  const handleCommsStatus = useCallback(
    objStatus => {
      ['resolveAll', 'resolveSelected', 'retryAll', 'retrySelected'].forEach(
        action => {
          if (
            objStatus[action] &&
            [COMM_STATES.ERROR].includes(objStatus[action].status) &&
            objStatus[action].message
          ) {
            enqueueSnackbar({
              message: objStatus[action].message,
              variant: objStatus[action].status,
            });
          }
        }
      );
    },
    [enqueueSnackbar]
  );

  return (
    <LoadResources required resources="integrations,flows,exports,imports">
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={handleCommsStatus}
      />
      <Filters
        filterKey={filterKey}
        integrationId={integrationId}
        flowId={flowId}
        numJobsSelected={numJobsSelected}
        numRetriableJobsSelected={numRetriableJobsSelected}
        onActionClick={handleActionClick}
        disableResolve={disableResolve}
        disableRetry={disableRetry}
      />
      <JobTable
        classes={classes.jobTable}
        onSelectChange={handleSelectChange}
        jobsInCurrentPage={jobs}
        selectedJobs={selectedJobs}
        userPermissionsOnIntegration={userPermissionsOnIntegration}
        integrationName={integration && integration.name}
        isFlowBuilderView={isFlowBuilderView}
      />
    </LoadResources>
  );
}
