import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadResources from '../LoadResources';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Filters from './Filters';
import JobTable from './JobTable';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import CommStatus from '../../CommStatus';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import { hashCode } from '../../../utils/string';

export default function JobDashboard({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  rowsPerPage = 10,
  isFlowBuilderView,
}) {
  const filterKey = 'suitescriptjobs';
  const dispatch = useDispatch();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const userPermissionsOnIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      ssLinkedConnectionId,
      id: integrationId,
    })
  );
  const filters = useSelector(state => selectors.filter(state, filterKey));
  const jobs = useSelector(
    state =>
      selectors.suiteScriptResourceList(state, {
        resourceType: 'jobs',
        ssLinkedConnectionId,
        integrationId,
      }),
    (left, right) =>
      left.length === right.length && left[0]._id === right[0]._id
  );

  console.log(`jobs.length`, jobs.length);
  const numJobsWithErrors = jobs ? jobs.filter(j => j.numError > 0).length : 0;
  const [selectedJobs, setSelectedJobs] = useState({});
  const [numJobsSelected, setNumJobsSelected] = useState(0);
  const [disableActions, setDisableActions] = useState(true);
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
      dispatch(actions.suiteScript.job.clear());
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
    dispatch(actions.suiteScript.paging.job.setCurrentPage(currentPage));
    dispatch(
      actions.suiteScript.job.requestInProgressJobStatus({
        ssLinkedConnectionId,
        integrationId,
      })
    );
  }, [dispatch, currentPage, ssLinkedConnectionId, integrationId]);

  useEffect(() => {
    dispatch(actions.suiteScript.paging.job.setRowsPerPage(rowsPerPage));
  }, [dispatch, rowsPerPage]);

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(
        actions.suiteScript.job.requestCollection({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          filters,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    filterHash,
    jobs.length,
  ]);

  useEffect(() => {
    setDisableActions(numJobsWithErrors === 0);
  }, [numJobsWithErrors]);

  useEffect(() => {
    let jobsSelected = 0;

    Object.keys(selectedJobs).forEach(jobId => {
      if (selectedJobs[jobId].selected) {
        jobsSelected += 1;
      }
    });

    if (jobsSelected !== numJobsSelected) {
      setNumJobsSelected(jobsSelected);
    }
  }, [selectedJobs, numJobsSelected]);

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

        return total;
      }, 0);

    setSelectedJobs({});
    closeSnackbar();
    dispatch(
      actions.suiteScript.job.resolveAll({
        flowId: selectedFlowId,
        integrationId,
        ssLinkedConnectionId,
      })
    );
    enqueueSnackbar({
      message: `${numberOfJobsToResolve} jobs marked as resolved.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RESOLVE,
      handleClose(event, reason) {
        if (reason === 'undo') {
          return dispatch(
            actions.suiteScript.job.resolveAllUndo({
              flowId: selectedFlowId,
              integrationId,
              ssLinkedConnectionId,
            })
          );
        }

        dispatch(
          actions.suiteScript.job.resolveAllCommit({
            flowId: selectedFlowId,
            integrationId,
            ssLinkedConnectionId,
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
    ssLinkedConnectionId,
  ]);
  const resolveSelectedJobs = useCallback(() => {
    const jobsToResolve = [];

    Object.keys(selectedJobs).forEach(jobId => {
      if (selectedJobs[jobId].selected) {
        const [type, _id] = jobId.split('-');

        jobsToResolve.push({
          jobId: _id,
          jobType: type,
          log: selectedJobs[jobId].log,
        });
      }
    });

    if (jobsToResolve.length === 0) {
      return false;
    }

    setSelectedJobs({});
    closeSnackbar();
    dispatch(
      actions.suiteScript.job.resolveSelected({
        integrationId,
        ssLinkedConnectionId,
        jobs: jobsToResolve,
      })
    );
    enqueueSnackbar({
      message: `${numJobsSelected} jobs marked as resolved.`,
      showUndo: true,
      autoHideDuration: UNDO_TIME.RESOLVE,
      handleClose(event, reason) {
        if (reason === 'undo') {
          jobsToResolve.forEach(job =>
            dispatch(actions.suiteScript.job.resolveUndo(job))
          );

          return false;
        }

        dispatch(
          actions.suiteScript.job.resolveCommit({
            jobs: jobsToResolve,
          })
        );
      },
    });
  }, [
    closeSnackbar,
    dispatch,
    enqueueSnackbar,
    integrationId,
    numJobsSelected,
    selectedJobs,
    ssLinkedConnectionId,
  ]);
  const handleActionClick = useCallback(
    action => {
      if (action === 'resolveAll') {
        resolveAllJobs();
      } else if (action === 'resolveSelected') {
        resolveSelectedJobs();
      }
    },
    [resolveAllJobs, resolveSelectedJobs]
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
    <LoadResources
      required
      ssLinkedConnectionId={ssLinkedConnectionId}
      integrationId={integrationId}
      resources="flows">
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={handleCommsStatus}
      />
      <Filters
        filterKey={filterKey}
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flowId}
        numJobsSelected={numJobsSelected}
        onActionClick={handleActionClick}
        disableActions={disableActions}
      />
      <JobTable
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
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
