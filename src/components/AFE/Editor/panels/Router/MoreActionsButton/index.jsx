/* eslint-disable no-param-reassign */
import { ClickAwayListener, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import ArrowPopper from '../../../../../ArrowPopper';
import EllipsisHorizontalIcon from '../../../../../icons/EllipsisHorizontalIcon';
import AddIcon from '../../../../../icons/AddIcon';
import TrashIcon from '../../../../../icons/TrashIcon';

export default function MoreActionsButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleOpenMenu = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

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
        <List dense>
          <ListItem button onClick={handleCloseMenu}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>Add Description longer and</ListItemText>
          </ListItem>

          <ListItem button onClick={handleCloseMenu}>
            <ListItemIcon>
              <TrashIcon />
            </ListItemIcon>
            <ListItemText>Delete branch</ListItemText>
          </ListItem>
        </List>
      </ArrowPopper>
    </>
  );
}
