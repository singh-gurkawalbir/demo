import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import EllipsisHorizontallIcon from '../../../icons/EllipsisHorizontalIcon';

import CancelIcon from '../../../icons/CancelIcon';

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
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);

  const menuOptions = [{ label: 'Cancel', action: 'cancelJob', icon: <CancelIcon /> }];

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleActionClick(action) {
    handleMenuClose();

    if (action === 'cancelJob') {
      confirmDialog({
        title: 'Confirm cancel',
        message:
          'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: () => {
              dispatch(actions.job.cancel({ jobId: job._id }));
            },
          },
          {
            label: 'No, go back',
            color: 'secondary',
          },
        ],
      });
    }
  }

  return (
    <>
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
