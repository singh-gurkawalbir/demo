import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import actions from '../../../actions';
import JobFilesDownloadDialog from '../JobFilesDownloadDialog';
import EllipsisHorizontallIcon from '../../icons/EllipsisHorizontalIcon';
import DownloadIntegrationIcon from '../../icons/DownloadIntegrationIcon';
import DownloadIcon from '../../icons/DownloadIcon';

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
  }

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
