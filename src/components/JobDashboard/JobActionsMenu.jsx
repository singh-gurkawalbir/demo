import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPES } from '../../constants';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import useConfirmDialog from '../ConfirmDialog';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from '../../utils/jobdashboard';
import JobRetriesDialog from './JobRetriesDialog';
import JobFilesDownloadDialog from './JobFilesDownloadDialog';
import EllipsisHorizontallIcon from '../icons/EllipsisHorizontalIcon';
import getRoutePath from '../../utils/routePaths';
import RunFlowButton from '../RunFlowButton';
import { selectors } from '../../reducers';
import EditIcon from '../icons/EditIcon';
import RunIcon from '../icons/RunIcon';
import RefreshIcon from '../icons/RefreshIcon';
import DownloadIntegrationIcon from '../icons/DownloadIntegrationIcon';
import CheckmarkIcon from '../icons/CheckmarkIcon';
import CancelIcon from '../icons/CancelIcon';
import DownloadIcon from '../icons/DownloadIcon';
import useCommStatus from '../../hooks/useCommStatus';
import { message } from '../../utils/messageStore';

const useStyle = makeStyles({
  iconBtn: {
    padding: 0,
  },
});

export default function JobActionsMenu({
  job,
  onActionClick,
  userPermissionsOnIntegration = {},
  integrationName,
  isFlowBuilderView,
}) {
  const classes = useStyle();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionsToMonitor, setActionsToMonitor] = useState({});
  const [showRetriesDialog, setShowRetriesDialog] = useState(false);
  const [showFilesDownloadDialog, setShowFilesDownloadDialog] = useState(false);
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

  if (!isFlowBuilderView) {
    if (
      userPermissionsOnIntegration.flows &&
      userPermissionsOnIntegration.flows.edit
    ) {
      menuOptions.push({ label: 'Edit flow', action: 'editFlow', icon: <EditIcon /> });
    } else {
      menuOptions.push({ label: 'View flow', action: 'viewFlow' });
    }
  }

  if (isJobInProgress || job.status === JOB_STATUS.RETRYING) {
    menuOptions.push({ label: 'Cancel', action: 'cancelJob', icon: <CancelIcon /> });
  }
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, job._flowId),
    shallowEqual
  );

  if (isFlowJob) {
    if (!isJobInProgress) {
      if (
        job.type === JOB_TYPES.FLOW &&
        job.status !== JOB_STATUS.RETRYING &&
        flowDetails &&
        flowDetails.isRunnable
      ) {
        menuOptions.push({
          label: 'Run flow',
          action: 'runFlow',
          icon: <RunIcon />,
        });
      }
    }
  }

  if (isJobCompleted) {
    if (job.retries && job.retries.length > 0) {
      menuOptions.push({
        label: 'View retries',
        action: 'viewRetries',
      });
    }

    if (job.numError > 0) {
      if (!job.flowDisabled && (job.type === JOB_TYPES.FLOW || job.retriable)) {
        menuOptions.push({
          label: isFlowJob ? 'Retry all' : 'Retry',
          action: 'retryJob',
          icon: <RefreshIcon />,
        });
      }
      menuOptions.push({
        label: 'Mark resolved',
        action: 'resolveJob',
        icon: <CheckmarkIcon />,
      });
    }
  }

  if (isFlowJob) {
    if (!isJobInProgress) {
      if (job.files && job.files.length > 0) {
        menuOptions.push({
          label: `${job.files.length > 1 ? 'Download files' : 'Download file'}`,
          action: 'downloadFiles',
          icon: <DownloadIcon />,
        });
      }

      menuOptions.push({
        label: 'Download diagnostics',
        action: 'downloadDiagnostics',
        icon: <DownloadIntegrationIcon />,
      });
    }
  }

  const handleCommsStatus = useCallback(
    objStatus => {
      const messages = {
        runFlow: {
          [COMM_STATES.ERROR]: `${objStatus.runFlow &&
            objStatus.runFlow.message}`,
        },
      };

      ['runFlow'].forEach(a => {
        if (
          objStatus[a] &&
          [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
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
    },
    [enqueueSnackbar]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleRunStart = useCallback(() => {
    handleMenuClose();
    setActionsToMonitor({
      ...actionsToMonitor,
      runFlow: {
        action: actionTypes.FLOW.RUN,
        resourceId: job._flowId,
      },
    });
    dispatch(actions.job.paging.setCurrentPage(0));
  }, [actionsToMonitor, dispatch, handleMenuClose, job._flowId]);

  function handleActionClick(action) {
    handleMenuClose();

    if (action === 'downloadDiagnostics') {
      dispatch(
        actions.job.downloadFiles({ jobId: job._id, fileType: 'diagnostics' })
      );
    } else if (action === 'downloadFiles') {
      if (job.files.length === 1) {
        dispatch(actions.job.downloadFiles({ jobId: job._id }));
      } else if (job.files.length > 1) {
        setShowFilesDownloadDialog(true);
      }
    } else if (action === 'cancelJob') {
      confirmDialog({
        title: 'Confirm cancel',
        message: message.JOBS.CANCEL_JOB,
        buttons: [
          {
            label: 'Yes, cancel',
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
                              })
                            );
                          }
                        });
                      }
                    });

                    return false;
                  }
                } else {
                  const retryJob = job.retries?.find(r =>
                    [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(r.status)
                  );

                  if (retryJob) {
                    return dispatch(
                      actions.job.cancel({
                        jobId: retryJob._id,
                      })
                    );
                  }
                }
              }

              dispatch(actions.job.cancel({ jobId: job._id }));
            },
          },
          {
            label: 'No, go back',
            variant: 'text',
          },
        ],
      });
    } else if (action === 'resolveJob') {
      closeSnackbar();
      dispatch(
        actions.job.resolveSelected({
          jobs: [{ _id: job._id, _flowJobId: job._parentJobId || job._flowJobId }],
          match,
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
                childJobId: (job._parentJobId || job._flowJobId) ? job._id : null,
                parentJobId: job._parentJobId || job._flowJobId || job._id,
              })
            );
          }

          dispatch(
            actions.job.resolveCommit({
              jobs: [{ _id: job._id, _flowJobId: job._parentJobId || job._flowJobId }],
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
            match,
          })
        );
      } else {
        dispatch(
          actions.job.retrySelected({
            jobs: [{ _id: job._id, _flowJobId: job._parentJobId || job._flowJobId }],
            match,
          })
        );
      }

      enqueueSnackbar({
        message: `${job.numError} ${
          job.numError === '1' ? 'error retried.' : 'errors retried.'
        }`,
        action,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          if (reason === 'undo') {
            return dispatch(
              actions.job.retryUndo({
                parentJobId: job._parentJobId || job._flowJobId || job._id,
                childJobId: (job._parentJobId || job._flowJobId) ? job._id : null,
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
                jobs: [{ _id: job._id, _flowJobId: job._parentJobId || job._flowJobId }],
              })
            );
          }
        },
      });
    } else if (action === 'viewRetries') {
      setShowRetriesDialog(true);
    } else if (['editFlow', 'viewFlow'].includes(action)) {
      // TODO: branch for dataloader flows. The url should use the segment /dataLoader/ if flow is DL.
      history.push(
        getRoutePath(
          `/integrations/${job._integrationId || 'none'}/flowBuilder/${
            job._flowId
          }`
        )
      );
    } else {
      onActionClick(action);
    }
  }

  function handleJobRetriesDialogCloseClick() {
    setShowRetriesDialog(false);
  }

  function handleJobFilesDownloadDialogCloseClick() {
    setShowFilesDownloadDialog(false);
  }
  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler: handleCommsStatus,
  });

  return (
    <>
      {showRetriesDialog && (
      <JobRetriesDialog
        job={job}
        onCloseClick={handleJobRetriesDialogCloseClick}
        integrationName={integrationName}
      />
      )}
      {showFilesDownloadDialog && (
      <JobFilesDownloadDialog
        job={job}
        onCloseClick={handleJobFilesDownloadDialogCloseClick}
        integrationName={integrationName}
      />
      )}

      <ArrowPopper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        {menuOptions.map(opt => {
          if (opt.action === 'runFlow') {
            return (
              <MenuItem key="runFlow">
                <RunIcon />
                <RunFlowButton
                  variant="text"
                  flowId={job._flowId}
                  onRunStart={handleRunStart}
              />
              </MenuItem>
            );
          }

          return (
            <MenuItem
              key={opt.action}
              onClick={() => {
                handleActionClick(opt.action);
              }}>
              {opt.icon}{opt.label}
            </MenuItem>
          );
        })}
      </ArrowPopper>
      <IconButton
        data-test="moreJobActionsMenu"
        className={classes.iconBtn}
        onClick={handleMenuClick}
        disabled={menuOptions.length === 0}
        size="large">
        <EllipsisHorizontallIcon />
      </IconButton>
    </>
  );
}
