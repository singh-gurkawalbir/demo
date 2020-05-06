import { useCallback } from 'react';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import EditIcon from '../icons/EditIcon';
import DeleteOutlinedIcon from '../icons/TrashIcon';

const useStyles = makeStyles({
  label: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '75%',
    float: 'left',
  },
  rowContainer: {
    display: 'flex',
  },
});

export default function LookupListRow(props) {
  const { value, onEdit, onDelete } = props;
  const { name } = value;
  const classes = useStyles();
  const handleEdit = useCallback(() => {
    onEdit(value);
  }, [onEdit, value]);
  const handleDelete = useCallback(() => {
    onDelete(value);
  }, [onDelete, value]);

  return (
    <div className={classes.rowContainer}>
      <Typography className={classes.label}>{name}</Typography>
      <div>
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
      </div>
    </div>
  );
}
