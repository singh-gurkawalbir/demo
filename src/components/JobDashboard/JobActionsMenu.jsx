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

  if (isJobInProgress) {
    menuOptions.push({ label: 'Cancel', action: 'cancelJob' });

    if (isFlowJob) {
      if (
        userPermissionsOnIntegration.flows &&
        userPermissionsOnIntegration.flows.edit
      ) {
        menuOptions.push({ label: 'Edit flow', action: 'editFlow' });
      } else {
        menuOptions.push({ label: 'View flow', action: 'viewFlow' });
      }
    }
  } else if (isJobCompleted) {
    if (job.numError > 0) {
      menuOptions.push({ label: 'Mark resolved', action: 'resolveJob' });
    }

    if (isFlowJob) {
      if (job.type === JOB_TYPES.FLOW) {
        menuOptions.push({ label: 'Run flow', action: 'runFlow' });
      }

      if (job.files && job.files.length > 0) {
        menuOptions.push({ label: 'Download Files', action: 'downloadFiles' });
      }

      menuOptions.push({
        label: 'Download Diagnostics',
        action: 'downloadDiagnostics',
      });

      if (
        userPermissionsOnIntegration.flows &&
        userPermissionsOnIntegration.flows.edit
      ) {
        menuOptions.push({ label: 'Edit flow', action: 'editFlow' });
      } else {
        menuOptions.push({ label: 'View flow', action: 'viewFlow' });
      }
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
              dispatch(actions.job.cancel({ jobId: job._id }));
            },
          },
        ],
      });
    } else if (action === 'resolveJob') {
      closeSnackbar();
      dispatch(
        actions.job.resolveMultiple({
          jobs: [{ _id: job._id, _flowJobId: job._flowJobId }],
        })
      );
      enqueueSnackbar({
        message: `${job.numError} errors marked as resolved.`,
        action,
        showUndo: true,
        autoHideDuration: 4000,
        handleClose(event, reason) {
          if (reason === 'undo') {
            return dispatch(
              actions.job.resolveUndo({
                jobId: job._id,
                parentJobId: job._flowJobId,
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
