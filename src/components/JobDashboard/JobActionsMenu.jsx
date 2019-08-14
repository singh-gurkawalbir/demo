import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { confirmDialog } from '../ConfirmDialog';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';

export default function AccessTokenActionsMenu({
  job,
  onActionClick,
  userPermissionsOnIntegration = {},
}) {
  const dispatch = useDispatch();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionsToMonitor, setActionsToMonitor] = useState({});
  const isJobInProgress = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
    job.uiStatus
  );
  const isJobCompleted = [
    JOB_STATUS.COMPLETED,
    JOB_STATUS.CANCELED,
    JOB_STATUS.FAILED,
  ].includes(job.uiStatus);
  const isFlowJob = job.type === JOB_TYPES.FLOW;
  const menuOptions = [];

  if (isJobInProgress || job.status === JOB_STATUS.RETRYING) {
    menuOptions.push({ label: 'Cancel', action: 'cancelJob' });
  }

  if (isJobCompleted) {
    if (job.retries && job.retries.length > 0) {
      menuOptions.push({
        label: 'View retries',
        action: 'viewRetries',
      });
    }

    if (job.numError > 0) {
      menuOptions.push({
        label: isFlowJob ? 'Retry All' : 'Retry',
        action: 'retryJob',
      });
      menuOptions.push({ label: 'Mark resolved', action: 'resolveJob' });
    }
  }

  if (isFlowJob) {
    if (!isJobInProgress) {
      if (job.type === JOB_TYPES.FLOW && job.status !== JOB_STATUS.RETRYING) {
        menuOptions.push({ label: 'Run flow', action: 'runFlow' });
      }

      if (job.files && job.files.length > 0) {
        menuOptions.push({ label: 'Download Files', action: 'downloadFiles' });
      }

      menuOptions.push({
        label: 'Download Diagnostics',
        action: 'downloadDiagnostics',
      });
    }

    if (
      userPermissionsOnIntegration.flows &&
      userPermissionsOnIntegration.flows.edit
    ) {
      menuOptions.push({ label: 'Edit flow', action: 'editFlow' });
    } else {
      menuOptions.push({ label: 'View flow', action: 'viewFlow' });
    }
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleActionClick(action) {
    handleMenuClose();

    if (action === 'downloadDiagnostics') {
      dispatch(actions.job.downloadDiagnosticsFile({ jobId: job._id }));
    } else if (action === 'runFlow') {
      dispatch(actions.flow.run({ flowId: job._flowId }));
      setActionsToMonitor({
        ...actionsToMonitor,
        [action]: {
          action: actionTypes.FLOW.RUN,
          resourceId: job._flowId,
        },
      });
      dispatch(actions.job.setJobsCurrentPage(0));
    } else if (action === 'cancelJob') {
      confirmDialog({
        title: 'Confirm',
        message:
          'Are you sure you want to cancel this job? Please note that canceling this job will delete all associated data currently queued for processing.',
        buttons: [
          {
            label: 'No',
          },
          {
            label: 'Yes',
            onClick: () => {
              if (job.status === JOB_STATUS.RETRYING) {
                if (isFlowJob) {
                  if (job.children && job.children.length > 0) {
                    job.children.forEach(cJob => {
                      if (cJob.status === JOB_STATUS.RETRYING && cJob.retries) {
                        cJob.retries.forEach(rJob => {
                          if (
                            [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
                              rJob.status
                            )
                          ) {
                            dispatch(
                              actions.job.cancel({
                                jobId: rJob._id,
                                flowJobId: job._id,
                              })
                            );
                          }
                        });
                      }
                    });

                    return false;
                  }
                } else {
                  const retryJob = job.retries.find(r =>
                    [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(r.status)
                  );

                  if (retryJob) {
                    return dispatch(
                      actions.job.cancel({
                        jobId: retryJob._id,
                        flowJobId: job._flowJobId,
                      })
                    );
                  }
                }
              }

              dispatch(actions.job.cancel({ jobId: job._id }));
            },
          },
        ],
      });
    } else if (action === 'resolveJob') {
      closeSnackbar();
      dispatch(
        actions.job.resolveSelected({
          jobs: [{ _id: job._id, _flowJobId: job._flowJobId }],
        })
      );
      enqueueSnackbar({
        message: `${job.numError} errors marked as resolved.`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RESOLVE,
        handleClose(event, reason) {
          if (reason === 'undo') {
            return dispatch(
              actions.job.resolveUndo({
                childJobId: job._flowJobId ? job._id : null,
                parentJobId: job._flowJobId || job._id,
              })
            );
          }

          dispatch(
            actions.job.resolveCommit({
              jobs: [{ _id: job._id, _flowJobId: job._flowJobId }],
            })
          );
        },
      });
    } else if (action === 'retryJob') {
      closeSnackbar();

      if (isFlowJob) {
        dispatch(
          actions.job.retryFlowJob({
            jobId: job._id,
          })
        );
      } else {
        dispatch(
          actions.job.retrySelected({
            jobs: [{ _id: job._id, _flowJobId: job._flowJobId }],
          })
        );
      }

      enqueueSnackbar({
        message: `${job.numError} errors retried.`,
        action,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          window.JOB = job;

          if (reason === 'undo') {
            return dispatch(
              actions.job.retryUndo({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            );
          }

          if (isFlowJob) {
            dispatch(
              actions.job.retryFlowJobCommit({
                jobId: job._id,
              })
            );
          } else {
            dispatch(
              actions.job.retryCommit({
                jobs: [{ _id: job._id, _flowJobId: job._flowJobId }],
              })
            );
          }
        },
      });
    } else {
      onActionClick(action);
    }
  }

  return (
    <Fragment>
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={objStatus => {
          const messages = {
            runFlow: {
              [COMM_STATES.SUCCESS]: `${job.name} flow has been queued successfully`,
              [COMM_STATES.ERROR]: `${objStatus.runFlow &&
                objStatus.runFlow.message}`,
            },
          };

          ['runFlow'].forEach(a => {
            if (
              objStatus[a] &&
              [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(
                objStatus[a].status
              )
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        {menuOptions.map(opt => (
          <MenuItem
            key={opt.action}
            onClick={() => {
              handleActionClick(opt.action);
            }}>
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
      <IconButton onClick={handleMenuClick} disabled={menuOptions.length === 0}>
        <MoreVertIcon />
      </IconButton>
    </Fragment>
  );
}
