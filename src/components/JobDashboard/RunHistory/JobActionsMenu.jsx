import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import actions from '../../../actions';
import JobFilesDownloadDialog from '../JobFilesDownloadDialog';
import EllipsisHorizontallIcon from '../../icons/EllipsisHorizontalIcon';
import DownloadIntegrationIcon from '../../icons/DownloadIntegrationIcon';
import DownloadIcon from '../../icons/DownloadIcon';
import PurgeIcon from '../../icons/PurgeIcon';
import { selectors } from '../../../reducers';

import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import messageStore from '../../../utils/messageStore';
import useConfirmDialog from '../../ConfirmDialog';

const useStyle = makeStyles({
  iconBtn: {
    padding: 0,
  },
});

export default function JobActionsMenu({
  job,
}) {
  const classes = useStyle();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilesDownloadDialog, setShowFilesDownloadDialog] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isPurgeFilesSuccess = useSelector(state => selectors.isPurgeFilesSuccess(state));

  const menuOptions = [];

  menuOptions.push({
    label: 'Download diagnostics',
    action: 'downloadDiagnostics',
    icon: <DownloadIntegrationIcon />,
  });
  if (job.files && job.files.length > 0) {
    menuOptions.push({
      label: `${job.files.length > 1 ? 'Download files' : 'Download file'}`,
      action: 'downloadFiles',
      icon: <DownloadIcon />,
    });
    menuOptions.push({
      label: `${job.files.length > 1 ? 'Purge files' : 'Purge file'}`,
      action: 'purgeFiles',
      icon: <PurgeIcon />,
    });
  }

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handlePurge = useCallback(() => {
    dispatch(actions.job.purge.request({ jobId: job._id }));
  }, [dispatch, job._id]);

  const handleClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm purge files',
      message: messageStore('FILE_PURGE_CONFIRM_MESSAGE'),
      buttons: [
        {
          label: 'Purge files',
          error: true,
          onClick: handlePurge,
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, handlePurge]);

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

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
    } else if (action === 'purgeFiles') {
      handleClick();
    }
  }

  function handleJobFilesDownloadDialogCloseClick() {
    setShowFilesDownloadDialog(false);
  }

  useEffect(() => {
    if (isPurgeFilesSuccess) {
      enqueueSnackbar({
        message: messageStore('FILE_PURGE_SUCCESS_MESSAGE'),
        variant: 'success',
      });
      dispatch(actions.job.purge.clar());
    }
  }, [dispatch, enqueueSnackbar, isPurgeFilesSuccess]);

  return (
    <>
      {showFilesDownloadDialog && (
        <JobFilesDownloadDialog
          job={job}
          onCloseClick={handleJobFilesDownloadDialogCloseClick}
        />
      )}

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
            {opt.icon}{opt.label}
          </MenuItem>
        ))}
      </Menu>
      <IconButton
        data-test="moreJobActionsMenu"
        className={classes.iconBtn}
        onClick={handleMenuClick}
        disabled={menuOptions.length === 0}>
        <EllipsisHorizontallIcon />
      </IconButton>
    </>
  );
}
