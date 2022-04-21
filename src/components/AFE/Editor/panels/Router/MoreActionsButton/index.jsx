/* eslint-disable no-param-reassign */
import { ClickAwayListener, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import ArrowPopper from '../../../../../ArrowPopper';
import EllipsisHorizontalIcon from '../../../../../icons/EllipsisHorizontalIcon';
import AddIcon from '../../../../../icons/AddIcon';
import TrashIcon from '../../../../../icons/TrashIcon';

const useStyles = makeStyles({
  root: { minWidth: 36 },
});

const BranchListItem = ({onClick, text, children}) => {
  const classes = useStyles();

  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon classes={{root: classes.root}}>
        {children}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  );
};

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
          <BranchListItem text="Add description" onClick={handleCloseMenu}>
            <AddIcon />
          </BranchListItem>

          <BranchListItem text="Delete branch" onClick={handleCloseMenu}>
            <TrashIcon />
          </BranchListItem>
        </List>
      </ArrowPopper>
    </>
  );
}
