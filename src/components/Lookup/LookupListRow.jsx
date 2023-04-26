import React, { useCallback, useState } from 'react';
import { IconButton, TableCell, TableRow, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowPopper } from '@celigo/fuse-ui';
import EditIcon from '../icons/EditIcon';
import DeleteOutlinedIcon from '../icons/TrashIcon';
import EllipsisIcon from '../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));

export default function LookupListRow(props) {
  const componentClasses = useStyles();
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

  const handleMenuClick = event => {
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

        <ArrowPopper
          id={actionsPopoverId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}>
          <MenuItem key="Edit" onClick={handleEdit}><EditIcon />Edit lookup</MenuItem>
          <MenuItem key="Delete" className={componentClasses.deleteWrapper} onClick={handleDelete}><DeleteOutlinedIcon />Delete lookup</MenuItem>
        </ArrowPopper>
      </TableCell>
    </TableRow>
  );
}
