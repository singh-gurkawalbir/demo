import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { isEqual } from 'lodash';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import actions from '../../actions';
import Filters from './Filters';
import JobTable from './JobTable';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';

export default function JobDashboard({
  integrationId,
  flowId,
  rowsPerPage = 10,
}) {
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
  const [filters, setFilters] = useState({});
  const [selectedJobs, setSelectedJobs] = useState({});
  const [numJobsSelected, setNumJobsSelected] = useState(0);
  const [disableButtons, setDisableButtons] = useState(true);
  const [actionsToMonitor, setActionsToMonitor] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const jobs = useSelector(state => selectors.flowJobs(state));

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
      setCurrentPage(0);
    },
    [dispatch, filters]
  );

  /** Whenever page changes, we need to update the same in state and request for inprogress jobs (in current page) status */
  useEffect(() => {
    dispatch(actions.job.paging.setCurrentPage(currentPage));
    dispatch(actions.job.requestInProgressJobStatus());
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(actions.job.paging.setRowsPerPage(rowsPerPage));
  }, [dispatch, rowsPerPage]);

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(
        actions.job.requestCollection({ integrationId, flowId, filters })
      );
    }
  }, [dispatch, integrationId, flowId, filters, jobs.length]);

  useEffect(() => {
    setDisableButtons(isBulkRetryInProgress || jobs.length === 0);
  }, [isBulkRetryInProgress, jobs.length]);

  useEffect(() => {
    let jobsSelected = 0;

    Object.keys(selectedJobs).forEach(jobId => {
      if (selectedJobs[jobId].selected) {
        jobsSelected += 1;
      }

      if (selectedJobs[jobId].selectedChildJobIds) {
        jobsSelected += selectedJobs[jobId].selectedChildJobIds.length;
      }
    });

    if (jobsSelected !== numJobsSelected) {
      setNumJobsSelected(jobsSelected);
    }
  }, [selectedJobs, numJobsSelected]);

  function closeAllOpenSnackbars() {
    closeSnackbar();
  }

  function handleChangePage(newPage) {
    setCurrentPage(newPage);
  }

  function handleFiltersChange(newFilters) {
    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
      setCurrentPage(0);
    }
  }

  function handleSelectChange(selJobs) {
    setSelectedJobs(selJobs);
  }

  function resolveAllJobs() {
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
    closeAllOpenSnackbars();
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
  }

  function resolveSelectedJobs() {
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
    closeAllOpenSnackbars();
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
  }

  function retryAllJobs() {
    const selectedFlowId = flowId || filters.flowId;
    const numberOfJobsToRetry = jobs
      .filter(job => {
        if (!selectedFlowId) {
          return true;
        }

        return job._flowId === selectedFlowId;
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
    closeAllOpenSnackbars();
    dispatch(actions.job.retryAll({ flowId: selectedFlowId, integrationId }));
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
  }

  function retrySelectedJobs() {
    const jobsToRetry = [];

    Object.keys(selectedJobs).forEach(jobId => {
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
    });

    if (jobsToRetry.length === 0) {
      return false;
    }

    setSelectedJobs({});
    closeAllOpenSnackbars();
    dispatch(actions.job.retrySelected({ jobs: jobsToRetry }));
    enqueueSnackbar({
      message: `${numJobsSelected} jobs retried.`,
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
  }

  function handleActionClick(action) {
    if (action === 'resolveAll') {
      resolveAllJobs();
    } else if (action === 'resolveSelected') {
      resolveSelectedJobs();
    } else if (action === 'retryAll') {
      retryAllJobs();
    } else if (action === 'retrySelected') {
      retrySelectedJobs();
    }
  }

  function commStatusHandler(objStatus) {
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
  }

  return (
    <LoadResources required resources="flows,exports,imports">
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={commStatusHandler}
      />
      {!flowId && integration && <Typography>{integration.name}</Typography>}
      <Filters
        integrationId={integrationId}
        flowId={flowId}
        onFiltersChange={handleFiltersChange}
        numJobsSelected={numJobsSelected}
        onActionClick={handleActionClick}
        disableButtons={disableButtons}
      />
      <JobTable
        onSelectChange={handleSelectChange}
        jobsInCurrentPage={jobs}
        selectedJobs={selectedJobs}
        userPermissionsOnIntegration={userPermissionsOnIntegration}
        integrationName={integration && integration.name}
        onChangePage={handleChangePage}
      />
    </LoadResources>
  );
}
