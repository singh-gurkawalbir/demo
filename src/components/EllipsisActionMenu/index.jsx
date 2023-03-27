import React, { useCallback, useState} from 'react';
import { IconButton, MenuItem } from '@mui/material';
import { ArrowPopper } from '@celigo/fuse-ui';
import EllipsisIconHorizontal from '../icons/EllipsisHorizontalIcon';
import EllipsisIconVertical from '../icons/EllipsisVerticalIcon';
import {TextButton} from '../Buttons';

const ActionLabel = (({ label, Icon }) => {
  if (Icon) {
    return (<><Icon /> {label}</>);
  }

  return label;
});

export default function EllipsisActionMenu({ actionsMenu, label, onAction, alignment }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'more-row-actions' : undefined;

  const handleAction = useCallback(action => () => {
    handleMenuClose();
    onAction(action);
  }, [onAction, handleMenuClose]);

  return (
    <>
      {label ? (
        <TextButton
          data-test="openActionsMenu"
          aria-label="more"
          aria-controls={actionsPopoverId}
          aria-haspopup="true"
          onClick={handleMenuClick}
          startIcon={alignment === 'vertical' ? <EllipsisIconVertical /> : <EllipsisIconHorizontal />} >
          {label}
        </TextButton>
      )
        : (
          <IconButton
            data-test="openActionsMenu"
            aria-label="more"
            aria-controls={actionsPopoverId}
            aria-haspopup="true"
            size="small"
            onClick={handleMenuClick}>
            {alignment === 'vertical' ? <EllipsisIconVertical /> : <EllipsisIconHorizontal />}
          </IconButton>
        )}
      <ArrowPopper
        id={actionsPopoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}>
        {actionsMenu?.map(({ action, label, Icon, disabled }) => (
          <MenuItem
            key={label}
            data-test={`${action}`}
            disabled={disabled}
            onClick={handleAction(action)}>
            <ActionLabel label={label} Icon={Icon} />
          </MenuItem>
        ))}
      </ArrowPopper>
    </>
  );
}
