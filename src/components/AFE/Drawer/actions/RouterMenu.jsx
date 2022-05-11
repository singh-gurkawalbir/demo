/* eslint-disable no-param-reassign */
import React, { useState, useCallback } from 'react';
import {
  ClickAwayListener,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import ArrowPopper from '../../../ArrowPopper';
import EllipsisHorizontalIcon from '../../../icons/EllipsisHorizontalIcon';
import TrashIcon from '../../../icons/TrashIcon';
import useConfirmDialog from '../../../ConfirmDialog';
import RawHtml from '../../../RawHtml';

export default function RouterMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const open = Boolean(anchorEl);

  const handleCloseMenu = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleOpenMenu = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = useCallback(event => {
    handleCloseMenu(event);

    /* TODO: What is this message supposed to say? */
    const message = '<p>Are you sure you want to delete all branching?</p>';

    confirmDialog({
      title: 'Confirm delete',
      message: <RawHtml html={message} />,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            /* TODO: dispatch action to delete router */
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  },
  [confirmDialog]
  );

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <IconButton size="small" onClick={handleOpenMenu}>
          <EllipsisHorizontalIcon />
        </IconButton>
      </ClickAwayListener>

      <ArrowPopper
        id="routerOptions"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDelete}>
          <TrashIcon /> Delete branching
        </MenuItem>
      </ArrowPopper>
    </>
  );
}
