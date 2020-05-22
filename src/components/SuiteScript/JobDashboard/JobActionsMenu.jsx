import { Fragment, useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPES } from '../../../utils/constants';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import useConfirmDialog from '../../ConfirmDialog';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import CommStatus from '../../CommStatus';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import EllipsisHorizontallIcon from '../../icons/EllipsisHorizontalIcon';
import getRoutePath from '../../../utils/routePaths';
import * as selectors from '../../../reducers';

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
  const menuOptions = [];
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, job._flowId),
    shallowEqual
  );

  if (isJobCompleted) {
    if (job.numError > 0) {
      menuOptions.push({ label: 'Mark resolved', action: 'resolveJob' });
    }
  }

  if (!isJobInProgress) {
    if (flowDetails && flowDetails.isRunnable) {
      menuOptions.push({ label: 'Run flow', action: 'runFlow' });
    }

    if (job.log && (job.status === JOB_STATUS.FAILED || job.numError > 0)) {
      menuOptions.push({
        label: 'Download SuiteScript logs',
        action: 'downloadSuiteScriptLogs',
      });
    }
  }

  if (!isFlowBuilderView) {
    menuOptions.push({ label: 'Edit flow', action: 'editFlow' });
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

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleRunStart = () => {
    setActionsToMonitor({
      ...actionsToMonitor,
      runFlow: {
        action: actionTypes.FLOW.RUN,
        resourceId: job._flowId,
      },
    });
    dispatch(actions.job.paging.setCurrentPage(0));
  };

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

  return (
    <Fragment>
      <CommStatus
        actionsToMonitor={actionsToMonitor}
        autoClearOnComplete
        commStatusHandler={handleCommsStatus}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        {menuOptions.map(opt => {
          if (opt.action === 'runFlow') {
            return (
              <MenuItem key="runFlow">
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
              {opt.label}
            </MenuItem>
          );
        })}
      </Menu>
      <IconButton
        data-test="moreJobActionsMenu"
        className={classes.iconBtn}
        onClick={handleMenuClick}
        disabled={menuOptions.length === 0}>
        <EllipsisHorizontallIcon />
      </IconButton>
    </Fragment>
  );
}
