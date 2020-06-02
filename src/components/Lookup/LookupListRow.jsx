import { useCallback } from 'react';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import EditIcon from '../icons/EditIcon';
import DeleteOutlinedIcon from '../icons/TrashIcon';

export default function LookupListRow(props) {
  const { value, onEdit, onDelete, classes } = props;
  const { name } = value;
  const handleEdit = useCallback(() => {
    onEdit(value);
  }, [onEdit, value]);
  const handleDelete = useCallback(() => {
    onDelete(value);
  }, [onDelete, value]);

  return (
    <TableRow>
      <TableCell className={classes.columnName}>{name}</TableCell>
      <TableCell className={classes.columnAction}>
        <IconButton
          key="Edit"
          aria-label="Edit"
          data-test="edit"
          color="inherit"
          onClick={handleEdit}>
          <EditIcon />
        </IconButton>

        <IconButton
          data-test="delete"
          key="Delete"
          aria-label="Delete"
          color="inherit"
          onClick={handleDelete}>
          <DeleteOutlinedIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
