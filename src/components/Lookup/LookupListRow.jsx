import React, { useCallback, useState } from 'react';
import { IconButton, TableCell, TableRow, Menu, MenuItem } from '@material-ui/core';
import EditIcon from '../icons/EditIcon';
import DeleteOutlinedIcon from '../icons/TrashIcon';
import EllipsisIcon from '../icons/EllipsisHorizontalIcon';

export default function LookupListRow(props) {
  const { value, onEdit, onDelete, classes } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const { name } = value;
  const handleEdit = useCallback(() => {
    onEdit(value);
  }, [onEdit, value]);
  const handleDelete = useCallback(() => {
    onDelete(value);
  }, [onDelete, value]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  return (
    <TableRow
      classes={{
        root: classes.row,
      }}>
      <TableCell className={classes.columnName}>{name}</TableCell>
      <TableCell className={classes.columnAction}>
        <IconButton
          data-test="openActionsMenu"
          aria-label="more"
          aria-controls={actionsPopoverId}
          aria-haspopup="true"
          size="small"
          onClick={handleMenuClick}>
          <EllipsisIcon />
        </IconButton>

        <Menu
          elevation={2}
          variant="menu"
          id={actionsPopoverId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}>
          <MenuItem key="Edit" onClick={handleEdit}><EditIcon />Edit lookup</MenuItem>
          <MenuItem key="Delete" onClick={handleDelete}><DeleteOutlinedIcon />Delete lookup</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
