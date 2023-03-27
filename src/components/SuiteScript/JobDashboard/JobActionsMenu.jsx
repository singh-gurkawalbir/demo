import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useHistory } from 'react-router-dom';
import { JOB_STATUS } from '../../../constants';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import EllipsisHorizontallIcon from '../../icons/EllipsisHorizontalIcon';
import getRoutePath from '../../../utils/routePaths';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import useCommStatus from '../../../hooks/useCommStatus';

const useStyle = makeStyles({
  iconBtn: {
    padding: 0,
  },
});

export default function JobActionsMenu({
  job,
  isFlowBuilderView,
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyle();
  const dispatch = useDispatch();
  const history = useHistory();
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionsToMonitor, setActionsToMonitor] = useState({});
  const isJobInProgress = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
    job.status
  );
  const isJobCompleted = [
    JOB_STATUS.COMPLETED,
    JOB_STATUS.CANCELED,
    JOB_STATUS.FAILED,
  ].includes(job.status);
  const flowDetails = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: job._flowId,
      integrationId,
      ssLinkedConnectionId,
    })
  );
  const additionalHeaders = useSelector(
    state => selectors.accountShareHeader(state, ''),
    shallowEqual
  );
  const menuOptions = [];

  if (isJobCompleted) {
    if (job.numError > 0) {
      menuOptions.push({ label: 'Mark resolved', action: 'resolveJob' });
    }
  }

  if (!isJobInProgress) {
    if (flowDetails?.type && !flowDetails.type.includes('REALTIME')) {
      menuOptions.push({ label: 'Run flow', action: 'runFlow' });
    }

    if (job.exportedFileId) {
      menuOptions.push({
        label: 'Download exported file',
        action: 'downloadExportedFile',
      });
    }

    if (job.importedFileId) {
      menuOptions.push({
        label: 'Download imported file',
        action: 'downloadImportedFile',
      });
    }

    if (job.errorFileId) {
      menuOptions.push({
        label: 'Download all errors',
        action: 'downloadAllErrors',
      });
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
    dispatch(actions.suiteScript.paging.job.setCurrentPage(0));
  };

  function handleActionClick(action) {
    handleMenuClose();

    if (['downloadExportedFile', 'downloadImportedFile', 'downloadAllErrors', 'downloadSuiteScriptLogs'].includes(action)) {
      const fileTypeMap = {
        downloadExportedFile: 'export',
        downloadImportedFile: 'import',
        downloadAllErrors: 'error',
        downloadSuiteScriptLogs: 'suitescriptlogs',
      };
      let downloadUrl = `/api/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${job._id}/download?jobType=${job.type}&fileType=${fileTypeMap[action]}`;

      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        downloadUrl += `&integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      openExternalUrl({ url: downloadUrl });
    } else if (action === 'resolveJob') {
      closeSnackbar();
      dispatch(
        actions.suiteScript.job.resolveSelected({
          integrationId,
          ssLinkedConnectionId,
          jobs: [
            {
              jobId: job._id,
              jobType: job.type,
              log: job.log,
            },
          ],
        })
      );
      enqueueSnackbar({
        message: `${job.numError} errors marked as resolved.`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RESOLVE,
        handleClose(event, reason) {
          if (reason === 'undo') {
            return dispatch(
              actions.suiteScript.job.resolveUndo({
                jobId: job._id,
                jobType: job.type,
              })
            );
          }

          dispatch(
            actions.suiteScript.job.resolveCommit({
              jobs: [
                {
                  jobId: job._id,
                  jobType: job.type,
                  log: job.log,
                },
              ],
            })
          );
        },
      });
    } else if (['editFlow', 'viewFlow'].includes(action)) {
      // TODO: branch for dataloader flows. The url should use the segment /dataLoader/ if flow is DL.
      history.push(
        getRoutePath(
          `/suitescript/${ssLinkedConnectionId}/integrations/${integrationId}/flowBuilder/${flowDetails &&
            flowDetails._id}`
        )
      );
    } else if (action === 'runFlow') {
      dispatch(
        actions.suiteScript.flow.run({
          ssLinkedConnectionId,
          integrationId,
          flowId: flowDetails._flowId,
          _id: flowDetails._id,
        })
      );
      handleRunStart();
    }
  }

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler: handleCommsStatus,
  });

  return (
    <>
      <ArrowPopper
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
