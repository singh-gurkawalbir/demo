import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import actions from '../../../actions';
import JobFilesDownloadDialog from '../JobFilesDownloadDialog';
import EllipsisHorizontallIcon from '../../icons/EllipsisHorizontalIcon';
import DownloadIntegrationIcon from '../../icons/DownloadIntegrationIcon';
import DownloadIcon from '../../icons/DownloadIcon';
import PurgeIcon from '../../icons/PurgeIcon';
import { message } from '../../../utils/messageStore';
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
      label: 'Purge files',
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
      message: message.PURGE.FILE_PURGE_CONFIRM_MESSAGE,
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

  return (
    <>
      {showFilesDownloadDialog && (
      <JobFilesDownloadDialog
        job={job}
        onCloseClick={handleJobFilesDownloadDialogCloseClick}
      />
      )}

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
            {opt.icon}{opt.label}
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
