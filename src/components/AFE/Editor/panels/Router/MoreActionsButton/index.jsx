/* eslint-disable no-param-reassign */
import React, { useState, useCallback } from 'react';
import {
  ClickAwayListener,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import ArrowPopper from '../../../../../ArrowPopper';
import EllipsisHorizontalIcon from '../../../../../icons/EllipsisHorizontalIcon';
import EditIcon from '../../../../../icons/EditIcon';
import TrashIcon from '../../../../../icons/TrashIcon';
import useConfirmDialog from '../../../../../ConfirmDialog';
import RawHtml from '../../../../../RawHtml';

export default function MoreActionsButton({pageProcessors = []}) {
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

  const handleDeleteBranch = useCallback(event => {
    handleCloseMenu(event);

    const configuredCount = pageProcessors.filter(pp => !!pp.type).length;
    const unconfiguredCount = pageProcessors.filter(pp => !pp.type).length;
    const message = `<p>Are you sure you want to delete this branch?</p>
      <p>This will also remove all steps/branchings inside this branch 
      (${configuredCount} configured steps, ${unconfiguredCount} unconfigured steps).</p>`;

    confirmDialog({
      title: 'Confirm delete',
      message: <RawHtml html={message} />,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            /* TODO: dispatch action to delete branch */
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
        id="branchOptions"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>
          <EditIcon /> Edit branch name/description
        </MenuItem>

        <MenuItem onClick={handleDeleteBranch}>
          <TrashIcon /> Delete branch
        </MenuItem>
      </ArrowPopper>
    </>
  );
}
