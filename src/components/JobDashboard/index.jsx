import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  createAPITokenButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
  tablePaginationRoot: { float: 'left' },
});

function JobDashboard({ integrationId, flowId, rowsPerPage = 10 }) {
  const dispatch = useDispatch();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const userPermissionsOnIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const jobs = useSelector(state =>
    selectors.flowJobList(state, integrationId, flowId)
  );
  const isBulkRetryInProgress = useSelector(state =>
    selectors.isBulkRetryInProgress(state)
  );
  const [filters, setFilters] = useState({});
  const [selectedJobs, setSelectedJobs] = useState({});
  const [numJobsSelected, setNumJobsSelected] = useState(0);
  const [disableButtons, setDisableButtons] = useState(true);
  const [actionsToMonitor, setActionsToMonitor] = useState({});

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch, filters]
  );

  useEffect(() => {
    if (!jobs.length) {
      dispatch(
        actions.job.requestCollection({ integrationId, flowId, filters })
      );
    }
  }, [dispatch, filters, flowId, integrationId, jobs.length]);

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

  function handleFiltersChange(newFilters) {
    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
    }
  }

  function handleSelectChange(selJobs) {
    setSelectedJobs(selJobs);
  }

  function handleActionClick(action) {
    if (action === 'resolveAll') {
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
      dispatch(
        actions.job.resolveAll({ flowId: selectedFlowId, integrationId })
      );
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
    } else if (action === 'resolveSelected') {
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
                  jobId: job._id,
                  parentJobId: job._flowJobId,
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
    } else if (action === 'retryAll') {
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
      closeSnackbar();
      dispatch(actions.job.retryAll({ flowId: selectedFlowId, integrationId }));
      enqueueSnackbar({
        message: `${numberOfJobsToRetry} jobs retried.`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          if (reason === 'undo') {
            return dispatch(
              actions.job.retryAllUndo({
                flowId: selectedFlowId,
                integrationId,
              })
            );
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
    } else if (action === 'retrySelected') {
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
      closeSnackbar();
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
                  jobId: job._id,
                  parentJobId: job._flowJobId,
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
  }

  return (
    <LoadResources required resources="flows,exports,imports">
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={objStatus => {
          const messages = {
            retryAll: {
              [COMM_STATES.ERROR]: `${objStatus.retryAll &&
                objStatus.retryAll.message}`,
            },
          };

          ['retryAll'].forEach(a => {
            if (
              objStatus[a] &&
              [COMM_STATES.ERROR].includes(objStatus[a].status)
            ) {
              if (!messages[a] || !messages[a][objStatus[a].status]) {
                return;
              }

              enqueueSnackbar({
                message: messages[a][objStatus[a].status],
                variant: objStatus[a].status,
              });
            }
          });
        }}
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
        integrationId={integrationId}
        flowId={flowId}
        filters={filters}
        rowsPerPage={rowsPerPage}
        onSelectChange={handleSelectChange}
        jobs={jobs}
        selectedJobs={selectedJobs}
        userPermissionsOnIntegration={userPermissionsOnIntegration}
        integrationName={integration && integration.name}
      />
    </LoadResources>
  );
}

export default withStyles(styles)(JobDashboard);
